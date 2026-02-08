import type { MealPlanRequest, GeneratedPrompt } from '../../../types/ai.types';
import { regionalContextService } from '../../external/regionalContextService';

export function generateMealPlanPrompt(request: MealPlanRequest): GeneratedPrompt {
  const { userProfile, startDate, durationDays, adjustmentContext } = request;
  const { bodySpecs, preferences, schedule, goals } = userProfile;

  const systemPrompt = `You are an expert nutritionist and meal planner. Create personalized, balanced meal plans that are practical, delicious, and aligned with the user's goals and preferences.

Your meal plans should:
- Meet daily caloric and macronutrient targets based on user goals
- Respect dietary restrictions and preferences
- Include variety and avoid meal fatigue
- Be practical to prepare with clear instructions
- Consider meal timing relative to training schedule
- Include detailed nutrition information

IMPORTANT - TOKEN OPTIMIZATION (Feature 1):
For efficiency, provide 'quick' level instructions (2-3 brief steps) for each recipe.
Users can request more detailed instructions later for specific meals.
Example quick instructions:
- "Mix ingredients, pour into pan, bake at 350°F for 25 minutes"
- "Sauté vegetables, add protein, season and serve over rice"

Return the meal plan as a valid JSON object matching the MealPlan type structure.`;

  const adjustmentText = adjustmentContext
    ? `\n\nADJUSTMENT CONTEXT:
The previous plan had adherence issues:
- Overall adherence: ${adjustmentContext.adherenceAnalysis.overallAdherence.toFixed(1)}%
- Meal adherence: ${adjustmentContext.adherenceAnalysis.mealAdherence.toFixed(1)}%
${adjustmentContext.adherenceAnalysis.patterns
  .filter(p => p.type === 'meal')
  .map(
    p =>
      `- ${p.itemName}: ${p.consecutiveMisses} consecutive misses, ${(p.missRate * 100).toFixed(1)}% miss rate, reasons: ${p.commonReasons.join(', ')}`
  )
  .join('\n')}

Please adjust the plan to address these issues:
${adjustmentContext.specificRequests || 'Make appropriate adjustments based on the patterns above.'}`
    : '';

  // Feature 4: Cooking preferences
  const cookingPrefsText = preferences.cookingPreferences?.length
    ? `\n\nCOOKING METHOD PREFERENCES:
${preferences.cookingPreferences
  .map((cp) => `- ${cp.method.replace('_', ' ')}: ${cp.level}`)
  .join('\n')}

For "avoid" methods, do not use them.
For "less" methods, minimize use (max 1-2 meals per week).
For "prefer" methods, prioritize when appropriate.
${preferences.maxPrepTime ? `\n- Maximum prep time: ${preferences.maxPrepTime} minutes` : ''}
${preferences.maxCookTime ? `- Maximum cook time: ${preferences.maxCookTime} minutes` : ''}`
    : '';

  // Feature 5: Location context
  const locationText = preferences.location
    ? `\n\nLOCATION & CULTURAL CONTEXT:
- Region: ${preferences.location.region.replace('_', ' ')}
${preferences.location.country ? `- Country: ${preferences.location.country}` : ''}
- Prefer Local Ingredients: ${preferences.location.preferLocalIngredients}
${preferences.location.culturalCuisines?.length ? `- Preferred Cuisines: ${preferences.location.culturalCuisines.join(', ')}` : ''}

${regionalContextService.generateRegionalContext(
  preferences.location.region,
  preferences.location.preferLocalIngredients
)}

Consider regional ingredient availability and cultural food preferences.
${
  preferences.location.preferLocalIngredients
    ? 'Prioritize ingredients commonly available in this region.'
    : 'You may include international ingredients, but consider suggesting local alternatives.'
}

Suggest meals that:
- Use ingredients familiar to people in ${preferences.location.region.replace('_', ' ')}
- Incorporate local cooking styles when appropriate
- Consider seasonal availability
- Respect cultural food traditions`
    : '';

  const userPrompt = `Create a ${durationDays}-day meal plan starting from ${startDate.toLocaleDateString()}.

USER PROFILE:
- Age: ${bodySpecs.age}, Gender: ${bodySpecs.gender}
- Height: ${bodySpecs.height}${bodySpecs.measurementSystem === 'metric' ? 'cm' : 'in'}
- Weight: ${bodySpecs.weight}${bodySpecs.measurementSystem === 'metric' ? 'kg' : 'lbs'}
- Fitness Level: ${bodySpecs.fitnessLevel}
- Activity Level: ${bodySpecs.activityLevel}

DIETARY PREFERENCES:
- Restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'}
- Allergies: ${preferences.allergies.join(', ') || 'None'}
- Likes: ${preferences.foodLikes.join(', ') || 'Various'}
- Dislikes: ${preferences.foodDislikes.join(', ') || 'None'}
- Cuisine Preferences: ${preferences.cuisinePreferences.join(', ') || 'Various'}${cookingPrefsText}${locationText}

MEAL SCHEDULE:
- Breakfast: ${schedule.mealTimes.breakfast || 'Flexible'}
- Lunch: ${schedule.mealTimes.lunch || 'Flexible'}
- Dinner: ${schedule.mealTimes.dinner || 'Flexible'}
- Snacks: ${schedule.mealTimes.snacks?.join(', ') || 'As needed'}

GOALS:
- Primary Goal: ${goals.primary}
${goals.targetWeight ? `- Target Weight: ${goals.targetWeight}${bodySpecs.measurementSystem === 'metric' ? 'kg' : 'lbs'}` : ''}
${goals.weeklyWeightChangeGoal ? `- Weekly Change: ${goals.weeklyWeightChangeGoal}${bodySpecs.measurementSystem === 'metric' ? 'kg' : 'lbs'}/week` : ''}
${goals.specificGoals?.length ? `- Specific Goals: ${goals.specificGoals.join(', ')}` : ''}
${adjustmentText}

Please generate a complete meal plan with:
1. Daily meal plans for each day
2. Each meal should include:
   - Recipe with name, description, ingredients (with amounts and units)
   - Quick cooking instructions (2-3 brief steps)
   - Primary cooking method (e.g., "baking", "grilling", "sauteing")
   - Prep and cook times
   - Nutrition information (calories, protein, carbs, fat)
   - Scheduled time
3. Daily nutrition totals

Return as JSON matching this structure:
{
  "id": "meal-plan-[uuid]",
  "userId": "${userProfile.id}",
  "name": "Descriptive Plan Name",
  "startDate": "${startDate.toISOString()}",
  "endDate": "[calculated end date]",
  "status": "active",
  "dailyPlans": [
    {
      "date": "2024-01-01T00:00:00.000Z",
      "meals": [
        {
          "id": "meal-[uuid]",
          "type": "breakfast",
          "scheduledTime": "07:00",
          "recipe": {
            "id": "recipe-[uuid]",
            "name": "Recipe Name",
            "description": "Brief description",
            "ingredients": [
              { "name": "ingredient", "amount": 100, "unit": "g", "calories": 200 }
            ],
            "instructions": ["Quick step 1", "Quick step 2"],
            "instructionLevel": "quick",
            "primaryCookingMethod": "baking",
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
          "currentInstructionLevel": "quick",
          "activeRecipeId": "recipe-[uuid]"
        }
      ],
      "dailyNutrition": {
        "calories": 2000,
        "protein": 150,
        "carbohydrates": 200,
        "fat": 65
      }
    }
  ],
  "createdAt": "${new Date().toISOString()}"
}`;

  return {
    systemPrompt,
    userPrompt,
    responseFormat: { type: 'json_object' },
  };
}
