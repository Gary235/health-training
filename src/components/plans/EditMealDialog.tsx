import { useState } from 'react';
import type { Meal } from '../../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';

interface EditMealDialogProps {
  open: boolean;
  meal: Meal;
  loading?: boolean;
  error?: string | null;
  onSave: (editInstructions: string) => void;
  onCancel: () => void;
}

export default function EditMealDialog({
  open,
  meal,
  loading = false,
  error = null,
  onSave,
  onCancel,
}: EditMealDialogProps) {
  const [editInstructions, setEditInstructions] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInstructions.trim()) {
      return;
    }
    onSave(editInstructions);
  };

  const handleClose = () => {
    setEditInstructions('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Edit Meal</CardTitle>
            <CardDescription className="text-base">
              Request changes to this meal using natural language
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
                disabled={loading}
                className="resize-none text-base bg-white text-neutral-900 placeholder:text-neutral-500"
              />
              {!editInstructions.trim() && (
                <p className="text-sm text-neutral-500">
                  Be specific about what you'd like to change
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                <p className="text-sm text-red-900 font-medium">{error}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !editInstructions.trim()}
              className="flex-1 h-10 bg-neutral-900 text-white hover:bg-neutral-800"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Editing...
                </>
              ) : (
                'Edit Meal'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
