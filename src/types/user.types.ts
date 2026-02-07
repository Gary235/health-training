export type Gender = 'male' | 'female' | 'other';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | 'athlete';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
export type DietaryRestriction = 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'halal' | 'kosher' | 'gluten_free' | 'dairy_free' | 'nut_free';
export type GoalType = 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'maintenance' | 'endurance' | 'strength' | 'flexibility';
export type MeasurementSystem = 'metric' | 'imperial';

export interface BodySpecifications {
  height: number; // cm or inches based on measurementSystem
  weight: number; // kg or lbs based on measurementSystem
  age: number;
  gender: Gender;
  fitnessLevel: FitnessLevel;
  activityLevel: ActivityLevel;
  measurementSystem: MeasurementSystem;
}

export interface UserPreferences {
  dietaryRestrictions: DietaryRestriction[];
  allergies: string[];
  foodLikes: string[];
  foodDislikes: string[];
  cuisinePreferences: string[];
  equipmentAvailable: string[]; // e.g., ['dumbbells', 'resistance_bands', 'pull_up_bar']
  workoutLocation: 'home' | 'gym' | 'outdoor' | 'mixed';
}

export interface DayAvailability {
  available: boolean;
  timeSlots?: string[]; // e.g., ['morning', 'afternoon', 'evening'] or specific times
  location?: 'gym' | 'home' | 'outdoor'; // Where the training happens on this day
}

export interface UserSchedule {
  trainingDays: {
    monday: DayAvailability;
    tuesday: DayAvailability;
    wednesday: DayAvailability;
    thursday: DayAvailability;
    friday: DayAvailability;
    saturday: DayAvailability;
    sunday: DayAvailability;
  };
  mealTimes: {
    breakfast?: string; // e.g., '07:00'
    lunch?: string;
    dinner?: string;
    snacks?: string[];
  };
  sleepSchedule: {
    bedtime: string; // e.g., '22:00'
    wakeTime: string; // e.g., '06:00'
  };
  preferredWorkoutTime?: 'morning' | 'afternoon' | 'evening';
}

export interface UserGoals {
  primary: GoalType;
  secondary?: GoalType[];
  targetWeight?: number; // kg or lbs
  targetDate?: Date;
  weeklyWeightChangeGoal?: number; // kg or lbs per week
  specificGoals?: string[]; // e.g., ['run 5k', 'bench press 100kg']
  motivations?: string[];
}

export interface UserProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  bodySpecs: BodySpecifications;
  preferences: UserPreferences;
  schedule: UserSchedule;
  goals: UserGoals;
  onboardingCompleted: boolean;
}
