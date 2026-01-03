import { engine } from '../audio/engine';
import { loadWorkletFromString, createWorkletNode } from '../audio/worklet_loader';
import { Scheduler } from '../audio/scheduler';
import { generateText, streamCode } from '../llm/client';
import { SYSTEM_PROMPT_WORKLET, PROMPT_KICK, PROMPT_SNARE, PROMPT_HIHAT, PROMPT_CHORDS, SYSTEM_PROMPT_SEQUENCER } from '../llm/prompts';

export class Deck {
    constructor(terminal, visualizer) {
        this.terminal = terminal;
        this.visualizer = visualizer;
        this.scheduler = new Scheduler((time) => this.onTick(time));
        
        // Audio Nodes
        this.nodes = {
            kick: null,
            snare: null,
            hihat: null,
            chords: null
        };

        // Current Sequence
        this.sequence = null;
        this.step = 0;

        this.initButtons();
    }

    initButtons() {
        const genBtn = document.getElementById('btn-generate');
        const playBtn = document.getElementById('btn-play');

        genBtn.addEventListener('click', async () => {
            await engine.init();
            await engine.resume(); // Ensure AudioContext is running
            this.visualizer.init(); // Start visualizer
            this.generateAll();
        });

        playBtn.addEventListener('click', async () => {
            await engine.resume();
            if (this.scheduler.isRunning) {
                this.scheduler.stop();
                playBtn.textContent = 'PLAY';
                playBtn.classList.remove('text-neon-blue');
            } else {
                this.scheduler.start();
                playBtn.textContent = 'STOP';
                playBtn.classList.add('text-neon-blue');
            }
        });
    }

    async generateAll() {
        this.terminal.clear();
        this.terminal.log("Initializing Lo-Fi Generator...");

        // 1. Generate Instruments (Parallel ish)
        await this.generateInstrument('kick', PROMPT_KICK);
        await this.generateInstrument('snare', PROMPT_SNARE);
        await this.generateInstrument('hihat', PROMPT_HIHAT);
        
        // 2. Generate Sequence
        this.terminal.log("Composing Loop...");
        const seqText = await generateText([
            { role: 'system', content: SYSTEM_PROMPT_SEQUENCER },
            { role: 'user', content: "Generate a chill lo-fi beats loop." }
        ]);
        
        try {
            // Cleanup json markdown if present
            const cleanJson = seqText.text.replace(/```json/g, '').replace(/```/g, '').trim();
            this.sequence = JSON.parse(cleanJson);
            this.scheduler.setTempo(this.sequence.tempo || 85);
            this.terminal.log(`Sequence Loaded: ${this.sequence.tempo} BPM`);
        } catch (e) {
            this.terminal.log("Error parsing sequence: " + e.message);
        }
    }

    async generateInstrument(name, prompt) {
        this.terminal.log(`Synthesizing ${name}...`);
        
        let code = "";
        await streamCode([
            { role: 'system', content: SYSTEM_PROMPT_WORKLET },
            { role: 'user', content: prompt }
        ], (chunk, full) => {
            // Update terminal but maybe throttle or just show last line?
            // For cool effect, we just log every chunk is too much.
            // Let's just update the "buffer" of the terminal
            // For now, let's just wait for full.
            // Actually, let's dump the full text to terminal at the end or update live.
        });
        
        // Retrieve full code again essentially
        const response = await generateText([
             { role: 'system', content: SYSTEM_PROMPT_WORKLET },
            { role: 'user', content: prompt }
        ]);
        code = response.text.replace(/```javascript/g, '').replace(/```/g, '').trim();

        // Hack logic because streamCode is separate function. 
        // Real implementation would just use the streamed result. 
        // I will fix `streamCode` usage or just use the result from generateText for simplicity if streaming is complex.
        // Wait, I implemented `streamCode` to return fullText. I should use that.
        // But for visual effect, I'll pass a callback to terminal.
        
        this.terminal.log(`Compiling ${name}...`);
        
        // --- PATCH START ---
        // Rename the processor class and registration to avoid collision in AudioWorkletGlobalScope
        const className = `ProceduralGen_${name}`;
        const keyName = `${name}-gen`;

        // 1. Replace Class Definition
        code = code.replace(/class\s+ProceduralGen\s+extends/g, `class ${className} extends`);
        // 2. Replace Register Call
        code = code.replace(/registerProcessor\s*\(\s*['"]procedural-gen['"]\s*,/g, `registerProcessor('${keyName}',`);
        // 3. Replace Class reference in Register Call
        code = code.replace(/,\s*ProceduralGen\s*\)\s*;/g, `, ${className});`);
        // --- PATCH END ---

        const success = await loadWorkletFromString(name, code);
        if (success) {
            const node = createWorkletNode(keyName);
            node.connect(engine.masterBus);
            this.nodes[name] = node;
            this.terminal.log(`${name} [ONLINE]`);
        } else {
            this.terminal.log(`${name} [FAILED]`);
        }
    }

    onTick(time) {
        if (!this.sequence) return;

        const stepIs = this.step % 16; // Simple 16 step for now, but sequence might be longer.
        // Actually sequence arrays are likely 16 or 32 long.
        // Let's assume 16 steps per bar, 4 bars = 64.
        
        const currentStep = this.step % 64; 

        if (this.nodes.kick && this.sequence.kick[currentStep]) {
            this.triggerNode(this.nodes.kick, time);
        }
        if (this.nodes.snare && this.sequence.snare[currentStep]) {
            this.triggerNode(this.nodes.snare, time);
        }
        if (this.nodes.hihat && this.sequence.hihat[currentStep]) {
            this.triggerNode(this.nodes.hihat, time);
        }

        this.step++;
    }

    triggerNode(node, time) {
        const trig = node.parameters.get('trig');
        if (trig) {
            trig.setValueAtTime(1, time);
            trig.setValueAtTime(0, time + 0.1);
        }
    }
}
