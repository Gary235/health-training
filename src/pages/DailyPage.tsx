import { useNavigate } from 'react-router-dom';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import MealLogCard from '../components/daily/MealLogCard';
import TrainingLogCard from '../components/daily/TrainingLogCard';

export default function DailyPage() {
  const navigate = useNavigate();
  const {
    todayMeals,
    todaySessions,
    todayLog,
    loading,
    logMeal,
    logTraining,
    getMealLog,
    getTrainingLog,
  } = useDailyPlan();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-600">Loading today's plan...</p>
      </div>
    );
  }

  const hasPlan = todayMeals.length > 0 || todaySessions.length > 0;
  const adherence = todayLog?.overallAdherence || 0;

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </Button>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        {!hasPlan ? (
          <Card>
            <CardHeader>
              <CardTitle>No Plan for Today</CardTitle>
              <CardDescription>
                Generate meal and training plans to see your daily schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={() => navigate('/plans/meal/generate')}>
                Generate Meal Plan
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/plans/training/generate')}
              >
                Generate Training Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Today's Progress</CardTitle>
                <CardDescription>Track your daily adherence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-neutral-700">Overall Adherence</span>
                      <span className="text-metric-lg font-tabular text-neutral-900">{adherence}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          adherence >= 80
                            ? 'bg-success'
                            : adherence >= 50
                            ? 'bg-warning'
                            : 'bg-error'
                        }`}
                        style={{ width: `${adherence}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-metric-lg font-tabular text-neutral-900">{todayMeals.length}</div>
                      <div className="text-sm text-neutral-500">Meals</div>
                    </div>
                    <div>
                      <div className="text-metric-lg font-tabular text-neutral-900">{todaySessions.length}</div>
                      <div className="text-sm text-neutral-500">Workouts</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {todayMeals.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-neutral-800">Today's Meals</h2>
                  {todayMeals.length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/shopping-list')}
                    >
                      Shopping List
                    </Button>
                  )}
                </div>
                {todayMeals.map((meal) => (
                  <MealLogCard
                    key={meal.id}
                    meal={meal}
                    existingLog={getMealLog(meal.id)}
                    onLog={logMeal}
                  />
                ))}
              </div>
            )}

            {todaySessions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-neutral-800">Today's Workouts</h2>
                {todaySessions.map((session) => (
                  <TrainingLogCard
                    key={session.id}
                    session={session}
                    existingLog={getTrainingLog(session.id)}
                    onLog={logTraining}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
