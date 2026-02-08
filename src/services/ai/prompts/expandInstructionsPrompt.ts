import type { GeneratedPrompt, ExpandInstructionsRequest } from '../../../types/ai.types';
import type { InstructionDetailLevel } from '../../../types/plan.types';

export function generateExpandInstructionsPrompt(
  request: ExpandInstructionsRequest
): GeneratedPrompt {
  const { recipe, targetLevel, userProfile } = request;

  const systemPrompt = `You are an expert cooking instructor. Your task is to expand cooking instructions to different detail levels while maintaining accuracy and clarity.

INSTRUCTION LEVELS:
- quick: 2-3 brief steps for experienced cooks
- standard: 5-7 clear steps with key details
- detailed: 10-15 comprehensive steps with techniques, tips, and timing

Maintain the recipe's core method and ingredients. Add helpful details at higher levels:
- Specific temperatures and timing
- Cooking techniques explained
- Visual/sensory cues (e.g., "until golden brown")
- Safety tips and common mistakes to avoid
- Preparation tips for ingredients`;

  const levelDescriptions: Record<InstructionDetailLevel, string> = {
    quick: '2-3 brief steps for experienced cooks who know basic techniques',
    standard: '5-7 clear steps with key details and timing',
    detailed: '10-15 comprehensive steps with techniques, tips, visual cues, and explanations',
  };

  const userPrompt = `Expand the cooking instructions for this recipe to all three detail levels.

RECIPE: ${recipe.name}
DESCRIPTION: ${recipe.description}

CURRENT INSTRUCTIONS (${recipe.instructionLevel || 'quick'} level):
${recipe.instructions.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}

INGREDIENTS:
${recipe.ingredients.map((ing: any) => `- ${ing.amount} ${ing.unit} ${ing.name}`).join('\n')}

COOKING INFO:
- Prep time: ${recipe.prepTime} minutes
- Cook time: ${recipe.cookTime} minutes
- Servings: ${recipe.servings}
${recipe.primaryCookingMethod ? `- Primary method: ${recipe.primaryCookingMethod}` : ''}

USER SKILL LEVEL: ${userProfile.bodySpecs.fitnessLevel} (assume cooking skill correlates)

Generate instructions for ALL THREE levels:
1. Quick (${levelDescriptions.quick})
2. Standard (${levelDescriptions.standard})
3. Detailed (${levelDescriptions.detailed})

TARGET LEVEL FOR THIS REQUEST: ${targetLevel}

Return as JSON:
{
  "instructions": {
    "quick": ["step 1", "step 2", "step 3"],
    "standard": ["step 1", "step 2", ..., "step 7"],
    "detailed": ["step 1", "step 2", ..., "step 15"]
  },
  "notes": "Optional notes about the expansion"
}`;

  return {
    systemPrompt,
    userPrompt,
    responseFormat: { type: 'json_object' },
  };
}
