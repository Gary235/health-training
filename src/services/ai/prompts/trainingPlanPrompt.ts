import type { TrainingPlanRequest, GeneratedPrompt } from '../../../types/ai.types';

export function generateTrainingPlanPrompt(
  request: TrainingPlanRequest
): GeneratedPrompt {
  const { userProfile, startDate, durationWeeks, currentMealPlan, adjustmentContext } = request;
  const { bodySpecs, preferences, schedule, goals } = userProfile;

  const systemPrompt = `You are an expert fitness trainer and exercise programmer. Create personalized, effective training plans that are safe, progressive, and aligned with the user's goals and capabilities.

Your training plans should:
- Match the user's fitness level and goals
- Use available equipment appropriately
- Include proper progression and periodization
- Have appropriate volume, intensity, and frequency
- Include warmup and cooldown exercises
- Fit the user's schedule and availability
- Be varied to prevent boredom and overuse
- Coordinate with the user's nutrition plan when provided (match workout intensity to calorie intake, avoid scheduling intense workouts during low-calorie days, consider meal timing)

Return the training plan as a valid JSON object matching the TrainingPlan type structure.`;

  const availableDays = Object.entries(schedule.trainingDays)
    .filter(([, availability]) => availability.available)
    .map(([day]) => day);

  // Build training schedule with locations
  const trainingScheduleDetails = Object.entries(schedule.trainingDays)
    .filter(([, availability]) => availability.available)
    .map(([day, availability]) => {
      const location = availability.location || preferences.workoutLocation || 'home';
      return `${day}: ${location}`;
    })
    .join(', ');

  const adjustmentText = adjustmentContext
    ? `\n\nADJUSTMENT CONTEXT:
The previous plan had adherence issues:
- Overall adherence: ${adjustmentContext.adherenceAnalysis.overallAdherence.toFixed(1)}%
- Training adherence: ${adjustmentContext.adherenceAnalysis.trainingAdherence.toFixed(1)}%
${adjustmentContext.adherenceAnalysis.patterns
  .filter(p => p.type === 'training')
  .map(
    p =>
      `- ${p.itemName}: ${p.consecutiveMisses} consecutive misses, ${(p.missRate * 100).toFixed(1)}% miss rate, reasons: ${p.commonReasons.join(', ')}`
  )
  .join('\n')}

Please adjust the plan to address these issues:
${adjustmentContext.specificRequests || 'Make appropriate adjustments based on the patterns above.'}`
    : '';

  // Extract meal plan information if available
  const mealPlanText = currentMealPlan
    ? (() => {
        const sampleDay = currentMealPlan.dailyPlans?.[0];
        const dailyNutrition = sampleDay?.dailyNutrition;
        const mealTimes = sampleDay?.meals
          ?.map((meal) => `${meal.type}: ${meal.scheduledTime}`)
          .join(', ');

        return `\n\nCURRENT MEAL PLAN:
- Plan Name: ${currentMealPlan.name}
- Duration: ${currentMealPlan.startDate} to ${currentMealPlan.endDate}${
          dailyNutrition
            ? `
- Daily Nutrition Target: ${dailyNutrition.calories} calories (Protein: ${dailyNutrition.protein}g, Carbs: ${dailyNutrition.carbohydrates}g, Fat: ${dailyNutrition.fat}g)`
            : ''
        }${
          mealTimes
            ? `
- Meal Schedule: ${mealTimes}`
            : ''
        }

IMPORTANT: Coordinate training sessions with this meal plan:
- Schedule workouts at times that don't conflict with meal times (ideally 1-2 hours after meals)
- Match workout intensity to calorie intake (the meal plan provides ${dailyNutrition?.calories || 'adequate'} daily calories)
- Consider energy availability when planning high-intensity sessions
- Ensure training volume is sustainable with the provided nutrition`;
      })()
    : '\n\nNote: No active meal plan detected. Create a balanced training plan considering general nutrition guidelines.';

  const userPrompt = `Create a ${durationWeeks}-week training plan starting from ${startDate.toLocaleDateString()}.

USER PROFILE:
- Age: ${bodySpecs.age}, Gender: ${bodySpecs.gender}
- Fitness Level: ${bodySpecs.fitnessLevel}
- Activity Level: ${bodySpecs.activityLevel}

EQUIPMENT & LOCATION:
- Available Equipment: ${preferences.equipmentAvailable.join(', ') || 'None (bodyweight only)'}
- Default Location: ${preferences.workoutLocation}

TRAINING SCHEDULE:
- Training Days: ${trainingScheduleDetails}
- Preferred Time: ${schedule.preferredWorkoutTime || 'Flexible'}

IMPORTANT: Match exercises to the specific location for each day. For gym days, use gym equipment. For home days, use available home equipment or bodyweight. For outdoor days, focus on running, calisthenics, and outdoor activities.

GOALS:
- Primary Goal: ${goals.primary}
${goals.secondary?.length ? `- Secondary Goals: ${goals.secondary.join(', ')}` : ''}
${goals.specificGoals?.length ? `- Specific Goals: ${goals.specificGoals.join(', ')}` : ''}
${mealPlanText}
${adjustmentText}

Please generate a complete training plan with:
1. Training sessions for each available day
2. Each session should include:
   - Session name and type
   - Warmup exercises
   - Main exercises with sets, reps, and rest periods
   - Cooldown exercises
   - Estimated duration and calorie burn
   - Target intensity level
3. Progression over the weeks
4. Appropriate volume for fitness level

Return as JSON matching this structure:
{
  "id": "training-plan-[uuid]",
  "userId": "${userProfile.id}",
  "name": "Descriptive Plan Name",
  "startDate": "${startDate.toISOString()}",
  "endDate": "[calculated end date]",
  "status": "active",
  "sessions": [
    {
      "id": "session-[uuid]",
      "date": "2024-01-01T00:00:00.000Z",
      "name": "Session Name",
      "type": "strength",
      "duration": 60,
      "targetIntensity": "moderate",
      "scheduledTime": "${schedule.preferredWorkoutTime === 'morning' ? '07:00' : schedule.preferredWorkoutTime === 'afternoon' ? '14:00' : '18:00'}",
      "warmup": [
        {
          "id": "warmup-1",
          "name": "Exercise Name",
          "description": "Brief description",
          "type": "flexibility",
          "muscleGroups": ["full body"],
          "equipment": [],
          "duration": 300,
          "intensity": "low",
          "instructions": ["Step 1", "Step 2"]
        }
      ],
      "exercises": [
        {
          "id": "exercise-1",
          "name": "Exercise Name",
          "description": "Brief description",
          "type": "strength",
          "muscleGroups": ["chest", "triceps"],
          "equipment": ["dumbbells"],
          "sets": 3,
          "reps": 10,
          "restBetweenSets": 60,
          "intensity": "moderate",
          "instructions": ["Step 1", "Step 2"],
          "notes": "Additional tips"
        }
      ],
      "cooldown": [],
      "estimatedCalories": 300
    }
  ],
  "focusAreas": ["strength", "muscle gain"],
  "createdAt": "${new Date().toISOString()}"
}`;

  return {
    systemPrompt,
    userPrompt,
    responseFormat: { type: 'json_object' },
  };
}
