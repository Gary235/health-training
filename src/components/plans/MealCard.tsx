import { useState } from 'react';
import type { Meal } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Clock, ChefHat, Users, Pencil } from 'lucide-react';
import EditMealDialog from './EditMealDialog';
import { updateMealInPlan } from '../../features/plans/plansSlice';
import { getAIService } from '../../services/ai/AIServiceFactory';
import { useAppDispatch, useAppSelector } from '../../store';
import { toast } from 'sonner';

interface MealCardProps {
  meal: Meal;
  dayIndex: number;
}

export default function MealCard({ meal, dayIndex }: MealCardProps) {
  const dispatch = useAppDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const { recipe } = meal;
  const activeMealPlan = useAppSelector((state) => state.plans.activeMealPlan);
  const userProfile = useAppSelector((state) => state.user.profile);

  const handleEditMeal = async (editInstructions: string) => {
    if (!activeMealPlan || !userProfile) {
      setEditError('Unable to edit meal: Missing plan or user profile');
      return;
    }

    setIsEditing(true);
    setEditError(null);

    try {
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
          targetDailyNutrition: dailyPlan.dailyNutrition, // TODO: Get from user profile calculation
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

      // Show success toast
      toast.success('Meal updated successfully!');

      // Close modal
      setIsEditModalOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to edit meal';
      setEditError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-md">{recipe.name}</CardTitle>
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
                onClick={() => setIsEditModalOpen(true)}
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
          <h4 className="font-semibold text-sm text-neutral-800 mb-2">Instructions</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside text-neutral-700">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
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

    <EditMealDialog
      open={isEditModalOpen}
      meal={meal}
      loading={isEditing}
      error={editError}
      onSave={handleEditMeal}
      onCancel={() => {
        setIsEditModalOpen(false);
        setEditError(null);
      }}
    />
  </>
  );
}
