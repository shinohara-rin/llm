import { engine } from './engine';

const LOOKAHEAD = 25.0; // How frequently to call scheduling function (in milliseconds)
const SCHEDULE_AHEAD_TIME = 0.1; // How far ahead to schedule audio (in seconds)

export class Scheduler {
    constructor(callback) {
        this.callback = callback; // Function to call to schedule notes
        this.nextNoteTime = 0.0;
        this.timerID = null;
        this.isRunning = false;
        this.tempo = 80; // BPM
    }

    start() {
        if (this.isRunning) return;
        
        if (engine.ctx && engine.ctx.state === 'suspended') {
            engine.ctx.resume();
        }

        this.isRunning = true;
        this.nextNoteTime = engine.currentTime + 0.1;
        this.tick();
    }

    stop() {
        this.isRunning = false;
        if (this.timerID) {
            clearTimeout(this.timerID);
        }
    }

    tick() {
        if (!this.isRunning) return;

        while (this.nextNoteTime < engine.currentTime + SCHEDULE_AHEAD_TIME) {
            this.scheduleNote(this.nextNoteTime);
            this.advanceNote();
        }

        this.timerID = setTimeout(() => this.tick(), LOOKAHEAD);
    }

    scheduleNote(time) {
        if (this.callback) {
            this.callback(time);
        }
    }

    advanceNote() {
        // Advance time by a 16th note
        const secondsPerBeat = 60.0 / this.tempo;
        this.nextNoteTime += 0.25 * secondsPerBeat;
    }
    
    setTempo(bpm) {
        this.tempo = bpm;
    }
}
