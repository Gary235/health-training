import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { saveMealPlan } from '../features/plans/plansSlice';
import { getAIService } from '../services/ai';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import LoadingOverlay from '../components/common/LoadingOverlay';

export default function GenerateMealPlanPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);

  const [durationDays, setDurationDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const aiService = await getAIService();

      if (!aiService.isConfigured) {
        throw new Error('AI service is not configured. Please check your API key.');
      }

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const response = await aiService.generateMealPlan({
        userProfile: profile,
        startDate,
        durationDays,
      });

      await dispatch(saveMealPlan(response.plan)).unwrap();
      toast.success('Meal plan generated successfully!');
      navigate('/plans/meal');
    } catch (err) {
      console.error('Failed to generate meal plan:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate meal plan';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay show={loading} text="Generating your personalized meal plan..." />
      <div className="min-h-screen bg-neutral-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <Button variant="ghost" onClick={() => navigate('/')} className="hidden md:inline-flex">
              ← Back to Dashboard
            </Button>
          </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Meal Plan</CardTitle>
            <CardDescription>
              Create a personalized meal plan based on your profile and goals
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="duration">Plan Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="30"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 7)}
              />
              <p className="text-sm text-neutral-600">
                Choose between 1-30 days. Recommended: 7 days for weekly planning.
              </p>
            </div>

            <div className="rounded-lg bg-neutral-100 p-4 space-y-2">
              <h3 className="font-semibold text-neutral-900">Your Profile Summary</h3>
              <div className="text-sm space-y-1 text-neutral-700">
                <p><strong>Goal:</strong> {profile.goals.primary.replace('_', ' ')}</p>
                <p><strong>Activity Level:</strong> {profile.bodySpecs.activityLevel.replace('_', ' ')}</p>
                <p><strong>Dietary Restrictions:</strong> {profile.preferences.dietaryRestrictions.join(', ') || 'None'}</p>
                {profile.preferences.allergies.length > 0 && (
                  <p><strong>Allergies:</strong> {profile.preferences.allergies.join(', ')}</p>
                )}
              </div>
            </div>

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
              {loading ? 'Generating...' : 'Generate Meal Plan'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What to Expect</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ Personalized meals based on your preferences</li>
              <li>✓ Detailed recipes with ingredients and instructions</li>
              <li>✓ Nutrition information for each meal</li>
              <li>✓ Daily calorie and macro targets</li>
              <li>✓ Scheduled meal times</li>
              <li>✓ Shopping list generation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
