import type { MealPlan, TrainingPlan, Meal } from '../../../types';

export function parseMealPlanResponse(response: string, requestStartDate?: Date): MealPlan {
  try {
    const parsed = JSON.parse(response);

    // Use the request startDate if provided, otherwise fall back to the AI response
    const startDate = requestStartDate || new Date(parsed.startDate);

    // Convert date strings to Date objects
    const plan: MealPlan = {
      ...parsed,
      startDate,
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

export function parseTrainingPlanResponse(response: string, requestStartDate?: Date): TrainingPlan {
  try {
    const parsed = JSON.parse(response);

    // Use the request startDate if provided, otherwise fall back to the AI response
    const startDate = requestStartDate || new Date(parsed.startDate);

    // Convert date strings to Date objects
    const plan: TrainingPlan = {
      ...parsed,
      startDate,
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
