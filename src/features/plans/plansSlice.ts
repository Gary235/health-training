import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { MealPlan, TrainingPlan, PlanStatus, Meal, NutritionInfo } from '../../types';
import { planRepository } from '../../services/db/repositories';

interface PlansState {
  mealPlans: MealPlan[];
  trainingPlans: TrainingPlan[];
  activeMealPlan: MealPlan | null;
  activeTrainingPlan: TrainingPlan | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlansState = {
  mealPlans: [],
  trainingPlans: [],
  activeMealPlan: null,
  activeTrainingPlan: null,
  loading: false,
  error: null,
};

// Async thunks - Meal Plans
export const loadMealPlans = createAsyncThunk(
  'plans/loadMealPlans',
  async (userId: string) => {
    return await planRepository.getMealPlans(userId);
  }
);

export const loadActiveMealPlan = createAsyncThunk(
  'plans/loadActiveMealPlan',
  async (userId: string) => {
    return await planRepository.getActiveMealPlan(userId);
  }
);

export const saveMealPlan = createAsyncThunk(
  'plans/saveMealPlan',
  async (plan: MealPlan) => {
    await planRepository.createMealPlan(plan);
    return plan;
  }
);

export const updateMealPlanStatus = createAsyncThunk(
  'plans/updateMealPlanStatus',
  async ({ planId, status }: { planId: string; status: PlanStatus }) => {
    await planRepository.updateMealPlan(planId, { status });
    return { planId, status };
  }
);

export const updateMealInPlan = createAsyncThunk(
  'plans/updateMealInPlan',
  async ({
    planId,
    dayIndex,
    mealId,
    updatedMeal,
  }: {
    planId: string;
    dayIndex: number;
    mealId: string;
    updatedMeal: Meal;
  }) => {
    // Load the plan from the database
    const plan = await planRepository.getMealPlan(planId);
    if (!plan) {
      throw new Error('Meal plan not found');
    }

    // Update the meal in the daily plan
    const dailyPlan = plan.dailyPlans[dayIndex];
    if (!dailyPlan) {
      throw new Error('Day not found in meal plan');
    }

    const mealIndex = dailyPlan.meals.findIndex(m => m.id === mealId);
    if (mealIndex === -1) {
      throw new Error('Meal not found in daily plan');
    }

    dailyPlan.meals[mealIndex] = updatedMeal;

    // Recalculate daily nutrition totals
    const dailyNutrition: NutritionInfo = dailyPlan.meals.reduce(
      (total, meal) => ({
        calories: total.calories + meal.recipe.nutrition.calories,
        protein: total.protein + meal.recipe.nutrition.protein,
        carbohydrates: total.carbohydrates + meal.recipe.nutrition.carbohydrates,
        fat: total.fat + meal.recipe.nutrition.fat,
        fiber: (total.fiber || 0) + (meal.recipe.nutrition.fiber || 0),
        sugar: (total.sugar || 0) + (meal.recipe.nutrition.sugar || 0),
        sodium: (total.sodium || 0) + (meal.recipe.nutrition.sodium || 0),
      }),
      {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      }
    );

    dailyPlan.dailyNutrition = dailyNutrition;

    // Update the plan in the database
    await planRepository.updateMealPlan(planId, { dailyPlans: plan.dailyPlans });

    return { planId, dayIndex, mealId, updatedMeal, dailyNutrition };
  }
);

// Async thunks - Training Plans
export const loadTrainingPlans = createAsyncThunk(
  'plans/loadTrainingPlans',
  async (userId: string) => {
    return await planRepository.getTrainingPlans(userId);
  }
);

export const loadActiveTrainingPlan = createAsyncThunk(
  'plans/loadActiveTrainingPlan',
  async (userId: string) => {
    return await planRepository.getActiveTrainingPlan(userId);
  }
);

export const saveTrainingPlan = createAsyncThunk(
  'plans/saveTrainingPlan',
  async (plan: TrainingPlan) => {
    await planRepository.createTrainingPlan(plan);
    return plan;
  }
);

export const updateTrainingPlanStatus = createAsyncThunk(
  'plans/updateTrainingPlanStatus',
  async ({ planId, status }: { planId: string; status: PlanStatus }) => {
    await planRepository.updateTrainingPlan(planId, { status });
    return { planId, status };
  }
);

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    addMealPlan: (state, action: PayloadAction<MealPlan>) => {
      state.mealPlans.push(action.payload);
      if (action.payload.status === 'active') {
        state.activeMealPlan = action.payload;
      }
    },
    addTrainingPlan: (state, action: PayloadAction<TrainingPlan>) => {
      state.trainingPlans.push(action.payload);
      if (action.payload.status === 'active') {
        state.activeTrainingPlan = action.payload;
      }
    },
    setActiveMealPlan: (state, action: PayloadAction<MealPlan | null>) => {
      state.activeMealPlan = action.payload;
    },
    setActiveTrainingPlan: (state, action: PayloadAction<TrainingPlan | null>) => {
      state.activeTrainingPlan = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load meal plans
      .addCase(loadMealPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMealPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.mealPlans = action.payload;
      })
      .addCase(loadMealPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load meal plans';
      })
      // Load active meal plan
      .addCase(loadActiveMealPlan.fulfilled, (state, action) => {
        state.activeMealPlan = action.payload || null;
      })
      // Save meal plan
      .addCase(saveMealPlan.fulfilled, (state, action) => {
        state.mealPlans.push(action.payload);
        if (action.payload.status === 'active') {
          state.activeMealPlan = action.payload;
        }
      })
      // Update meal plan status
      .addCase(updateMealPlanStatus.fulfilled, (state, action) => {
        const { planId, status } = action.payload;
        const plan = state.mealPlans.find(p => p.id === planId);
        if (plan) {
          plan.status = status;
          if (state.activeMealPlan?.id === planId && status !== 'active') {
            state.activeMealPlan = null;
          }
        }
      })
      // Update meal in plan
      .addCase(updateMealInPlan.fulfilled, (state, action) => {
        const { planId, dayIndex, mealId, updatedMeal, dailyNutrition } = action.payload;

        // Update in mealPlans array
        const plan = state.mealPlans.find(p => p.id === planId);
        if (plan && plan.dailyPlans[dayIndex]) {
          const mealIndex = plan.dailyPlans[dayIndex].meals.findIndex(m => m.id === mealId);
          if (mealIndex !== -1) {
            plan.dailyPlans[dayIndex].meals[mealIndex] = updatedMeal;
            plan.dailyPlans[dayIndex].dailyNutrition = dailyNutrition;
          }
        }

        // Update in activeMealPlan if it's the active one
        if (state.activeMealPlan?.id === planId && state.activeMealPlan.dailyPlans[dayIndex]) {
          const mealIndex = state.activeMealPlan.dailyPlans[dayIndex].meals.findIndex(m => m.id === mealId);
          if (mealIndex !== -1) {
            state.activeMealPlan.dailyPlans[dayIndex].meals[mealIndex] = updatedMeal;
            state.activeMealPlan.dailyPlans[dayIndex].dailyNutrition = dailyNutrition;
          }
        }
      })
      // Load training plans
      .addCase(loadTrainingPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTrainingPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.trainingPlans = action.payload;
      })
      .addCase(loadTrainingPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load training plans';
      })
      // Load active training plan
      .addCase(loadActiveTrainingPlan.fulfilled, (state, action) => {
        state.activeTrainingPlan = action.payload || null;
      })
      // Save training plan
      .addCase(saveTrainingPlan.fulfilled, (state, action) => {
        state.trainingPlans.push(action.payload);
        if (action.payload.status === 'active') {
          state.activeTrainingPlan = action.payload;
        }
      })
      // Update training plan status
      .addCase(updateTrainingPlanStatus.fulfilled, (state, action) => {
        const { planId, status } = action.payload;
        const plan = state.trainingPlans.find(p => p.id === planId);
        if (plan) {
          plan.status = status;
          if (state.activeTrainingPlan?.id === planId && status !== 'active') {
            state.activeTrainingPlan = null;
          }
        }
      });
  },
});

export const {
  addMealPlan,
  addTrainingPlan,
  setActiveMealPlan,
  setActiveTrainingPlan,
  clearError,
} = plansSlice.actions;

export default plansSlice.reducer;
