export type PlanStatus = 'active' | 'completed' | 'archived';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'balance' | 'mixed';
export type IntensityLevel = 'low' | 'moderate' | 'high' | 'very_high';

// Feature 1: Instruction Detail Levels
export type InstructionDetailLevel = 'quick' | 'standard' | 'detailed';

export interface RecipeInstructionSet {
  quick: string[];      // 2-3 brief steps
  standard: string[];   // 5-7 steps (default)
  detailed: string[];   // 10-15 comprehensive steps
}


// Import CookingMethod from user.types to avoid duplication
import type { CookingMethod } from './user.types';

// Nutrition Types
export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  fiber?: number; // grams
  sugar?: number; // grams
  sodium?: number; // mg
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  calories?: number;
  notes?: string;
}

export interface Recipe {
  id?: string;  // Feature 2: unique identifier for tracking variants
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  nutrition: NutritionInfo;
  tags?: string[];
  // Feature 1: Instruction detail levels
  instructionLevel?: InstructionDetailLevel;
  detailedInstructions?: RecipeInstructionSet;
  // Feature 2: Recipe variations
  variantType?: 'original' | 'variation';
  variantNotes?: string;  // Explain what changed (e.g., "Chicken → Tofu")
  // Feature 4: Cooking methods
  primaryCookingMethod?: CookingMethod;
  cookingMethods?: CookingMethod[];
}

export interface Meal {
  id: string;
  type: MealType;
  scheduledTime: string; // HH:mm format
  recipe: Recipe;
  alternatives?: Recipe[];
  notes?: string;
  // Feature 1: Track if instructions have been expanded
  instructionsExpanded?: boolean;
  // Feature 2: Track which recipe variant is active
  activeRecipeId?: string;
}

export interface DailyMealPlan {
  date: Date;
  meals: Meal[];
  dailyNutrition: NutritionInfo;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  dailyPlans: DailyMealPlan[];
  status: PlanStatus;
  createdAt: Date;
  generationContext?: {
    userPreferences: string[];
    adjustments?: string;
    previousPlanId?: string;
  };
}

// Training Types
export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: ExerciseType;
  muscleGroups: string[];
  equipment: string[];
  sets?: number;
  reps?: number;
  duration?: number; // seconds for timed exercises
  distance?: number; // meters for running, etc.
  restBetweenSets?: number; // seconds
  intensity: IntensityLevel;
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  alternatives?: string[]; // Alternative exercise names
  notes?: string;
}

export interface TrainingSession {
  id: string;
  date: Date;
  name: string;
  type: ExerciseType;
  duration: number; // minutes
  exercises: Exercise[];
  warmup?: Exercise[];
  cooldown?: Exercise[];
  scheduledTime?: string; // HH:mm format
  targetIntensity: IntensityLevel;
  estimatedCalories?: number;
  notes?: string;
}

export interface TrainingPlan {
  id: string;
  userId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  sessions: TrainingSession[];
  status: PlanStatus;
  createdAt: Date;
  focusAreas?: string[];
  generationContext?: {
    fitnessLevel: string;
    equipment: string[];
    adjustments?: string;
    previousPlanId?: string;
  };
}

// Shopping List Types
export interface ShoppingListItem {
  ingredient: string;
  amount: number;
  unit: string;
  category?: string; // e.g., 'produce', 'dairy', 'meat'
  day?: string; // e.g., 'Monday, Feb 6' for grouping by day
  meal?: MealType; // e.g., 'breakfast', 'lunch', 'dinner', 'snack' for subgrouping by meal
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  userId: string;
  mealPlanId: string;
  startDate: Date;
  endDate: Date;
  items: ShoppingListItem[];
  createdAt: Date;
}
