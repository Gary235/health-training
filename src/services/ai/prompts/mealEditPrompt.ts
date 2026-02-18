import type { MealEditRequest, GeneratedPrompt } from '../../../types/ai.types';
import type { Ingredient } from '../../../types/plan.types';

export function generateMealEditPrompt(request: MealEditRequest): GeneratedPrompt {
  const { meal, userProfile, editInstructions, dailyMealContext } = request;
  const { bodySpecs, preferences, goals } = userProfile;

  const systemPrompt = `You are an expert nutritionist editing meals based on user requests.

PRIORITIES:
1. Apply user's changes accurately
2. Respect their taste preferences
3. Maintain nutritional balance for their goals
4. Keep similar complexity/time

Return valid JSON matching Meal structure.`;

  const dailyContextText = dailyMealContext
    ? `\n\nDAILY CONTEXT:
Current: ${dailyMealContext.currentDailyNutrition.calories}cal, ${dailyMealContext.currentDailyNutrition.protein}g protein
Target: ${dailyMealContext.targetDailyNutrition.calories}cal, ${dailyMealContext.targetDailyNutrition.protein}g protein
Other meals: ${dailyMealContext.otherMeals.map(m => `${m.type}(${m.recipe.name})`).join(', ')}`
    : '';

  const userPrompt = `Edit meal: ${meal.type} at ${meal.scheduledTime}

CURRENT: ${meal.recipe.name}
Ingredients: ${meal.recipe.ingredients.map((i: Ingredient) => `${i.amount}${i.unit} ${i.name}`).join(', ')}
Nutrition: ${meal.recipe.nutrition.calories}cal, ${meal.recipe.nutrition.protein}g protein
Time: ${meal.recipe.prepTime}min prep + ${meal.recipe.cookTime}min cook

USER REQUEST: ${editInstructions}

USER TASTE:
Likes: ${preferences.foodLikes.join(', ') || 'Various'}
Dislikes: ${preferences.foodDislikes.join(', ') || 'None'}
Restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'}
Allergies: ${preferences.allergies.join(', ') || 'None'}

USER STATS: ${bodySpecs.age}y ${bodySpecs.gender}, Goal: ${goals.primary}${dailyContextText}

Return JSON: {"id": "${meal.id}", "type": "${meal.type}", "scheduledTime": "${meal.scheduledTime}", "recipe": {"name", "description", "ingredients": [{"name", "amount", "unit", "calories"}], "instructions": ["step1", "step2"], "prepTime", "cookTime", "servings": 1, "nutrition": {"calories", "protein", "carbohydrates", "fat"}}, "notes": "changes made"}`;

  return {
    systemPrompt,
    userPrompt,
    responseFormat: { type: 'json_object' },
  };
}
