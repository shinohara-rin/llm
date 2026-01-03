import { engine } from './engine';

export async function loadWorkletFromString(name, code) {
    if (!engine.ctx) return false;

    try {
        const blob = new Blob([code], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        
        await engine.ctx.audioWorklet.addModule(url);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        console.log(`Worklet '${name}' loaded successfully`);
        return true;
    } catch (e) {
        console.error(`Failed to load worklet '${name}':`, e);
        return false;
    }
}

export function createWorkletNode(name, options = {}) {
    if (!engine.ctx) throw new Error("Audio Context not initialized");
    return new AudioWorkletNode(engine.ctx, name, options);
}
