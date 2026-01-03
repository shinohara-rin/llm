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
