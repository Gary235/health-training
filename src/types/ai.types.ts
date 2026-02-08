import type { UserProfile } from './user.types';
import type { MealPlan, TrainingPlan } from './plan.types';
import type { AdherenceAnalysis } from './log.types';

export type AIProvider = 'openai' | 'anthropic' | 'mock';

export interface AIServiceConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface MealPlanRequest {
  userProfile: UserProfile;
  startDate: Date;
  durationDays: number;
  adjustmentContext?: {
    adherenceAnalysis: AdherenceAnalysis;
    specificRequests?: string;
  };
}

export interface TrainingPlanRequest {
  userProfile: UserProfile;
  startDate: Date;
  durationWeeks: number;
  currentMealPlan?: MealPlan;
  adjustmentContext?: {
    adherenceAnalysis: AdherenceAnalysis;
    specificRequests?: string;
  };
}

export interface MealPlanResponse {
  plan: MealPlan;
  generationNotes?: string;
}

export interface TrainingPlanResponse {
  plan: TrainingPlan;
  generationNotes?: string;
}

export interface PlanAdjustmentRequest {
  planType: 'meal' | 'training';
  currentPlanId: string;
  adherenceAnalysis: AdherenceAnalysis;
  userProfile: UserProfile;
  specificRequests?: string;
}

export interface MealEditRequest {
  meal: any; // Meal type from plan.types.ts
  userProfile: UserProfile;
  editInstructions: string;
  dailyMealContext?: {
    otherMeals: any[]; // Other meals in the same day
    currentDailyNutrition: any; // NutritionInfo
    targetDailyNutrition: any; // NutritionInfo
  };
}

export interface MealEditResponse {
  meal: any; // Updated Meal type
  editNotes?: string;
}

// Feature 1: Expand Instructions Request/Response
export interface ExpandInstructionsRequest {
  recipe: any; // Recipe from plan.types.ts
  targetLevel: 'quick' | 'standard' | 'detailed';
  userProfile: UserProfile;
}

export interface ExpandInstructionsResponse {
  instructions: {
    quick: string[];
    standard: string[];
    detailed: string[];
  };
  notes?: string;
}

// Feature 2: Recipe Variation Request/Response
export interface RecipeVariationRequest {
  recipe: any; // Recipe from plan.types.ts
  userProfile: UserProfile;
  variationCount: number;
  variationType?: 'protein_swap' | 'vegetarian' | 'lower_calorie' | 'general';
  dailyMealContext?: {
    otherMeals: any[];
    currentDailyNutrition: any;
    targetDailyNutrition: any;
  };
}

export interface RecipeVariationResponse {
  variations: any[]; // Array of Recipe variants
  notes?: string;
}

export interface AIError {
  code: string;
  message: string;
  details?: unknown;
}

// Abstract AI Service Interface
export interface IAIService {
  readonly provider: AIProvider;
  readonly isConfigured: boolean;

  configure(config: AIServiceConfig): void;

  generateMealPlan(request: MealPlanRequest): Promise<MealPlanResponse>;

  generateTrainingPlan(request: TrainingPlanRequest): Promise<TrainingPlanResponse>;

  adjustPlan(request: PlanAdjustmentRequest): Promise<MealPlanResponse | TrainingPlanResponse>;

  editMeal(request: MealEditRequest): Promise<MealEditResponse>;

  // Feature 1: Expand meal instructions
  expandInstructions(request: ExpandInstructionsRequest): Promise<ExpandInstructionsResponse>;

  // Feature 2: Generate recipe variations
  generateRecipeVariations(request: RecipeVariationRequest): Promise<RecipeVariationResponse>;

  healthCheck(): Promise<boolean>;
}

// Prompt Templates
export interface PromptContext {
  userProfile: UserProfile;
  planType: 'meal' | 'training';
  duration: number;
  adjustmentContext?: {
    adherenceAnalysis: AdherenceAnalysis;
    specificRequests?: string;
  };
}

export interface GeneratedPrompt {
  systemPrompt: string;
  userPrompt: string;
  responseFormat?: unknown;
}
