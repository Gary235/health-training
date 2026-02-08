import { useState } from 'react';
import type { Meal } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Clock, ChefHat, Users, Pencil, Repeat2 } from 'lucide-react';
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-md">{recipe.name}</CardTitle>
                {hasAlternatives ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAlternatives(true)}
                    className="h-6 px-2 text-xs"
                    title={`${meal.alternatives!.length} alternative${meal.alternatives!.length > 1 ? 's' : ''} available`}
                  >
                    <Repeat2 className="w-3 h-3 mr-1" />
                    {meal.alternatives!.length} alt{meal.alternatives!.length > 1 ? 's' : ''}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateAlternatives}
                    disabled={isGeneratingAlternatives}
                    className="h-6 px-2 text-xs"
                    title="Generate alternative recipes"
                  >
                    <Repeat2 className="w-3 h-3 mr-1" />
                    {isGeneratingAlternatives ? 'Generating...' : 'Generate alts'}
                  </Button>
                )}
              </div>
              <CardDescription className="capitalize">{meal.type} • {meal.scheduledTime}</CardDescription>
            </div>
            <div className="flex items-start gap-2">
              <div className="text-right text-sm">
                <div className="font-semibold font-tabular text-neutral-900">{recipe.nutrition.calories} cal</div>
                <div className="text-xs text-neutral-600 font-tabular">
                  P: {recipe.nutrition.protein}g • C: {recipe.nutrition.carbohydrates}g • F: {recipe.nutrition.fat}g
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMealEditor(true)}
                className="h-8 w-8 p-0"
                title="Edit meal"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-neutral-700">{recipe.description}</p>

        <div>
          <h4 className="font-semibold text-sm text-neutral-800 mb-2">Ingredients</h4>
          <ul className="text-sm space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex justify-between text-neutral-700">
                <span>{ingredient.name}</span>
                <span className="text-neutral-600 font-tabular">
                  {ingredient.amount} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <InstructionExpandButton
            instructions={recipe.instructions}
            isExpanded={meal.instructionsExpanded || false}
            isLoading={isExpandingInstructions}
            onExpand={handleExpandInstructions}
          />
        </div>

        <div className="flex gap-4 text-sm text-neutral-600 pt-2 border-t border-neutral-200">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Prep: {recipe.prepTime}min
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            Cook: {recipe.cookTime}min
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            Servings: {recipe.servings}
          </span>
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
