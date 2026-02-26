import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { loadActiveMealPlan, loadActiveTrainingPlan } from '../features/plans/plansSlice';
import { loadTodayLog, loadLogs } from '../features/logs/logsSlice';
import { loadTodayMetrics, loadMetrics } from '../features/metrics/metricsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { useAdaptivePlanning } from '../hooks/useAdaptivePlanning';
import { Utensils, Dumbbell, TrendingUp, Scale, History, Clock, AlertCircle } from 'lucide-react';
import { APP_VERSION } from '../constants/version';

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const { activeMealPlan, activeTrainingPlan } = useAppSelector((state) => state.plans);
  const { logs } = useAppSelector((state) => state.logs);
  const { metrics, currentMetrics } = useAppSelector((state) => state.metrics);
  const { todayMeals, todaySessions, todayLog } = useDailyPlan();
  const { analysis, needsAdjustment } = useAdaptivePlanning();

  const [weightChange, setWeightChange] = useState<number | null>(null);
  const [consistency, setConsistency] = useState<number>(0);
  const [lastWorkout, setLastWorkout] = useState<string>('');
  const [lastLog, setLastLog] = useState<string>('');

  // Profile is already loaded during app initialization/hydration
  // Just load the active plans and logs when we have a profile
  useEffect(() => {
    if (profile) {
      dispatch(loadActiveMealPlan(profile.id));
      dispatch(loadActiveTrainingPlan(profile.id));
      dispatch(loadTodayLog(profile.id));
      dispatch(loadTodayMetrics());

      // Load last 30 days of metrics for weight change
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dispatch(loadMetrics({ startDate: thirtyDaysAgo, endDate: new Date() }));

      // Load last 30 days of logs for consistency
      dispatch(loadLogs({ userId: profile.id, startDate: thirtyDaysAgo, endDate: new Date() }));
    } else {
      // If no profile, redirect to onboarding
      console.log('[HomePage] No profile found, redirecting to onboarding');
      navigate('/onboarding');
    }
  }, [dispatch, profile, navigate]);

  // Calculate weight change over 30 days
  useEffect(() => {
    if (metrics.length > 0 && currentMetrics?.weight) {
      const sortedMetrics = [...metrics].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const oldestWeight = sortedMetrics[0]?.weight;
      if (oldestWeight && currentMetrics.weight) {
        const change = currentMetrics.weight - oldestWeight;
        setWeightChange(change);
      }
    }
  }, [metrics, currentMetrics]);

  // Calculate consistency percentage (days logged in last 30 days)
  useEffect(() => {
    if (logs.length > 0) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentLogs = logs.filter(log =>
        new Date(log.date) >= thirtyDaysAgo
      );

      const consistencyPercent = Math.round((recentLogs.length / 30) * 100);
      setConsistency(consistencyPercent);

      // Find last workout and last log
      const logsWithTraining = logs
        .filter(log => log.trainingLogs && log.trainingLogs.length > 0)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (logsWithTraining.length > 0) {
        const lastWorkoutDate = new Date(logsWithTraining[0].date);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) setLastWorkout('Today');
        else if (diffDays === 1) setLastWorkout('Yesterday');
        else setLastWorkout(`${diffDays} days ago`);
      } else {
        setLastWorkout('No workouts logged');
      }

      // Find last log entry
      if (logs.length > 0) {
        const sortedLogs = [...logs].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const lastLogDate = new Date(sortedLogs[0].date);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) setLastLog('Today');
        else if (diffDays === 1) setLastLog('Yesterday');
        else setLastLog(`${diffDays} days ago`);
      }
    }
  }, [logs]);

  if (!profile) {
    return null;
  }

  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="md:hidden p-4 space-y-4">
          {/* Greeting Section - No border */}
          <div className="px-2 py-3">
            <div className="text-2xl font-semibold text-neutral-900">
              👋 Hi,  there
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
              <span>Today · {dayOfWeek}</span>
              <span>·</span>
              <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full font-medium">
                v{APP_VERSION}
              </span>
            </div>
          </div>

          {/* TODAY Section - Only show incomplete items */}
          {((todaySessions.length > 0 && !todayLog?.trainingLogs.find(log => log.sessionId === todaySessions[0].id)) ||
            (todayMeals.length > 0 && todayLog?.mealLogs.length !== todayMeals.length)) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🧠 TODAY
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Training - only if not completed */}
                {todaySessions.length > 0 && !todayLog?.trainingLogs.find(log => log.sessionId === todaySessions[0].id) && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Dumbbell className="w-5 h-5 text-neutral-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">
                            Training: {todaySessions[0].name}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-neutral-600">
                            <Clock className="w-4 h-4" />
                            {todaySessions[0].duration || 45} min
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate('/daily')}
                        className="w-full"
                      >
                        Start Workout
                      </Button>
                    </div>
                    {todayMeals.length > 0 && todayLog?.mealLogs.length !== todayMeals.length && (
                      <div className="border-t border-neutral-200" />
                    )}
                  </>
                )}

                {/* Meal - only if not all meals completed */}
                {todayMeals.length > 0 && todayLog?.mealLogs.length !== todayMeals.length && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Utensils className="w-5 h-5 text-neutral-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900">
                          Meal: {todayMeals.length - (todayLog?.mealLogs.length || 0)} meals remaining
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/plans/meal')}
                      className="w-full"
                    >
                      View Meals
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Action Grid - Three buttons in a row */}
          <div className="grid grid-cols-3 gap-4">
            <Card
              className="cursor-pointer hover:bg-neutral-100 transition-colors"
              onClick={() => navigate('/plans/training')}
            >
              <CardContent className="pt-6 pb-4 text-center space-y-2">
                <Dumbbell className="w-8 h-8 mx-auto text-neutral-700" />
                <div>
                  <div className="font-semibold text-neutral-900 text-sm">Train</div>
                  <div className="text-xs text-neutral-600">Training Plan</div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-neutral-100 transition-colors"
              onClick={() => navigate('/plans/meal')}
            >
              <CardContent className="pt-6 pb-4 text-center space-y-2">
                <Utensils className="w-8 h-8 mx-auto text-neutral-700" />
                <div>
                  <div className="font-semibold text-neutral-900 text-sm">Eat</div>
                  <div className="text-xs text-neutral-600">Meal Plan</div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-neutral-100 transition-colors"
              onClick={() => navigate('/metrics')}
            >
              <CardContent className="pt-6 pb-4 text-center space-y-2">
                <Scale className="w-8 h-8 mx-auto text-neutral-700" />
                <div>
                  <div className="font-semibold text-neutral-900 text-sm">Measure</div>
                  <div className="text-xs text-neutral-600">Body Metrics</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PROGRESS Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 PROGRESS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Plan Adjustment Notice */}
              {needsAdjustment && analysis && (
                <div className="bg-[rgb(254,252,232)] border border-[rgb(133,77,14)] rounded-lg p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[rgb(133,77,14)] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-neutral-900">
                        Plan Adjustment Available
                      </div>
                      <div className="text-xs text-neutral-600 mt-1">
                        Analysis of your last 7 days shows patterns that may benefit from adjustment
                      </div>
                      <div className="text-xs text-neutral-600 mt-1">
                        Overall adherence: {analysis.overallAdherence}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {weightChange !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Weight</span>
                  <span className="font-medium text-neutral-900">
                    {weightChange > 0 ? '↑' : '↓'} {Math.abs(weightChange).toFixed(1)}{' '}
                    {profile.bodySpecs.measurementSystem === 'metric' ? 'kg' : 'lbs'} (30 days)
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Consistency</span>
                <span className="font-medium text-neutral-900">{consistency}%</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/adherence-analysis')}
                className="w-full"
              >
                View Analysis
              </Button>
            </CardContent>
          </Card>

          {/* HISTORY Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🕰 HISTORY
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Last workout</span>
                  <span className="font-medium text-neutral-900">{lastWorkout}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Last log</span>
                  <span className="font-medium text-neutral-900">{lastLog}</span>
                </div>
              </div>
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

        {/* Desktop Layout - Keep original design */}
        <div className="hidden md:block p-6">
          {/* Header with version */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">Dashboard</h1>
              <div className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
                <span>{dayOfWeek}, {today.toLocaleDateString()}</span>
                <span>·</span>
                <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full font-medium">
                  v{APP_VERSION}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
}
