export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterBus = null;
        this.compressor = null;
        this.isPlaying = false;
    }

    async init() {
        if (this.ctx) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        
        // Master Bus Chain: Compressor -> Destination
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-24, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        this.compressor.connect(this.ctx.destination);
        this.masterBus = this.compressor;

        console.log("Audio Engine Initialized");
    }

    async resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    }

    get currentTime() {
        return this.ctx ? this.ctx.currentTime : 0;
    }
}

export const engine = new AudioEngine();
