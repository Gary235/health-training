import type { MealPlanRequest, GeneratedPrompt } from '../../../types/ai.types';

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
- Cuisine Preferences: ${preferences.cuisinePreferences.join(', ') || 'Various'}

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
   - Detailed cooking instructions
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
            "name": "Recipe Name",
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
          }
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
