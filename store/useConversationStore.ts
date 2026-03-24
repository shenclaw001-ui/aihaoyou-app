import { create } from 'zustand';
import { generate, chat } from '../services/ollama';

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
};

type ConversationStore = {
  messages: Message[];
  currentModel: string;
  isProcessing: boolean;
  addMessage: (text: string, sender: 'user' | 'ai') => void;
  sendUserMessage: (text: string) => Promise<void>;
  setModel: (model: string) => void;
  clearConversation: () => void;
};

const useConversationStore = create<ConversationStore>((set, get) => ({
  messages: [],
  currentModel: 'llama3.1:8b',
  isProcessing: false,

  addMessage: (text, sender) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: Date.now(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  sendUserMessage: async (text) => {
    const { currentModel, messages, addMessage } = get();
    addMessage(text, 'user');
    set({ isProcessing: true });

    try {
      // Build chat history
      const chatHistory = messages.slice(-5).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));
      chatHistory.push({ role: 'user', content: text });

      const response = await chat(chatHistory, currentModel);
      addMessage(response, 'ai');
    } catch (error) {
      addMessage(`Sorry, I encountered an error: ${error.message}`, 'ai');
    } finally {
      set({ isProcessing: false });
    }
  },

  setModel: (model) => set({ currentModel: model }),

  clearConversation: () => set({ messages: [] }),
}));

export default useConversationStore;