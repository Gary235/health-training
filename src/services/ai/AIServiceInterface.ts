import type {
  AIProvider,
  AIServiceConfig,
  IAIService,
  MealPlanRequest,
  MealPlanResponse,
  TrainingPlanRequest,
  TrainingPlanResponse,
  PlanAdjustmentRequest,
  MealEditRequest,
  MealEditResponse,
} from '../../types/ai.types';

export abstract class BaseAIService implements IAIService {
  protected config: AIServiceConfig;
  abstract readonly provider: AIProvider;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  get isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  configure(config: AIServiceConfig): void {
    this.config = { ...this.config, ...config };
  }

  abstract generateMealPlan(request: MealPlanRequest): Promise<MealPlanResponse>;

  abstract generateTrainingPlan(
    request: TrainingPlanRequest
  ): Promise<TrainingPlanResponse>;

  abstract adjustPlan(
    request: PlanAdjustmentRequest
  ): Promise<MealPlanResponse | TrainingPlanResponse>;

  abstract editMeal(request: MealEditRequest): Promise<MealEditResponse>;

  abstract healthCheck(): Promise<boolean>;

  protected handleError(error: unknown, context: string): never {
    console.error(`${this.provider} AI Service Error (${context}):`, error);
    throw new Error(
      `AI Service Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export type { IAIService };
