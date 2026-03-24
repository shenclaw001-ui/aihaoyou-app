import { Platform } from 'react-native';

const OLLAMA_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:11434/v1', // Android emulator host
  ios: 'http://localhost:11434/v1',
  default: 'http://localhost:11434/v1',
});

export type OllamaModel = {
  id: string;
  object: string;
  created: number;
  owned_by: string;
};

export async function listModels(): Promise<OllamaModel[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/models`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch Ollama models:', error);
    return [];
  }
}

export async function chat(messages: { role: string; content: string }[], model: string = 'llama3.1:8b'): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/chat/completions`, {
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
    return data.choices?.[0]?.message?.content?.trim() || 'No response from model.';
  } catch (error) {
    console.error('Ollama chat error:', error);
    throw error;
  }
}