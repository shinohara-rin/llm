import { saveConfig, getStoredConfig, fetchModels } from '../llm/client';

export class SettingsModal {
    constructor(modalId, btnId) {
        this.modal = document.getElementById(modalId);
        this.btn = document.getElementById(btnId);
        this.closeBtn = this.modal.querySelector('.close-settings');
        this.saveBtn = this.modal.querySelector('.save-settings');
        
        this.apiKeyInput = document.getElementById('api-key');
        this.baseUrlInput = document.getElementById('base-url');
        this.modelSelect = document.getElementById('model-select');
        this.refreshModelsBtn = document.getElementById('btn-refresh-models');

        this.init();
    }

    init() {
        const config = getStoredConfig();
        this.apiKeyInput.value = config.apiKey;
        this.baseUrlInput.value = config.baseURL || 'https://api.openai.com/v1';
        
        // Restore saved model or add as option if not in default list (we populate mostly dynamically)
        if (config.model && config.model !== 'gpt-4o') {
             // Create temporary option so it shows up even before fetch
             const opt = document.createElement('option');
             opt.value = config.model;
             opt.textContent = config.model;
             opt.selected = true;
             this.modelSelect.appendChild(opt);
        }

        this.btn.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
        this.saveBtn.addEventListener('click', () => this.save());
        this.refreshModelsBtn.addEventListener('click', () => this.populateModels());
        
        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    async populateModels() {
        // Temporarily save config to local storage so fetchModels can pick it up (it reads from localStorage in client.js)
        // Or we could refactor client.js to take args, but for now this is a quick fix to ensure fetchModels uses current inputs
        const currentConfig = {
             apiKey: this.apiKeyInput.value.trim(),
             baseURL: this.baseUrlInput.value.trim(),
             model: this.modelSelect.value
        };
        saveConfig(currentConfig);

        this.refreshModelsBtn.textContent = '...';
        this.refreshModelsBtn.disabled = true;

        try {
            const models = await fetchModels();
            // Clear existing except current if valid? Or just clear all.
            this.modelSelect.innerHTML = '';
            
            models.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = m.id;
                this.modelSelect.appendChild(opt);
            });
            
            // Re-select current if exists
            if (currentConfig.model) {
                this.modelSelect.value = currentConfig.model;
            }
            alert(`Fetched ${models.length} models.`);
        } catch (e) {
            alert("Failed to fetch models. Check API Key/URL.");
        } finally {
            this.refreshModelsBtn.textContent = '↻';
            this.refreshModelsBtn.disabled = false;
        }
    }

    open() {
        // Sync inputs from storage again in case they changed elsewhere
        const config = getStoredConfig();
        this.apiKeyInput.value = config.apiKey;
        this.baseUrlInput.value = config.baseURL || 'https://api.openai.com/v1';
        this.modal.classList.remove('hidden');
    }

    close() {
        this.modal.classList.add('hidden');
    }

    save() {
        const config = {
            apiKey: this.apiKeyInput.value.trim(),
            baseURL: this.baseUrlInput.value.trim(),
            model: this.modelSelect.value || 'gpt-4o'
        };
        saveConfig(config);
        this.close();
        
        // Visual feedback
        const originalText = this.saveBtn.textContent;
        this.saveBtn.textContent = "SAVED!";
        setTimeout(() => this.saveBtn.textContent = originalText, 1000);
    }
}
