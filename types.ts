
export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export enum ModelProvider {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GROQ = 'groq'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  provider: ModelProvider;
  createdAt: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  description: string;
}
