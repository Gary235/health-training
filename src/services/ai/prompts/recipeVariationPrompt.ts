import type { GeneratedPrompt, RecipeVariationRequest } from '../../../types/ai.types';
import type { Ingredient } from '../../../types/plan.types';

export function generateRecipeVariationPrompt(
  request: RecipeVariationRequest
): GeneratedPrompt {
  const { recipe, userProfile, variationCount, variationType, dailyMealContext } = request;

  const systemPrompt = `You are an expert chef creating recipe variations.

RULES:
- Change 1-2 key ingredients only
- Maintain nutrition: ±10% calories, ±5g macros
- Similar prep/cook time (±5 min)
- Respect dietary restrictions & user taste
- Each variation must be equally appealing

TYPES: protein_swap | vegetarian | lower_calorie | general`;

  const variationTypeText = variationType
    ? `\nVARIATION TYPE: ${variationType}
Focus on ${
        variationType === 'protein_swap'
          ? 'swapping the main protein (e.g., chicken → beef, tofu → tempeh)'
          : variationType === 'vegetarian'
            ? 'replacing animal products with plant-based alternatives'
            : variationType === 'lower_calorie'
              ? 'reducing calories through lighter ingredients or smaller portions'
              : 'creating interesting variations with different ingredients'
      }`
    : '';

  const nutritionConstraintText = dailyMealContext
    ? `\n\nDAILY NUTRITION CONTEXT:
Current daily total: ${dailyMealContext.currentDailyNutrition.calories} cal, ${dailyMealContext.currentDailyNutrition.protein}g protein
Target daily: ${dailyMealContext.targetDailyNutrition.calories} cal, ${dailyMealContext.targetDailyNutrition.protein}g protein

Variations should help meet daily targets.`
    : '';

  const userPrompt = `Create ${variationCount} variation(s) of: ${recipe.name}

ORIGINAL:
${recipe.ingredients.map((ing: Ingredient) => `${ing.amount}${ing.unit} ${ing.name}`).join(', ')}
Nutrition: ${recipe.nutrition.calories}cal, ${recipe.nutrition.protein}g protein, ${recipe.nutrition.carbohydrates}g carbs, ${recipe.nutrition.fat}g fat
Time: ${recipe.prepTime}min prep + ${recipe.cookTime}min cook

USER TASTE:
Likes: ${userProfile.preferences.foodLikes.length > 0 ? userProfile.preferences.foodLikes.join(', ') : 'Various'}
Dislikes: ${userProfile.preferences.foodDislikes.length > 0 ? userProfile.preferences.foodDislikes.join(', ') : 'None'}
Restrictions: ${userProfile.preferences.dietaryRestrictions.length > 0 ? userProfile.preferences.dietaryRestrictions.join(', ') : 'None'}
Allergies: ${userProfile.preferences.allergies.length > 0 ? userProfile.preferences.allergies.join(', ') : 'None'}${variationTypeText}${nutritionConstraintText}

Return JSON: {"variations": [{"id": "recipe-variation-[uuid]", "name", "description", "ingredients": [{"name", "amount", "unit", "calories"}], "instructions": ["step1", "step2"], "instructionLevel": "quick", "primaryCookingMethod", "prepTime", "cookTime", "servings": ${recipe.servings}, "nutrition": {"calories", "protein", "carbohydrates", "fat"}, "variantType": "variation", "variantNotes": "Changed X to Y"}]}`;

  return {
    systemPrompt,
    userPrompt,
    responseFormat: { type: 'json_object' },
  };
}
