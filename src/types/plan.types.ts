export type PlanStatus = 'active' | 'completed' | 'archived';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'balance' | 'mixed';
export type IntensityLevel = 'low' | 'moderate' | 'high' | 'very_high';

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
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  nutrition: NutritionInfo;
  tags?: string[];
}

export interface Meal {
  id: string;
  type: MealType;
  scheduledTime: string; // HH:mm format
  recipe: Recipe;
  alternatives?: Recipe[];
  notes?: string;
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
