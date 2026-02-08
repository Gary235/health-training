import { useState } from 'react';
import type { Meal } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Clock, ChefHat, Users, Pencil, Repeat2, ChevronDown, ChevronRight } from 'lucide-react';
import MealEditorDialog from './MealEditorDialog';
import MealAlternativesDialog from './MealAlternativesDialog';
import InstructionExpandButton from './InstructionExpandButton';
import {
  updateMealInPlan,
  expandMealInstructions,
  generateMealVariations,
  switchMealRecipe
} from '../../features/plans/plansSlice';
import { getAIService } from '../../services/ai/AIServiceFactory';
import { useAppDispatch, useAppSelector } from '../../store';
import { toast } from 'sonner';

interface MealCardProps {
  meal: Meal;
  dayIndex: number;
}

export default function MealCard({ meal, dayIndex }: MealCardProps) {
  const dispatch = useAppDispatch();
  const [showMealEditor, setShowMealEditor] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [isExpandingInstructions, setIsExpandingInstructions] = useState(false);
  const [isGeneratingAlternatives, setIsGeneratingAlternatives] = useState(false);
  const [ingredientsExpanded, setIngredientsExpanded] = useState(true);
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);
  const [variantNotesExpanded, setVariantNotesExpanded] = useState(false);

  const { recipe } = meal;
  const activeMealPlan = useAppSelector((state) => state.plans.activeMealPlan);
  const userProfile = useAppSelector((state) => state.user.profile);

  const handleSaveMeal = async (editInstructions: string): Promise<void> => {
    if (!activeMealPlan || !userProfile) {
      throw new Error('Unable to edit meal: Missing plan or user profile');
    }

    // Get daily meal context
    const dailyPlan = activeMealPlan.dailyPlans[dayIndex];
    const otherMeals = dailyPlan.meals.filter((m: Meal) => m.id !== meal.id);

    // Call AI service to edit the meal
    const aiService = await getAIService();
    const response = await aiService.editMeal({
      meal,
      userProfile,
      editInstructions,
      dailyMealContext: {
        otherMeals,
        currentDailyNutrition: dailyPlan.dailyNutrition,
        targetDailyNutrition: dailyPlan.dailyNutrition,
      },
    });

    // Dispatch Redux action to update the meal
    await dispatch(
      updateMealInPlan({
        planId: activeMealPlan.id,
        dayIndex,
        mealId: meal.id,
        updatedMeal: response.meal,
      })
    ).unwrap();

    toast.success('Meal updated successfully!');
  };

  const handleExpandInstructions = async () => {
    if (!activeMealPlan || !userProfile) return;

    setIsExpandingInstructions(true);
    try {
      await dispatch(
        expandMealInstructions({
          planId: activeMealPlan.id,
          dayIndex,
          mealId: meal.id,
          userProfile,
        })
      ).unwrap();
      toast.success('Instructions expanded');
    } catch (error) {
      toast.error('Failed to expand instructions');
    } finally {
      setIsExpandingInstructions(false);
    }
  };

  const handleGenerateAlternatives = async (): Promise<void> => {
    if (!activeMealPlan || !userProfile) {
      toast.error('Unable to generate alternatives: Missing plan or user profile');
      return;
    }

    setIsGeneratingAlternatives(true);
    try {
      await dispatch(
        generateMealVariations({
          planId: activeMealPlan.id,
          dayIndex,
          mealId: meal.id,
          variationCount: 2,
          userProfile,
        })
      ).unwrap();

      toast.success('Recipe variations generated!');
      // Automatically open the alternatives dialog after generation
      setShowAlternatives(true);
    } catch {
      toast.error('Failed to generate alternatives');
    } finally {
      setIsGeneratingAlternatives(false);
    }
  };

  const handleSelectRecipe = async (recipeId: string): Promise<void> => {
    if (!activeMealPlan) {
      throw new Error('Unable to switch recipe: Missing plan');
    }

    await dispatch(
      switchMealRecipe({
        planId: activeMealPlan.id,
        dayIndex,
        mealId: meal.id,
        recipeId,
      })
    ).unwrap();

    toast.success('Recipe switched successfully!');
  };

  const hasAlternatives = meal.alternatives && meal.alternatives.length > 0;
  const isAlternativeActive = meal.activeRecipeId && meal.activeRecipeId !== meal.recipe.id;
  const activeRecipe = isAlternativeActive
    ? meal.alternatives?.find(alt => alt.id === meal.activeRecipeId)
    : null;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          {/* Title and Badge */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <CardTitle className="text-base leading-tight flex-1">{recipe.name}</CardTitle>
                {isAlternativeActive && activeRecipe?.variantNotes && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {activeRecipe.variantNotes.split(' ')[0]}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMealEditor(true)}
                className="h-8 w-8 p-0 shrink-0"
                title="Edit meal"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>

            {/* Nutrition Info */}
            <div className="flex items-center justify-between text-sm">
              <div className="font-semibold font-tabular text-neutral-900">{recipe.nutrition.calories} cal</div>
              <div className="text-xs text-neutral-600 font-tabular">
                P {recipe.nutrition.protein}g • C {recipe.nutrition.carbohydrates}g • F {recipe.nutrition.fat}g
              </div>
            </div>

            {/* Meal Type, Time, and Alternatives */}
            <div className="flex items-center justify-between">
              <CardDescription className="capitalize text-xs">{meal.type} • {meal.scheduledTime}</CardDescription>
              {hasAlternatives ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAlternatives(true)}
                  className="h-7 px-2 text-xs -mr-2"
                  title={`${meal.alternatives!.length} alternative${meal.alternatives!.length > 1 ? 's' : ''} available`}
                >
                  <Repeat2 className="w-3 h-3 mr-1" />
                  {meal.alternatives!.length} alt{meal.alternatives!.length > 1 ? 's' : ''}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateAlternatives}
                  disabled={isGeneratingAlternatives}
                  className="h-7 px-2 text-xs -mr-2"
                  title="Generate alternative recipes"
                >
                  <Repeat2 className="w-3 h-3 mr-1" />
                  {isGeneratingAlternatives ? '...' : 'Generate alts'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Variant Notes - Collapsible if active alternative */}
          {isAlternativeActive && activeRecipe?.variantNotes && (
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
              <p className={`text-sm text-blue-900 ${!variantNotesExpanded && 'line-clamp-2'}`}>
                {activeRecipe.variantNotes}
              </p>
              {activeRecipe.variantNotes.length > 100 && (
                <button
                  onClick={() => setVariantNotesExpanded(!variantNotesExpanded)}
                  className="text-xs text-blue-700 font-medium mt-1 hover:underline"
                >
                  {variantNotesExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-neutral-700 leading-relaxed">{recipe.description}</p>

          {/* Ingredients - Collapsible */}
          <div className="border-t border-neutral-200 pt-3">
            <button
              onClick={() => setIngredientsExpanded(!ingredientsExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-semibold text-sm text-neutral-800">
                Ingredients ({recipe.ingredients.length})
              </h4>
              {ingredientsExpanded ? (
                <ChevronDown className="w-4 h-4 text-neutral-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              )}
            </button>

            {ingredientsExpanded && (
              <ul className="text-sm space-y-1 mt-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between text-neutral-700">
                    <span>{ingredient.name}</span>
                    <span className="text-neutral-600 font-tabular">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Instructions - Collapsible */}
          <div className="border-t border-neutral-200 pt-3">
            <button
              onClick={() => setInstructionsExpanded(!instructionsExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-semibold text-sm text-neutral-800">Instructions</h4>
              {instructionsExpanded ? (
                <ChevronDown className="w-4 h-4 text-neutral-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              )}
            </button>

            {instructionsExpanded && (
              <div className="mt-2">
                <InstructionExpandButton
                  instructions={recipe.instructions}
                  isExpanded={meal.instructionsExpanded || false}
                  isLoading={isExpandingInstructions}
                  onExpand={handleExpandInstructions}
                />
              </div>
            )}
          </div>

          {/* Time Info */}
          <div className="flex flex-wrap gap-3 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {recipe.prepTime}m prep
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5" />
              {recipe.cookTime}m cook
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
            </span>
            {recipe.primaryCookingMethod && (
              <span className="capitalize">
                • {recipe.primaryCookingMethod.replace('_', ' ')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

    <MealEditorDialog
      open={showMealEditor}
      meal={meal}
      onClose={() => setShowMealEditor(false)}
      onSaveMeal={handleSaveMeal}
    />

    <MealAlternativesDialog
      open={showAlternatives}
      meal={meal}
      dayIndex={dayIndex}
      onClose={() => setShowAlternatives(false)}
      onSelectRecipe={handleSelectRecipe}
    />
  </>
  );
}
