import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { loadActiveMealPlan } from '../features/plans/plansSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import MealCard from '../components/plans/MealCard';
import LoadingOverlay from '../components/common/LoadingOverlay';
import type { DailyMealPlan, Meal } from '../types';

export default function MealPlanPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeMealPlan, loading } = useAppSelector((state) => state.plans);
  const profile = useAppSelector((state) => state.user.profile);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    if (profile) {
      dispatch(loadActiveMealPlan(profile.id));
    }
  }, [dispatch, profile]);

  // Autoselect the current day when meal plan loads
  useEffect(() => {
    if (activeMealPlan && activeMealPlan.dailyPlans.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const currentDayIndex = activeMealPlan.dailyPlans.findIndex((day: DailyMealPlan) => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate.getTime() === today.getTime();
      });

      if (currentDayIndex !== -1) {
        setSelectedDayIndex(currentDayIndex);
      }
    }
  }, [activeMealPlan]);

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
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </Button>
          <Button onClick={() => navigate('/plans/meal/generate')}>
            Generate New Plan
          </Button>
        </div>

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
                <MealCard key={meal.id} meal={meal} dayIndex={selectedDayIndex} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
