import { useState } from 'react';
import type { Meal } from '../../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import LoadingOverlay from '../common/LoadingOverlay';

type DialogState =
  | { mode: 'input' }
  | { mode: 'editing' }
  | { mode: 'error'; message: string };

interface MealEditorDialogProps {
  open: boolean;
  meal: Meal;
  onClose: () => void;
  onSaveMeal: (editInstructions: string) => Promise<void>;
}

export default function MealEditorDialog({
  open,
  meal,
  onClose,
  onSaveMeal,
}: MealEditorDialogProps) {
  const [state, setState] = useState<DialogState>({ mode: 'input' });
  const [editInstructions, setEditInstructions] = useState('');

  if (!open) return null;

  const handleClose = () => {
    setState({ mode: 'input' });
    setEditInstructions('');
    onClose();
  };

  const handleEditMeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editInstructions.trim()) return;

    setState({ mode: 'editing' });
    try {
      await onSaveMeal(editInstructions);
      handleClose();
    } catch (error) {
      setState({
        mode: 'error',
        message: error instanceof Error ? error.message : 'Failed to edit meal',
      });
    }
  };

  // Render loading overlay
  if (state.mode === 'editing') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <LoadingOverlay show={true} text="Saving changes..." />
      </div>
    );
  }

  // Render input mode (default) or error state
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleEditMeal}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Edit Meal</CardTitle>
            <CardDescription className="text-base">
              Describe your changes and the AI will modify this meal
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Current Meal Info */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 mb-3">Current Meal</h4>
              <div className="bg-neutral-50 p-4 rounded-lg space-y-3 border border-neutral-200">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-neutral-900">{meal.recipe.name}</h3>
                    <p className="text-sm text-neutral-600 capitalize mt-1">
                      {meal.type} • {meal.scheduledTime}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold font-tabular text-neutral-900 text-base">
                      {meal.recipe.nutrition.calories} cal
                    </div>
                    <div className="text-sm text-neutral-600 font-tabular mt-1">
                      P: {meal.recipe.nutrition.protein}g • C: {meal.recipe.nutrition.carbohydrates}g • F: {meal.recipe.nutrition.fat}g
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">{meal.recipe.description}</p>
                <div className="text-sm text-neutral-600 pt-2 border-t border-neutral-200">
                  Prep: {meal.recipe.prepTime}min • Cook: {meal.recipe.cookTime}min
                </div>
              </div>
            </div>

            {/* Edit Instructions */}
            <div className="space-y-3">
              <label htmlFor="editInstructions" className="text-sm font-semibold text-neutral-900 block">
                What would you like to change?
              </label>
              <Textarea
                id="editInstructions"
                value={editInstructions}
                onChange={(e) => setEditInstructions(e.target.value)}
                placeholder="Examples:&#10;• Make it vegetarian&#10;• Add more protein&#10;• Reduce calories to around 400&#10;• Replace chicken with fish&#10;• Make it spicier"
                rows={6}
                className="resize-none text-base bg-white text-neutral-900 placeholder:text-neutral-500"
              />
              {!editInstructions.trim() && (
                <p className="text-sm text-neutral-500">
                  Be specific about what you'd like to change
                </p>
              )}
            </div>

            {/* Error Message */}
            {state.mode === 'error' && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                <p className="text-sm text-red-900 font-medium">{state.message}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setState({ mode: 'input' })}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1 h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!editInstructions.trim()}
              className="flex-1 h-10 bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Edit Meal
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
