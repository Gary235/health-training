import type { MealEditRequest, GeneratedPrompt } from '../../../types/ai.types';

export function generateMealEditPrompt(request: MealEditRequest): GeneratedPrompt {
  const { meal, userProfile, editInstructions, dailyMealContext } = request;
  const { bodySpecs, preferences, goals } = userProfile;

  const systemPrompt = `You are an expert nutritionist specializing in meal customization. Edit existing meals based on user requests while maintaining nutritional balance and adhering to their dietary preferences and goals.

Your edited meals should:
- Apply the user's requested changes accurately
- Maintain appropriate calorie and macronutrient balance for their goals
- Respect dietary restrictions and preferences
- Keep similar meal complexity and prep time when possible
- Provide clear, practical cooking instructions
- Include detailed nutrition information

Return the edited meal as a valid JSON object matching the Meal type structure.`;

  const dailyContextText = dailyMealContext
    ? `\n\nDAILY NUTRITION CONTEXT:
Current daily totals (with this meal):
- Calories: ${dailyMealContext.currentDailyNutrition.calories}
- Protein: ${dailyMealContext.currentDailyNutrition.protein}g
- Carbs: ${dailyMealContext.currentDailyNutrition.carbohydrates}g
- Fat: ${dailyMealContext.currentDailyNutrition.fat}g

Target daily totals:
- Calories: ${dailyMealContext.targetDailyNutrition.calories}
- Protein: ${dailyMealContext.targetDailyNutrition.protein}g
- Carbs: ${dailyMealContext.targetDailyNutrition.carbohydrates}g
- Fat: ${dailyMealContext.targetDailyNutrition.fat}g

Other meals today: ${dailyMealContext.otherMeals.map(m => `${m.type}: ${m.recipe.name}`).join(', ')}`
    : '';

  const userPrompt = `Edit the following meal based on the user's request.

CURRENT MEAL:
- Type: ${meal.type}
- Time: ${meal.scheduledTime}
- Recipe: ${meal.recipe.name}
- Description: ${meal.recipe.description}
- Ingredients: ${meal.recipe.ingredients.map(i => `${i.amount}${i.unit} ${i.name}`).join(', ')}
- Prep Time: ${meal.recipe.prepTime} min
- Cook Time: ${meal.recipe.cookTime} min
- Nutrition: ${meal.recipe.nutrition.calories} cal, ${meal.recipe.nutrition.protein}g protein, ${meal.recipe.nutrition.carbohydrates}g carbs, ${meal.recipe.nutrition.fat}g fat

USER REQUEST:
${editInstructions}

USER PROFILE:
- Age: ${bodySpecs.age}, Gender: ${bodySpecs.gender}
- Height: ${bodySpecs.height}${bodySpecs.measurementSystem === 'metric' ? 'cm' : 'in'}
- Weight: ${bodySpecs.weight}${bodySpecs.measurementSystem === 'metric' ? 'kg' : 'lbs'}
- Primary Goal: ${goals.primary}

DIETARY PREFERENCES:
- Restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'}
- Allergies: ${preferences.allergies.join(', ') || 'None'}
- Likes: ${preferences.foodLikes.join(', ') || 'Various'}
- Dislikes: ${preferences.foodDislikes.join(', ') || 'None'}
- Cuisine Preferences: ${preferences.cuisinePreferences.join(', ') || 'Various'}
${dailyContextText}

Please generate the edited meal that applies the user's request while maintaining nutritional balance.

Return as JSON matching this structure:
{
  "id": "${meal.id}",
  "type": "${meal.type}",
  "scheduledTime": "${meal.scheduledTime}",
  "recipe": {
    "name": "Updated Recipe Name",
    "description": "Brief description",
    "ingredients": [
      { "name": "ingredient", "amount": 100, "unit": "g", "calories": 200 }
    ],
    "instructions": ["Step 1", "Step 2"],
    "prepTime": 10,
    "cookTime": 15,
    "servings": 1,
    "nutrition": {
      "calories": 500,
      "protein": 30,
      "carbohydrates": 50,
      "fat": 15
    }
  },
  "notes": "Optional notes about the changes made"
}`;

  return {
    systemPrompt,
    userPrompt,
    responseFormat: { type: 'json_object' },
  };
}
