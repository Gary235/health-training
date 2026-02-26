import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { loadActiveMealPlan, loadMealPlans, updateMealPlanStatus } from '../features/plans/plansSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import MealCard from '../components/plans/MealCard';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { toast } from 'sonner';
import type { DailyMealPlan, Meal, MealPlan } from '../types';

export default function MealPlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { activeMealPlan, mealPlans, loading } = useAppSelector((state) => state.plans);
  const profile = useAppSelector((state) => state.user.profile);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [highlightMealId, setHighlightMealId] = useState<string | null>(null);
  const [showAllPlans, setShowAllPlans] = useState(false);

  useEffect(() => {
    if (profile) {
      dispatch(loadActiveMealPlan(profile.id));
      dispatch(loadMealPlans(profile.id));
    }
  }, [dispatch, profile]);

  // Autoselect the current day when meal plan loads, or use navigation state if provided
  useEffect(() => {
    if (activeMealPlan && activeMealPlan.dailyPlans.length > 0) {
      // Check if we have a date from navigation state
      const state = location.state as { selectedDate?: Date; highlightMealId?: string };
      const targetDate = state?.selectedDate ? new Date(state.selectedDate) : new Date();
      targetDate.setHours(0, 0, 0, 0);

      // Set highlight meal ID if provided
      if (state?.highlightMealId) {
        setHighlightMealId(state.highlightMealId);
        // Clear the highlight after 3 seconds
        setTimeout(() => setHighlightMealId(null), 3000);
      }

      const currentDayIndex = activeMealPlan.dailyPlans.findIndex((day: DailyMealPlan) => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate.getTime() === targetDate.getTime();
      });

      if (currentDayIndex !== -1) {
        setSelectedDayIndex(currentDayIndex);
      }
    }
  }, [activeMealPlan, location.state]);

  const handleActivatePlan = async (planId: string) => {
    if (!profile) return;

    try {
      // Archive the current active plan
      if (activeMealPlan) {
        await dispatch(updateMealPlanStatus({
          planId: activeMealPlan.id,
          status: 'archived'
        })).unwrap();
      }

      // Activate the selected plan
      await dispatch(updateMealPlanStatus({
        planId,
        status: 'active'
      })).unwrap();

      // Reload both the active plan and all plans to update the UI
      await dispatch(loadActiveMealPlan(profile.id)).unwrap();
      await dispatch(loadMealPlans(profile.id)).unwrap();

      toast.success('Meal plan activated successfully!');
      setShowAllPlans(false);
    } catch (error) {
      console.error('Failed to activate meal plan:', error);
      toast.error('Failed to activate meal plan');
    }
  };

  const otherPlans = mealPlans.filter(plan => plan.id !== activeMealPlan?.id);

  if (loading) {
    return <LoadingOverlay show={true} text="Loading meal plan..." />;
  }

  if (!activeMealPlan) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Active Meal Plan</CardTitle>
            <CardDescription>Generate a meal plan to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/plans/meal/generate')} className="w-full">
              Generate Meal Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedDay = activeMealPlan.dailyPlans[selectedDayIndex];

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="hidden md:inline-flex">
            ← Back to Dashboard
          </Button>
          <div className="flex gap-2 md:ml-auto">
            {otherPlans.length > 0 && (
              <Button variant="outline" onClick={() => setShowAllPlans(!showAllPlans)}>
                {showAllPlans ? 'Hide' : 'Show'} All Plans ({otherPlans.length})
              </Button>
            )}
            <Button onClick={() => navigate('/plans/meal/generate')}>
              Generate New Plan
            </Button>
          </div>
        </div>

        {showAllPlans && otherPlans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All Meal Plans</CardTitle>
              <CardDescription>
                Switch between your meal plans or activate a previous plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {otherPlans.map((plan: MealPlan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900">{plan.name}</div>
                      <div className="text-sm text-neutral-600">
                        {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        Status: <span className="capitalize">{plan.status}</span> • {plan.dailyPlans.length} days
                      </div>
                    </div>
                    <Button
                      onClick={() => handleActivatePlan(plan.id)}
                      disabled={loading}
                      variant={plan.status === 'archived' ? 'default' : 'outline'}
                    >
                      {plan.status === 'active' ? 'Active' : 'Activate'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{activeMealPlan.name}</CardTitle>
            <CardDescription>
              {new Date(activeMealPlan.startDate).toLocaleDateString()} - {new Date(activeMealPlan.endDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Select Day</label>
              <Select
                value={selectedDayIndex.toString()}
                onChange={(e) => setSelectedDayIndex(parseInt(e.target.value))}
              >
                {activeMealPlan.dailyPlans.map((day: DailyMealPlan, index: number) => (
                  <option key={index} value={index}>
                    Day {index + 1} - {new Date(day.date).toLocaleDateString()}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedDay && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Daily Nutrition Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-metric-lg font-tabular text-neutral-900">{selectedDay.dailyNutrition.calories}</div>
                    <div className="text-sm text-neutral-600">Calories</div>
                  </div>
                  <div>
                    <div className="text-metric-lg font-tabular text-neutral-900">{selectedDay.dailyNutrition.protein}g</div>
                    <div className="text-sm text-neutral-600">Protein</div>
                  </div>
                  <div>
                    <div className="text-metric-lg font-tabular text-neutral-900">{selectedDay.dailyNutrition.carbohydrates}g</div>
                    <div className="text-sm text-neutral-600">Carbs</div>
                  </div>
                  <div>
                    <div className="text-metric-lg font-tabular text-neutral-900">{selectedDay.dailyNutrition.fat}g</div>
                    <div className="text-sm text-neutral-600">Fat</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-800">Meals</h2>
              {selectedDay.meals.map((meal: Meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  dayIndex={selectedDayIndex}
                  isHighlighted={highlightMealId === meal.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
