import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { MealPlan, TrainingPlan, PlanStatus, Meal, NutritionInfo, InstructionDetailLevel, Recipe } from '../../types';
import { planRepository } from '../../services/db/repositories';
import { getAIService } from '../../services/ai';

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
    // If the new plan is active, deactivate any existing active plans
    if (plan.status === 'active') {
      const existingActivePlan = await planRepository.getActiveMealPlan(plan.userId);
      if (existingActivePlan) {
        await planRepository.updateMealPlan(existingActivePlan.id, { status: 'inactive' });
      }
    }

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

    // Reset instructionsExpanded when meal is edited
    dailyPlan.meals[mealIndex] = {
      ...updatedMeal,
      instructionsExpanded: false,
    };

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
    // If the new plan is active, deactivate any existing active plans
    if (plan.status === 'active') {
      const existingActivePlan = await planRepository.getActiveTrainingPlan(plan.userId);
      if (existingActivePlan) {
        await planRepository.updateTrainingPlan(existingActivePlan.id, { status: 'inactive' });
      }
    }

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

// Feature 1: Expand meal instructions
export const expandMealInstructions = createAsyncThunk(
  'plans/expandMealInstructions',
  async ({
    planId,
    dayIndex,
    mealId,
    userProfile,
  }: {
    planId: string;
    dayIndex: number;
    mealId: string;
    userProfile: any;
  }) => {
    // Load the plan from the database
    const plan = await planRepository.getMealPlan(planId);
    if (!plan) {
      throw new Error('Meal plan not found');
    }

    const dailyPlan = plan.dailyPlans[dayIndex];
    if (!dailyPlan) {
      throw new Error('Day not found in meal plan');
    }

    const meal = dailyPlan.meals.find((m) => m.id === mealId);
    if (!meal) {
      throw new Error('Meal not found in daily plan');
    }

    // Call AI service to expand instructions (always to 'detailed' level)
    const aiService = await getAIService();
    const response = await aiService.expandInstructions({
      recipe: meal.recipe,
      targetLevel: 'detailed',
      userProfile,
    });

    // Update recipe with detailed instructions
    const updatedRecipe = {
      ...meal.recipe,
      detailedInstructions: response.instructions,
      instructionLevel: 'detailed' as InstructionDetailLevel,
      instructions: response.instructions.detailed,
    };

    const updatedMeal = {
      ...meal,
      recipe: updatedRecipe,
      instructionsExpanded: true,
    };

    // Update meal in plan
    const mealIndex = dailyPlan.meals.findIndex((m) => m.id === mealId);
    dailyPlan.meals[mealIndex] = updatedMeal;

    // Save to database
    await planRepository.updateMealPlan(planId, { dailyPlans: plan.dailyPlans });

    return { planId, dayIndex, mealId, updatedMeal };
  }
);

// Feature 2: Generate meal variations
export const generateMealVariations = createAsyncThunk(
  'plans/generateMealVariations',
  async ({
    planId,
    dayIndex,
    mealId,
    variationCount,
    variationType,
    userProfile,
  }: {
    planId: string;
    dayIndex: number;
    mealId: string;
    variationCount: number;
    variationType?: 'protein_swap' | 'vegetarian' | 'lower_calorie' | 'general';
    userProfile: any;
  }) => {
    // Load the plan from the database
    const plan = await planRepository.getMealPlan(planId);
    if (!plan) {
      throw new Error('Meal plan not found');
    }

    const dailyPlan = plan.dailyPlans[dayIndex];
    if (!dailyPlan) {
      throw new Error('Day not found in meal plan');
    }

    const meal = dailyPlan.meals.find((m) => m.id === mealId);
    if (!meal) {
      throw new Error('Meal not found in daily plan');
    }

    // Get daily meal context for nutrition constraints
    const otherMeals = dailyPlan.meals.filter((m) => m.id !== mealId);
    const dailyMealContext = {
      otherMeals,
      currentDailyNutrition: dailyPlan.dailyNutrition,
      targetDailyNutrition: dailyPlan.dailyNutrition, // Could calculate from user goals
    };

    // Call AI service to generate variations
    const aiService = await getAIService();
    const response = await aiService.generateRecipeVariations({
      recipe: meal.recipe,
      userProfile,
      variationCount,
      variationType,
      dailyMealContext,
    });

    // Mark original recipe as 'original' type
    const originalRecipe = {
      ...meal.recipe,
      variantType: 'original' as const,
    };

    // Update meal with alternatives
    const updatedMeal = {
      ...meal,
      recipe: originalRecipe,
      alternatives: response.variations,
    };

    // Update meal in plan
    const mealIndex = dailyPlan.meals.findIndex((m) => m.id === mealId);
    dailyPlan.meals[mealIndex] = updatedMeal;

    // Save to database
    await planRepository.updateMealPlan(planId, { dailyPlans: plan.dailyPlans });

    return { planId, dayIndex, mealId, updatedMeal };
  }
);

// Feature 2: Switch meal recipe to a variation
export const switchMealRecipe = createAsyncThunk(
  'plans/switchMealRecipe',
  async ({
    planId,
    dayIndex,
    mealId,
    recipeId,
  }: {
    planId: string;
    dayIndex: number;
    mealId: string;
    recipeId: string;
  }) => {
    // Load the plan from the database
    const plan = await planRepository.getMealPlan(planId);
    if (!plan) {
      throw new Error('Meal plan not found');
    }

    const dailyPlan = plan.dailyPlans[dayIndex];
    if (!dailyPlan) {
      throw new Error('Day not found in meal plan');
    }

    const meal = dailyPlan.meals.find((m) => m.id === mealId);
    if (!meal) {
      throw new Error('Meal not found in daily plan');
    }

    // Find the target recipe (either current or alternative)
    let targetRecipe: Recipe | undefined;
    if (meal.recipe.id === recipeId) {
      targetRecipe = meal.recipe;
    } else {
      targetRecipe = meal.alternatives?.find((r) => r.id === recipeId);
    }

    if (!targetRecipe) {
      throw new Error('Recipe not found');
    }

    // Update meal with new recipe
    const updatedMeal = {
      ...meal,
      recipe: targetRecipe,
      activeRecipeId: recipeId,
      instructionsExpanded: false,
    };

    // Update meal in plan
    const mealIndex = dailyPlan.meals.findIndex((m) => m.id === mealId);
    dailyPlan.meals[mealIndex] = updatedMeal;

    // Recalculate daily nutrition totals
    const dailyNutrition: NutritionInfo = dailyPlan.meals.reduce(
      (total, m) => ({
        calories: total.calories + m.recipe.nutrition.calories,
        protein: total.protein + m.recipe.nutrition.protein,
        carbohydrates: total.carbohydrates + m.recipe.nutrition.carbohydrates,
        fat: total.fat + m.recipe.nutrition.fat,
        fiber: (total.fiber || 0) + (m.recipe.nutrition.fiber || 0),
        sugar: (total.sugar || 0) + (m.recipe.nutrition.sugar || 0),
        sodium: (total.sodium || 0) + (m.recipe.nutrition.sodium || 0),
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

    // Save to database
    await planRepository.updateMealPlan(planId, { dailyPlans: plan.dailyPlans });

    return { planId, dayIndex, mealId, updatedMeal, dailyNutrition };
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
        // If the new plan is active, deactivate the previous active plan in state
        if (action.payload.status === 'active' && state.activeMealPlan) {
          const previousActivePlan = state.mealPlans.find(p => p.id === state.activeMealPlan?.id);
          if (previousActivePlan) {
            previousActivePlan.status = 'inactive';
          }
          state.activeMealPlan = action.payload;
        }
        state.mealPlans.push(action.payload);
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
        // If the new plan is active, deactivate the previous active plan in state
        if (action.payload.status === 'active' && state.activeTrainingPlan) {
          const previousActivePlan = state.trainingPlans.find(p => p.id === state.activeTrainingPlan?.id);
          if (previousActivePlan) {
            previousActivePlan.status = 'inactive';
          }
          state.activeTrainingPlan = action.payload;
        }
        state.trainingPlans.push(action.payload);
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
      })
      // Expand meal instructions
      .addCase(expandMealInstructions.pending, (state) => {
        state.loading = true;
      })
      .addCase(expandMealInstructions.fulfilled, (state, action) => {
        state.loading = false;
        const { planId, dayIndex, mealId, updatedMeal } = action.payload;

        // Update in mealPlans array
        const plan = state.mealPlans.find(p => p.id === planId);
        if (plan && plan.dailyPlans[dayIndex]) {
          const mealIndex = plan.dailyPlans[dayIndex].meals.findIndex(m => m.id === mealId);
          if (mealIndex !== -1) {
            plan.dailyPlans[dayIndex].meals[mealIndex] = updatedMeal;
          }
        }

        // Update in activeMealPlan if it's the active one
        if (state.activeMealPlan?.id === planId && state.activeMealPlan.dailyPlans[dayIndex]) {
          const mealIndex = state.activeMealPlan.dailyPlans[dayIndex].meals.findIndex(m => m.id === mealId);
          if (mealIndex !== -1) {
            state.activeMealPlan.dailyPlans[dayIndex].meals[mealIndex] = updatedMeal;
          }
        }
      })
      .addCase(expandMealInstructions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to expand instructions';
      })
      // Generate meal variations
      .addCase(generateMealVariations.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateMealVariations.fulfilled, (state, action) => {
        state.loading = false;
        const { planId, dayIndex, mealId, updatedMeal } = action.payload;

        // Update in mealPlans array
        const plan = state.mealPlans.find(p => p.id === planId);
        if (plan && plan.dailyPlans[dayIndex]) {
          const mealIndex = plan.dailyPlans[dayIndex].meals.findIndex(m => m.id === mealId);
          if (mealIndex !== -1) {
            plan.dailyPlans[dayIndex].meals[mealIndex] = updatedMeal;
          }
        }

        // Update in activeMealPlan if it's the active one
        if (state.activeMealPlan?.id === planId && state.activeMealPlan.dailyPlans[dayIndex]) {
          const mealIndex = state.activeMealPlan.dailyPlans[dayIndex].meals.findIndex(m => m.id === mealId);
          if (mealIndex !== -1) {
            state.activeMealPlan.dailyPlans[dayIndex].meals[mealIndex] = updatedMeal;
          }
        }
      })
      .addCase(generateMealVariations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate variations';
      })
      // Switch meal recipe
      .addCase(switchMealRecipe.pending, (state) => {
        state.loading = true;
      })
      .addCase(switchMealRecipe.fulfilled, (state, action) => {
        state.loading = false;
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
      .addCase(switchMealRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to switch recipe';
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
