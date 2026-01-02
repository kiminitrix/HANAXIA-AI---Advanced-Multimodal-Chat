
import { ModelConfig, ModelProvider } from './types';

export const MODELS: ModelConfig[] = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    provider: ModelProvider.GEMINI,
    description: 'Ultra-fast, cost-efficient multimodal reasoning.'
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro',
    provider: ModelProvider.GEMINI,
    description: 'Advanced reasoning for complex tasks.'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Preview)',
    provider: ModelProvider.OPENAI,
    description: 'High intelligence and versatile multimodal.'
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: ModelProvider.ANTHROPIC,
    description: 'The standard for high-performance AI.'
  },
  {
    id: 'llama-3-1-70b',
    name: 'Llama 3.1 70B',
    provider: ModelProvider.GROQ,
    description: 'Lightning-fast open-source intelligence.'
  }
];

export const INITIAL_SYSTEM_PROMPT = "You are Nexus AI, a helpful and highly intelligent AI assistant. Provide concise, accurate, and professional responses.";
