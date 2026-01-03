import { generateText as xsaiGenerateText, streamText as xsaiStreamText } from 'xsai';

const CONFIG_KEY = 'lofi_llm_config';

export const getStoredConfig = () => {
    try {
        const stored = localStorage.getItem(CONFIG_KEY);
        return stored ? JSON.parse(stored) : { apiKey: '', baseURL: 'https://api.openai.com/v1', model: 'gpt-4o' };
    } catch {
        return { apiKey: '', baseURL: 'https://api.openai.com/v1', model: 'gpt-4o' };
    }
};

export const saveConfig = (config) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const generateText = async (messages) => {
    const config = getStoredConfig();
    if (!config.apiKey) throw new Error("API Key missing");

    return await xsaiGenerateText({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        model: config.model,
        messages
    });
};

export const streamCode = async (messages, onChunk) => {
    const config = getStoredConfig();
    if (!config.apiKey) throw new Error("API Key missing");

    const { textStream } = await xsaiStreamText({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        model: config.model,
        messages
    });

    let fullText = '';
    for await (const textPart of textStream) {
        fullText += textPart;
        onChunk(textPart, fullText);
    }
    return fullText;
};

export const fetchModels = async () => {
    const config = getStoredConfig();
    if (!config.apiKey) throw new Error("API Key missing");
    
    // Standard OpenAI-compatible models endpoint: GET /models
    // Remove trailing slash if present
    const baseUrl = config.baseURL.replace(/\/+$/, '');
    // If base url ends in /v1, we keep it. 
    // Usually it is https://api.openai.com/v1/models
    
    try {
        const response = await fetch(`${baseUrl}/models`, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }
        
        const data = await response.json();
        // Return standard list. Some APIs wrap in 'data', others might differ.
        // OpenAI standard is { data: [{ id: 'model-id', ... }] }
        return data.data || [];
    } catch (e) {
        console.error("Error fetching models:", e);
        throw e;
    }
};
