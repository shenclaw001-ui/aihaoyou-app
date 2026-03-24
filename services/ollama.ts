import { Platform } from 'react-native';

const OLLAMA_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:11434', // Android emulator host
  ios: 'http://localhost:11434',
  default: 'http://localhost:11434',
});

export type OllamaModel = {
  name: string;
  modified_at: string;
  size: number;
};

export async function listModels(): Promise<OllamaModel[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Failed to fetch Ollama models:', error);
    return [];
  }
}

export async function generate(prompt: string, model: string = 'llama3.1:8b'): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { temperature: 0.7, top_p: 0.9 },
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.response?.trim() || 'No response from model.';
  } catch (error) {
    console.error('Ollama generate error:', error);
    throw error;
  }
}

export async function chat(messages: { role: string; content: string }[], model: string = 'llama3.1:8b'): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.message?.content?.trim() || 'No response from model.';
  } catch (error) {
    console.error('Ollama chat error:', error);
    throw error;
  }
}