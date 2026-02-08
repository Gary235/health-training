import type { GeneratedPrompt, RecipeVariationRequest } from '../../../types/ai.types';

export function generateRecipeVariationPrompt(
  request: RecipeVariationRequest
): GeneratedPrompt {
  const { recipe, userProfile, variationCount, variationType, dailyMealContext } = request;

  const systemPrompt = `You are an expert chef and nutritionist. Create alternative recipe variations by changing 1-2 key ingredients while maintaining similar nutritional profiles and cooking complexity.

VARIATION GUIDELINES:
- Maintain similar nutritional profile (±10% calories, ±5g macros)
- Keep preparation complexity similar (±5 minutes prep/cook time)
- Respect dietary restrictions
- Clearly note what ingredients were changed
- Each variation should be as appealing as the original

VARIATION TYPES:
- protein_swap: Change the main protein source
- vegetarian: Make the recipe vegetarian
- lower_calorie: Reduce calories by 15-20%
- general: Various ingredient swaps for variety`;

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

  const userPrompt = `Create ${variationCount} alternative version(s) of this recipe.

ORIGINAL RECIPE: ${recipe.name}
DESCRIPTION: ${recipe.description}

INGREDIENTS:
${recipe.ingredients.map((ing: any) => `- ${ing.amount} ${ing.unit} ${ing.name}`).join('\n')}

NUTRITION (ORIGINAL):
- Calories: ${recipe.nutrition.calories}
- Protein: ${recipe.nutrition.protein}g
- Carbs: ${recipe.nutrition.carbohydrates}g
- Fat: ${recipe.nutrition.fat}g

COOKING INFO:
- Prep time: ${recipe.prepTime} minutes
- Cook time: ${recipe.cookTime} minutes
- Servings: ${recipe.servings}
${recipe.primaryCookingMethod ? `- Primary method: ${recipe.primaryCookingMethod}` : ''}

USER DIETARY RESTRICTIONS:
${userProfile.preferences.dietaryRestrictions.length > 0 ? userProfile.preferences.dietaryRestrictions.join(', ') : 'None'}

USER ALLERGIES:
${userProfile.preferences.allergies.length > 0 ? userProfile.preferences.allergies.join(', ') : 'None'}${variationTypeText}${nutritionConstraintText}

REQUIREMENTS FOR VARIATIONS:
1. Change 1-2 key ingredients (clearly note what changed)
2. Maintain nutrition: ±10% calories, ±5g macros
3. Similar prep/cook time (±5 minutes)
4. Respect dietary restrictions and allergies
5. Mark as "variation" type with notes explaining changes

Return as JSON:
{
  "variations": [
    {
      "id": "recipe-variation-[uuid]",
      "name": "Modified Recipe Name",
      "description": "Brief description highlighting the change",
      "ingredients": [
        { "name": "ingredient", "amount": 100, "unit": "g", "calories": 200 }
      ],
      "instructions": ["Quick step 1", "Quick step 2"],
      "instructionLevel": "quick",
      "primaryCookingMethod": "${recipe.primaryCookingMethod || 'same'}",
      "prepTime": ${recipe.prepTime},
      "cookTime": ${recipe.cookTime},
      "servings": ${recipe.servings},
      "nutrition": {
        "calories": ${Math.round(recipe.nutrition.calories * 0.95)}-${Math.round(recipe.nutrition.calories * 1.05)},
        "protein": ${Math.round(recipe.nutrition.protein - 5)}-${Math.round(recipe.nutrition.protein + 5)},
        "carbohydrates": ${Math.round(recipe.nutrition.carbohydrates - 5)}-${Math.round(recipe.nutrition.carbohydrates + 5)},
        "fat": ${Math.round(recipe.nutrition.fat - 5)}-${Math.round(recipe.nutrition.fat + 5)}
      },
      "variantType": "variation",
      "variantNotes": "Changed [ingredient X] to [ingredient Y]"
    }
  ],
  "notes": "Optional notes about the variations"
}`;

  return {
    systemPrompt,
    userPrompt,
    responseFormat: { type: 'json_object' },
  };
}
