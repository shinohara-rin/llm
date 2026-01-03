import { saveConfig, getStoredConfig } from '../llm/client';

export class SettingsModal {
    constructor(modalId, btnId) {
        this.modal = document.getElementById(modalId);
        this.btn = document.getElementById(btnId);
        this.closeBtn = this.modal.querySelector('.close-settings');
        this.saveBtn = this.modal.querySelector('.save-settings');
        
        this.apiKeyInput = document.getElementById('api-key');
        this.baseUrlInput = document.getElementById('base-url');

        this.init();
    }

    init() {
        const config = getStoredConfig();
        this.apiKeyInput.value = config.apiKey;
        this.baseUrlInput.value = config.baseURL || 'https://api.openai.com/v1';

        this.btn.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
        this.saveBtn.addEventListener('click', () => this.save());
        
        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open() {
        this.modal.classList.remove('hidden');
    }

    close() {
        this.modal.classList.add('hidden');
    }

    save() {
        const config = {
            apiKey: this.apiKeyInput.value.trim(),
            baseURL: this.baseUrlInput.value.trim(),
            model: 'gpt-4o' // Defaults to gpt-4o or user choice if we add it
        };
        saveConfig(config);
        this.close();
        alert('Settings Saved!');
    }
}
