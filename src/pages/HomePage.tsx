import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { loadActiveMealPlan, loadActiveTrainingPlan } from '../features/plans/plansSlice';
import { loadTodayLog } from '../features/logs/logsSlice';
import { loadTodayMetrics } from '../features/metrics/metricsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import AdaptivePlanningBanner from '../components/common/AdaptivePlanningBanner';
import { User, Utensils, Dumbbell, TrendingUp, Scale, History } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const { activeMealPlan, activeTrainingPlan } = useAppSelector((state) => state.plans);
  const { todayLog } = useAppSelector((state) => state.logs);
  const { currentMetrics } = useAppSelector((state) => state.metrics);

  // Profile is already loaded during app initialization/hydration
  // Just load the active plans and logs when we have a profile
  useEffect(() => {
    if (profile) {
      dispatch(loadActiveMealPlan(profile.id));
      dispatch(loadActiveTrainingPlan(profile.id));
      dispatch(loadTodayLog(profile.id));
      dispatch(loadTodayMetrics());
    } else {
      // If no profile, redirect to onboarding
      console.log('[HomePage] No profile found, redirecting to onboarding');
      navigate('/onboarding');
    }
  }, [dispatch, profile, navigate]);

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdaptivePlanningBanner />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Profile Card */}
          <Card className="hidden md:block">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-neutral-600" />
                <CardTitle>Profile</CardTitle>
              </div>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Age</span>
                  <span className="font-medium text-neutral-900">{profile.bodySpecs.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Height</span>
                  <span className="font-medium text-neutral-900">
                    {profile.bodySpecs.height}{profile.bodySpecs.measurementSystem === 'metric' ? ' cm' : ' in'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Weight</span>
                  <span className="font-medium text-neutral-900">
                    {profile.bodySpecs.weight}{profile.bodySpecs.measurementSystem === 'metric' ? ' kg' : ' lbs'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Fitness</span>
                  <span className="font-medium text-neutral-900 capitalize">{profile.bodySpecs.fitnessLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Goal</span>
                  <span className="font-medium text-neutral-900 capitalize">
                    {profile.goals.primary.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/profile')}
                className="w-full"
              >
                View Profile
              </Button>
            </CardContent>
          </Card>

          {/* Meal Plan Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-neutral-600" />
                <CardTitle>Meal Plan</CardTitle>
              </div>
              <CardDescription>Your nutrition plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeMealPlan ? (
                <>
                  <div className="space-y-2">
                    <p className="font-medium text-neutral-900">{activeMealPlan.name}</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <span>{activeMealPlan.dailyPlans.length} days</span>
                      <span>•</span>
                      <span>{new Date(activeMealPlan.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/plans/meal')}
                    className="w-full"
                  >
                    View Plan
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-neutral-600">No active meal plan</p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate('/plans/meal/generate')}
                    className="w-full"
                  >
                    Generate Meal Plan
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Training Plan Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-neutral-600" />
                <CardTitle>Training Plan</CardTitle>
              </div>
              <CardDescription>Your workout plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTrainingPlan ? (
                <>
                  <div className="space-y-2">
                    <p className="font-medium text-neutral-900">{activeTrainingPlan.name}</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <span>{activeTrainingPlan.sessions.length} sessions</span>
                      <span>•</span>
                      <span>{new Date(activeTrainingPlan.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/plans/training')}
                    className="w-full"
                  >
                    View Plan
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-neutral-600">No active training plan</p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate('/plans/training/generate')}
                    className="w-full"
                  >
                    Generate Training Plan
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Today's Progress Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-neutral-600" />
                <CardTitle>Today's Progress</CardTitle>
              </div>
              <CardDescription>Track your daily adherence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayLog ? (
                <>
                  <div className="text-center">
                    <div className="text-metric-lg font-tabular text-neutral-900">
                      {todayLog.overallAdherence}%
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">Adherence</div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        todayLog.overallAdherence >= 80
                          ? 'bg-success'
                          : todayLog.overallAdherence >= 60
                          ? 'bg-warning'
                          : 'bg-error'
                      }`}
                      style={{ width: `${todayLog.overallAdherence}%` }}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/daily')}
                    className="w-full"
                  >
                    View Daily Log
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-neutral-600">No logs for today</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/daily')}
                    className="w-full"
                  >
                    View Daily Log
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Body Metrics Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-neutral-600" />
                <CardTitle>Body Metrics</CardTitle>
              </div>
              <CardDescription>Track your measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentMetrics ? (
                <>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {currentMetrics.weight && (
                      <div>
                        <div className="text-metric-lg font-tabular text-neutral-900">
                          {currentMetrics.weight}
                        </div>
                        <div className="text-xs text-neutral-600 mt-1">
                          {profile.bodySpecs.measurementSystem === 'metric' ? 'kg' : 'lbs'}
                        </div>
                      </div>
                    )}
                    {currentMetrics.bodyFat && (
                      <div>
                        <div className="text-metric-lg font-tabular text-neutral-900">
                          {currentMetrics.bodyFat}%
                        </div>
                        <div className="text-xs text-neutral-600 mt-1">Body Fat</div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/metrics')}
                    className="w-full"
                  >
                    View Metrics
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-neutral-600">No metrics recorded</p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate('/metrics')}
                    className="w-full"
                  >
                    Add Metrics
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* History Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-neutral-600" />
                <CardTitle>History</CardTitle>
              </div>
              <CardDescription>View your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/history')}
                className="w-full"
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
