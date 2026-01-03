import { engine } from '../audio/engine';

export class Visualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.analyser = null;
        this.dataArray = null;
        this.isRunning = false;
        
        // Resize observer
        new ResizeObserver(() => this.resize()).observe(this.canvas);
    }

    init() {
        if (!engine.ctx) return;
        
        this.analyser = engine.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        
        // Connect Master Bus -> Analyser
        if (engine.masterBus) {
             // We need to tap into the master bus. Ideally engine exposes a 'connectVisualizer' method
             // For now assuming we can connect masterBus output to analyser (and then to destination)
             engine.masterBus.connect(this.analyser);
        }
        
        this.resize();
        this.start();
    }

    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    start() {
        this.isRunning = true;
        this.draw();
    }

    draw() {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this.draw());

        if (!this.analyser) return;

        this.analyser.getByteFrequencyData(this.dataArray);

        const width = this.canvas.width;
        const height = this.canvas.height;
        const barWidth = (width / this.dataArray.length) * 2.5;
        let x = 0;

        this.ctx.fillStyle = 'rgba(15, 5, 24, 0.2)'; // Fade effect
        this.ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < this.dataArray.length; i++) {
            const barHeight = this.dataArray[i] / 2;
            
            // Synthwave Gradient: Purple to Cyan
            const gradient = this.ctx.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, '#b026ff');
            gradient.addColorStop(1, '#00e9ff');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
}
