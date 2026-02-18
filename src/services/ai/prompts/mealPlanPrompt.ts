import type { MealPlanRequest, GeneratedPrompt } from '../../../types/ai.types';
import { regionalContextService } from '../../external/regionalContextService';

export function generateMealPlanPrompt(request: MealPlanRequest): GeneratedPrompt {
  const { userProfile, startDate, durationDays, adjustmentContext } = request;
  const { bodySpecs, preferences, schedule, goals } = userProfile;

  const systemPrompt = `You are an expert nutritionist creating personalized meal plans.

PRIORITIES (in order):
1. RESPECT USER TASTE - Follow their food likes, dislikes, and cuisine preferences strictly
2. Meet nutritional needs for their goals
3. Respect restrictions and allergies
4. Honor cooking/location preferences when possible

REQUIREMENTS:
- Provide 'quick' instructions (2-3 brief steps per recipe)
- Include variety to avoid meal fatigue
- Keep prep/cook times within user limits
- Return valid JSON matching the MealPlan structure`;

  const adjustmentText = adjustmentContext
    ? `\n\n=== ADJUSTMENTS NEEDED ===
Previous plan adherence: ${adjustmentContext.adherenceAnalysis.mealAdherence.toFixed(0)}%
Problem meals:
${adjustmentContext.adherenceAnalysis.patterns
  .filter(p => p.type === 'meal')
  .map(p => `• ${p.itemName}: ${(p.missRate * 100).toFixed(0)}% skipped - ${p.commonReasons.slice(0, 2).join(', ')}`)
  .join('\n')}
→ ${adjustmentContext.specificRequests || 'Address these patterns in the new plan'}`
    : '';

  // Feature 4: Cooking preferences
  const cookingPrefsText = preferences.cookingPreferences?.length
    ? `\n\nCOOKING PREFERENCES:
${preferences.cookingPreferences.map((cp) => `${cp.method}: ${cp.level}`).join(', ')}
(avoid=never use, less=minimize, prefer=prioritize)
${preferences.maxPrepTime ? `Max prep: ${preferences.maxPrepTime}min` : ''}${preferences.maxCookTime ? ` | Max cook: ${preferences.maxCookTime}min` : ''}`
    : '';

  // Feature 5: Location context
  const locationText = preferences.location
    ? `\n\nLOCATION: ${preferences.location.region.replace('_', ' ')}${preferences.location.country ? ` (${preferences.location.country})` : ''}
${preferences.location.culturalCuisines?.length ? `Preferred cuisines: ${preferences.location.culturalCuisines.join(', ')}` : ''}
${
  preferences.location.preferLocalIngredients
    ? `Focus on ingredients common in ${preferences.location.region.replace('_', ' ')}: ${regionalContextService.getRegionalIngredients(preferences.location.region).slice(0, 8).join(', ')}, etc.`
    : 'International ingredients OK, but suggest local alternatives when helpful.'
}`
    : '';

  const userPrompt = `Create a ${durationDays}-day meal plan starting ${startDate.toLocaleDateString()}.

=== USER TASTE (FOLLOW STRICTLY) ===
LOVES: ${preferences.foodLikes.length ? preferences.foodLikes.join(', ') : 'Open to variety'}
DISLIKES: ${preferences.foodDislikes.length ? preferences.foodDislikes.join(', ') : 'None'}
CUISINES: ${preferences.cuisinePreferences.length ? preferences.cuisinePreferences.join(', ') : 'All welcome'}
→ Create meals the user will actually enjoy eating!

=== REQUIREMENTS ===
Restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'}
Allergies: ${preferences.allergies.join(', ') || 'None'}${cookingPrefsText}${locationText}

=== USER STATS ===
${bodySpecs.age}y ${bodySpecs.gender}, ${bodySpecs.height}${bodySpecs.measurementSystem === 'metric' ? 'cm' : 'in'}, ${bodySpecs.weight}${bodySpecs.measurementSystem === 'metric' ? 'kg' : 'lbs'}
${bodySpecs.fitnessLevel} fitness, ${bodySpecs.activityLevel} activity
Goal: ${goals.primary}${goals.targetWeight ? ` (target: ${goals.targetWeight}${bodySpecs.measurementSystem === 'metric' ? 'kg' : 'lbs'})` : ''}

=== SCHEDULE ===
Breakfast: ${schedule.mealTimes.breakfast || 'Flexible'}, Lunch: ${schedule.mealTimes.lunch || 'Flexible'}, Dinner: ${schedule.mealTimes.dinner || 'Flexible'}
${schedule.mealTimes.snacks?.length ? `Snacks: ${schedule.mealTimes.snacks.join(', ')}` : 'Snacks as needed'}
${adjustmentText}

Return JSON with:
- id: "meal-plan-[uuid]", userId: "${userProfile.id}", name: "Descriptive Name"
- startDate: "${startDate.toISOString()}", endDate: [calculated], status: "active"
- dailyPlans: [{
    date: ISO date,
    meals: [{
      id: "meal-[uuid]", type: "breakfast/lunch/dinner/snack",
      scheduledTime: "HH:MM",
      recipe: {
        id: "recipe-[uuid]", name, description,
        ingredients: [{name, amount, unit, calories}],
        instructions: ["step1", "step2"], instructionLevel: "quick",
        primaryCookingMethod: "baking/grilling/etc",
        prepTime: mins, cookTime: mins, servings: 1,
        nutrition: {calories, protein, carbohydrates, fat}
      },
      activeRecipeId: "recipe-[uuid]"
    }],
    dailyNutrition: {calories, protein, carbohydrates, fat}
  }]
- createdAt: "${new Date().toISOString()}"`;

  return {
    systemPrompt,
    userPrompt,
    responseFormat: { type: 'json_object' },
  };
}
