import type { AIProvider } from './ai.types';

export interface AppSettings {
  id: string; // Always use 'default' as the single settings record
  aiProvider: AIProvider;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  updatedAt: Date;
}
