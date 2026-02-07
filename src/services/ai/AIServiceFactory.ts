import type { IAIService } from './AIServiceInterface';
import type { AIProvider, AIServiceConfig } from '../../types/ai.types';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { MockProvider } from './providers/MockProvider';
import { getSettings } from '../db/settingsService';

class AIServiceFactory {
  private static instance: AIServiceFactory;
  private currentService: IAIService | null = null;
  private config: AIServiceConfig;
  private initialized: boolean = false;

  private constructor() {
    // Initialize with defaults - will be updated from DB
    this.config = {
      provider: 'mock',
      apiKey: undefined,
      model: 'gpt-5-mini',
      temperature: 0.7,
      maxTokens: 10000,
    };
  }

  private async initializeFromDatabase(): Promise<void> {
    if (this.initialized) return;

    try {
      const settings = await getSettings();
      this.config = {
        ...this.config,
        provider: settings.aiProvider,
        apiKey: settings.openaiApiKey,
      };
      this.initializeService();
      this.initialized = true;
      console.log('[AIServiceFactory] Initialized from database');
    } catch (error) {
      console.error('[AIServiceFactory] Failed to initialize from database:', error);
      // Fall back to mock provider
      this.config.provider = 'mock';
      this.initializeService();
      this.initialized = true;
    }
  }

  public static getInstance(): AIServiceFactory {
    if (!AIServiceFactory.instance) {
      AIServiceFactory.instance = new AIServiceFactory();
    }
    return AIServiceFactory.instance;
  }

  private initializeService(): void {
    switch (this.config.provider) {
      case 'openai':
        this.currentService = new OpenAIProvider(this.config);
        break;
      case 'mock':
        this.currentService = new MockProvider(this.config);
        break;
      default:
        console.warn(`Unknown AI provider: ${this.config.provider}, using mock`);
        this.currentService = new MockProvider(this.config);
    }
  }

  public async getService(): Promise<IAIService> {
    await this.initializeFromDatabase();
    if (!this.currentService) {
      throw new Error('AI Service not initialized');
    }
    return this.currentService;
  }

  public async switchProvider(provider: AIProvider, apiKey?: string): Promise<void> {
    await this.initializeFromDatabase();
    this.config.provider = provider;
    if (apiKey) {
      this.config.apiKey = apiKey;
    }
    this.initializeService();
  }

  public configure(config: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...config };
    if (this.currentService) {
      this.currentService.configure(this.config);
    }
  }

  public getConfig(): AIServiceConfig {
    return { ...this.config };
  }

  public isConfigured(): boolean {
    return this.currentService?.isConfigured || false;
  }
}

// Export singleton instance getter
export const getAIService = async (): Promise<IAIService> => {
  return await AIServiceFactory.getInstance().getService();
};

export const configureAIService = (config: Partial<AIServiceConfig>): void => {
  AIServiceFactory.getInstance().configure(config);
};

export const switchAIProvider = async (provider: AIProvider, apiKey?: string): Promise<void> => {
  await AIServiceFactory.getInstance().switchProvider(provider, apiKey);
};

export default AIServiceFactory;
