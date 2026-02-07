import type { MealPlan, TrainingPlan, Meal } from '../../../types';

export function parseMealPlanResponse(response: string): MealPlan {
  try {
    const parsed = JSON.parse(response);

    // Convert date strings to Date objects
    const plan: MealPlan = {
      ...parsed,
      startDate: new Date(parsed.startDate),
      endDate: new Date(parsed.endDate),
      createdAt: new Date(parsed.createdAt || Date.now()),
      dailyPlans: parsed.dailyPlans.map((dp: any) => ({
        ...dp,
        date: new Date(dp.date),
      })),
    };

    return plan;
  } catch (error) {
    console.error('Failed to parse meal plan response:', error);
    throw new Error('Invalid meal plan response format');
  }
}

export function parseTrainingPlanResponse(response: string): TrainingPlan {
  try {
    const parsed = JSON.parse(response);

    // Convert date strings to Date objects
    const plan: TrainingPlan = {
      ...parsed,
      startDate: new Date(parsed.startDate),
      endDate: new Date(parsed.endDate),
      createdAt: new Date(parsed.createdAt || Date.now()),
      sessions: parsed.sessions.map((session: any) => ({
        ...session,
        date: new Date(session.date),
      })),
    };

    return plan;
  } catch (error) {
    console.error('Failed to parse training plan response:', error);
    throw new Error('Invalid training plan response format');
  }
}

export function parseMealEditResponse(response: string, originalMealId: string): Meal {
  try {
    const parsed = JSON.parse(response);

    // Ensure the meal ID is preserved from the original
    const meal: Meal = {
      ...parsed,
      id: originalMealId,
    };

    return meal;
  } catch (error) {
    console.error('Failed to parse meal edit response:', error);
    throw new Error('Invalid meal edit response format');
  }
}
