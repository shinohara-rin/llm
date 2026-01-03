export class Terminal {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.content = [];
        this.maxLines = 50;
    }

    log(text) {
        this.content.push(text);
        if (this.content.length > this.maxLines) {
            this.content.shift();
        }
        this.render();
    }

    clear() {
        this.content = [];
        this.render();
    }

    stream(chunk, fullText) {
        // For streaming, we might just update the last line or full body
        // Simple approach: Replace content with full text lines
        this.content = fullText.split('\n');
        // Auto scroll to bottom
        this.render();
    }

    render() {
        if (!this.element) return;
        this.element.innerHTML = this.content.join('\n');
        this.element.scrollTop = this.element.scrollHeight;
    }
}
