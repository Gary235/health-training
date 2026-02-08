import { useState, useEffect } from 'react';
import type { Meal } from '../../types';
import { Button } from '../ui/button';
import RecipeComparisonCard from './RecipeComparisonCard';
import { useAppSelector } from '../../store';

interface MealAlternativesDialogProps {
  open: boolean;
  meal: Meal;
  dayIndex: number;
  onClose: () => void;
  onSelectRecipe: (recipeId: string) => Promise<void>;
}

export default function MealAlternativesDialog({
  open,
  meal: initialMeal,
  dayIndex,
  onClose,
  onSelectRecipe,
}: MealAlternativesDialogProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(
    initialMeal.activeRecipeId || initialMeal.recipe.id || ''
  );

  // Get the latest meal from Redux state to pick up generated alternatives
  const activeMealPlan = useAppSelector((state) => state.plans.activeMealPlan);
  const meal = activeMealPlan?.dailyPlans[dayIndex]?.meals.find(m => m.id === initialMeal.id) || initialMeal;

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedRecipeId(meal.activeRecipeId || meal.recipe.id || '');
    }
  }, [open, meal.activeRecipeId, meal.recipe.id]);

  if (!open) return null;

  const handleSelectRecipe = async () => {
    const currentRecipeId = meal.activeRecipeId || meal.recipe.id || '';
    if (selectedRecipeId === currentRecipeId) {
      onClose();
      return;
    }

    setIsSelecting(true);
    try {
      await onSelectRecipe(selectedRecipeId);
      onClose();
    } catch (error) {
      console.error('Failed to switch recipe:', error);
    } finally {
      setIsSelecting(false);
    }
  };

  const currentRecipeId = meal.activeRecipeId || meal.recipe.id || '';
  const hasAlternatives = meal.alternatives && meal.alternatives.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">Recipe Alternatives</h2>
              <p className="text-sm text-neutral-600 mt-1">
                Compare and choose between different versions of this meal
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Original Recipe */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">Original Recipe</h3>
              <RecipeComparisonCard
                recipe={meal.recipe}
                isSelected={selectedRecipeId === meal.recipe.id}
                onSelect={() => setSelectedRecipeId(meal.recipe.id!)}
              />
            </div>

            {/* Alternatives */}
            {hasAlternatives && (
              <div>
                <h3 className="text-sm font-medium text-neutral-700 mb-2">
                  Alternative Versions ({meal.alternatives!.length})
                </h3>
                <div className="space-y-3">
                  {meal.alternatives!.map((recipe) => {
                    const calDiff = recipe.nutrition.calories - meal.recipe.nutrition.calories;
                    const proteinDiff = recipe.nutrition.protein - meal.recipe.nutrition.protein;

                    return (
                      <div key={recipe.id}>
                        <RecipeComparisonCard
                          recipe={recipe}
                          isSelected={selectedRecipeId === recipe.id}
                          onSelect={() => setSelectedRecipeId(recipe.id!)}
                        />
                        <div className="text-xs text-neutral-600 mt-1 ml-4">
                          vs Original: {calDiff > 0 ? '+' : ''}
                          {calDiff} cal, {proteinDiff > 0 ? '+' : ''}
                          {proteinDiff}g protein
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasAlternatives && (
              <div className="text-center py-8 text-neutral-600">
                <p>No alternatives available yet.</p>
                <p className="text-sm mt-2">Generate alternatives from the edit menu.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-neutral-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-neutral-600">
              {selectedRecipeId !== currentRecipeId && (
                <span className="text-blue-600 font-medium">
                  Switching recipe will update daily nutrition totals
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSelectRecipe}
                disabled={selectedRecipeId === currentRecipeId || isSelecting}
              >
                {isSelecting
                  ? 'Applying...'
                  : selectedRecipeId === currentRecipeId
                  ? 'No Changes'
                  : 'Apply Selection'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
