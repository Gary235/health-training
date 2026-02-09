export type AdherenceLevel = 'full' | 'partial' | 'skipped';
export type DeviationReason =
  | 'time_constraint'
  | 'not_hungry'
  | 'food_unavailable'
  | 'didnt_like'
  | 'too_tired'
  | 'injury'
  | 'illness'
  | 'schedule_conflict'
  | 'lack_of_motivation'
  | 'equipment_unavailable'
  | 'other';

// Meal Logging
export interface Deviation {
  reason: DeviationReason;
  description?: string;
  impact?: 'minor' | 'moderate' | 'significant';
}

export interface MealLog {
  mealId: string;
  mealType: string; // breakfast, lunch, dinner, snack
  scheduledTime: string;
  actualTime?: string;
  completed: boolean;
  adherence: AdherenceLevel;
  deviations?: Deviation[];
  substitutions?: string[]; // What was eaten instead
  portionScale?: number; // 0.5 = ate half, 1.5 = ate 50% more, etc.
  notes?: string;
  actualNutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

// Training Logging
export type ExerciseDifficulty = 'possible' | 'difficult' | 'could_not_do';

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  completed: boolean;
  difficulty?: ExerciseDifficulty; // Track how challenging the exercise was
  actualSets?: number;
  actualReps?: number[];
  actualWeight?: number[];
  actualDuration?: number; // seconds
  actualDistance?: number; // meters
  perceivedIntensity?: 1 | 2 | 3 | 4 | 5; // RPE scale
  notes?: string;
}

export interface TrainingLog {
  sessionId: string;
  sessionName: string;
  scheduledTime?: string;
  startTime?: string;
  endTime?: string;
  completed: boolean;
  adherence: AdherenceLevel;
  exercises: ExerciseLog[];
  deviations?: Deviation[];
  perceivedExertion?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // Borg RPE scale
  actualCalories?: number;
  notes?: string;
}

// Body Metrics
export interface BodyMetrics {
  date: Date;
  weight?: number;
  bodyFat?: number; // percentage
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
    neck?: number;
  };
  photos?: {
    front?: string; // URL or base64
    side?: string;
    back?: string;
  };
  notes?: string;
}

// Daily Log
export interface DailyLog {
  id: string;
  userId: string;
  date: Date;
  mealLogs: MealLog[];
  trainingLogs: TrainingLog[];
  bodyMetrics?: BodyMetrics;
  overallAdherence: number; // 0-100 percentage
  waterIntake?: number; // liters or oz
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  sleepDuration?: number; // hours
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  stressLevel?: 1 | 2 | 3 | 4 | 5;
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  generalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Adherence Analysis
export interface AdherencePattern {
  type: 'meal' | 'training';
  itemId?: string;
  itemName: string;
  consecutiveMisses: number;
  missRate: number; // 0-1
  commonReasons: DeviationReason[];
  timingDeviations: {
    averageDelay: number; // minutes
    consistent: boolean;
  };
}

export interface AdherenceAnalysis {
  periodStart: Date;
  periodEnd: Date;
  overallAdherence: number;
  mealAdherence: number;
  trainingAdherence: number;
  patterns: AdherencePattern[];
  recommendations: string[];
  triggersAdjustment: boolean;
}
