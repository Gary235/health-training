import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { saveTrainingPlan, loadActiveMealPlan, loadActiveTrainingPlan, updateTrainingPlanStatus } from '../features/plans/plansSlice';
import { getAIService } from '../services/ai';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import LoadingOverlay from '../components/common/LoadingOverlay';
import type { TrainingSession } from '../types/plan.types';

export default function GenerateTrainingPlanPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const activeMealPlan = useAppSelector((state) => state.plans.activeMealPlan);
  const activeTrainingPlan = useAppSelector((state) => state.plans.activeTrainingPlan);

  const [durationWeeks, setDurationWeeks] = useState(4);
  const [planMode, setPlanMode] = useState<'replace' | 'extend'>('replace');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load active meal plan and training plan on component mount
  useEffect(() => {
    if (profile?.id) {
      dispatch(loadActiveMealPlan(profile.id));
      dispatch(loadActiveTrainingPlan(profile.id));
    }
  }, [dispatch, profile?.id]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Required</CardTitle>
            <CardDescription>Please complete your profile first</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/onboarding')}>
              Complete Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const availableDays = Object.entries(profile.schedule.trainingDays)
    .filter(([, availability]: [string, { available: boolean; location?: string }]) => availability.available)
    .map(([day]) => day);

  const trainingDaysWithLocation = Object.entries(profile.schedule.trainingDays)
    .filter(([, availability]: [string, { available: boolean; location?: string }]) => availability.available)
    .map(([day, availability]: [string, { available: boolean; location?: string }]) => ({
      day,
      location: availability.location || profile.preferences.workoutLocation || 'home',
    }));

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const aiService = await getAIService();

      if (!aiService.isConfigured) {
        throw new Error('AI service is not configured. Please check your API key.');
      }

      let startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      // If extending an existing plan, start from the end date of the current plan
      if (planMode === 'extend' && activeTrainingPlan) {
        const currentEndDate = new Date(activeTrainingPlan.endDate);
        startDate = new Date(currentEndDate);
        startDate.setDate(startDate.getDate() + 1); // Start the day after current plan ends
      }

      const response = await aiService.generateTrainingPlan({
        userProfile: profile,
        startDate,
        durationWeeks,
        currentMealPlan: activeMealPlan || undefined,
      });

      // Handle extend mode: merge with existing plan
      if (planMode === 'extend' && activeTrainingPlan) {
        const mergedSessions: TrainingSession[] = [
          ...activeTrainingPlan.sessions,
          ...response.plan.sessions,
        ];

        const mergedPlan = {
          ...response.plan,
          id: activeTrainingPlan.id, // Keep the same plan ID
          name: `${activeTrainingPlan.name} (Extended)`,
          startDate: activeTrainingPlan.startDate,
          sessions: mergedSessions,
        };

        await dispatch(saveTrainingPlan(mergedPlan)).unwrap();
        toast.success('Training plan extended successfully!');
      } else {
        // Replace mode: archive old plan if exists
        if (activeTrainingPlan) {
          await dispatch(updateTrainingPlanStatus({
            planId: activeTrainingPlan.id,
            status: 'archived',
          })).unwrap();
        }

        await dispatch(saveTrainingPlan(response.plan)).unwrap();
        toast.success('Training plan generated successfully!');
      }

      navigate('/plans/training');
    } catch (err) {
      console.error('Failed to generate training plan:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate training plan';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay show={loading} text="Generating your personalized training plan..." />
      <div className="min-h-screen bg-neutral-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <Button variant="ghost" onClick={() => navigate('/')}>
              ← Back to Dashboard
            </Button>
          </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Training Plan</CardTitle>
            <CardDescription>
              Create a personalized training plan based on your fitness level and goals
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="duration">Plan Duration (weeks)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="12"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(parseInt(e.target.value) || 4)}
              />
              <p className="text-sm text-neutral-600">
                Choose between 1-12 weeks. Recommended: 4 weeks for a complete training cycle.
              </p>
            </div>

            {activeTrainingPlan && (
              <div className="space-y-3">
                <Label>Plan Generation Mode</Label>
                <p className="text-sm text-neutral-600">
                  You have an active training plan. Choose how to proceed:
                </p>
                <div className="space-y-2">
                  <label
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      planMode === 'replace'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="planMode"
                      value="replace"
                      checked={planMode === 'replace'}
                      onChange={(e) => setPlanMode(e.target.value as 'replace' | 'extend')}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Replace Current Plan</div>
                      <div className="text-sm text-gray-600">
                        Archive your current plan and start fresh with a new {durationWeeks}-week program
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      planMode === 'extend'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="planMode"
                      value="extend"
                      checked={planMode === 'extend'}
                      onChange={(e) => setPlanMode(e.target.value as 'replace' | 'extend')}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Extend Current Plan</div>
                      <div className="text-sm text-gray-600">
                        Keep your existing sessions and add {durationWeeks} more weeks starting from {activeTrainingPlan.endDate ? new Date(activeTrainingPlan.endDate).toLocaleDateString() : 'the end date'}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTrainingPlan && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-2">
                <h3 className="font-semibold text-amber-900">Current Training Plan</h3>
                <div className="text-sm space-y-1 text-amber-800">
                  <p><strong>Plan Name:</strong> {activeTrainingPlan.name}</p>
                  <p><strong>Duration:</strong> {new Date(activeTrainingPlan.startDate).toLocaleDateString()} - {new Date(activeTrainingPlan.endDate).toLocaleDateString()}</p>
                  <p><strong>Sessions:</strong> {activeTrainingPlan.sessions.length} total</p>
                  {activeTrainingPlan.focusAreas && activeTrainingPlan.focusAreas.length > 0 && (
                    <p><strong>Focus Areas:</strong> {activeTrainingPlan.focusAreas.join(', ')}</p>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-neutral-100 p-4 space-y-2">
              <h3 className="font-semibold text-neutral-900">Your Profile Summary</h3>
              <div className="text-sm space-y-1 text-neutral-700">
                <p><strong>Goal:</strong> {profile.goals.primary.replace('_', ' ')}</p>
                <p><strong>Fitness Level:</strong> {profile.bodySpecs.fitnessLevel}</p>
                <p><strong>Training Days:</strong> {availableDays.length} days/week</p>
                <div className="pl-4 space-y-1 mt-2">
                  {trainingDaysWithLocation.map(({ day, location }) => (
                    <div key={day} className="flex items-center gap-2">
                      <span className="capitalize">{day}:</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        location === 'gym' ? 'bg-purple-100 text-purple-700' :
                        location === 'outdoor' ? 'bg-teal-100 text-teal-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {location === 'gym' ? '🏋️ Gym' : location === 'outdoor' ? '🌳 Outdoor' : '🏠 Home'}
                      </span>
                    </div>
                  ))}
                </div>
                {profile.preferences.equipmentAvailable.length > 0 && (
                  <p><strong>Equipment:</strong> {profile.preferences.equipmentAvailable.join(', ')}</p>
                )}
              </div>
            </div>

            {activeMealPlan && (
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 space-y-2">
                <h3 className="font-semibold text-primary">Meal Plan Integration</h3>
                <div className="text-sm space-y-1">
                  <p>Your training plan will be coordinated with your active meal plan:</p>
                  <p><strong>Meal Plan:</strong> {activeMealPlan.name}</p>
                  {activeMealPlan.dailyPlans?.[0]?.dailyNutrition && (
                    <p><strong>Daily Calories:</strong> {activeMealPlan.dailyPlans[0].dailyNutrition.calories} kcal</p>
                  )}
                  <p className="text-neutral-600 italic">
                    Workouts will be scheduled to complement your meal times and nutrition intake.
                  </p>
                </div>
              </div>
            )}

            {!activeMealPlan && (
              <div className="rounded-lg bg-neutral-100 border border-neutral-200 p-4 space-y-2">
                <h3 className="font-semibold text-neutral-900">No Active Meal Plan</h3>
                <p className="text-sm text-neutral-600">
                  Consider creating a meal plan first for better coordination between nutrition and training.
                  The training plan will be created using general nutrition guidelines.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/plans/meal/generate')}
                >
                  Create Meal Plan
                </Button>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-destructive/10 text-destructive p-4 text-sm">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading
                ? planMode === 'extend' ? 'Extending Plan...' : 'Generating...'
                : planMode === 'extend' && activeTrainingPlan
                ? 'Extend Training Plan'
                : 'Generate Training Plan'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What to Expect</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ Customized workouts for your fitness level</li>
              <li>✓ Progressive overload and periodization</li>
              <li>✓ Exercises with sets, reps, and rest periods</li>
              <li>✓ Warmup and cooldown routines</li>
              <li>✓ Equipment matched to your availability</li>
              <li>✓ Schedule fitting your available days</li>
              {activeMealPlan && (
                <li>✓ Coordinated with your meal plan for optimal timing and intensity</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
