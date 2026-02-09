import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { loadActiveTrainingPlan } from '../features/plans/plansSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import TrainingSessionCard from '../components/plans/TrainingSessionCard';
import LoadingOverlay from '../components/common/LoadingOverlay';
import type { TrainingSession } from '../types';

export default function TrainingPlanPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeTrainingPlan, loading } = useAppSelector((state) => state.plans);
  const profile = useAppSelector((state) => state.user.profile);

  useEffect(() => {
    if (profile) {
      dispatch(loadActiveTrainingPlan(profile.id));
    }
  }, [dispatch, profile]);

  if (loading) {
    return <LoadingOverlay show={true} text="Loading training plan..." />;
  }

  if (!activeTrainingPlan) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Active Training Plan</CardTitle>
            <CardDescription>Generate a training plan to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/plans/training/generate')} className="w-full">
              Generate Training Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter sessions for today only
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySessions = activeTrainingPlan.sessions.filter((session: TrainingSession) => {
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </Button>
          <Button onClick={() => navigate('/plans/training/generate')}>
            Generate New Plan
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{activeTrainingPlan.name}</CardTitle>
            <CardDescription>
              Training for {today.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTrainingPlan.focusAreas && activeTrainingPlan.focusAreas.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-neutral-800">Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {activeTrainingPlan.focusAreas.map((area: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm capitalize">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">Today's Training Sessions</h2>
          {todaySessions.length > 0 ? (
            todaySessions.map((session: TrainingSession) => (
              <TrainingSessionCard key={session.id} session={session} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-neutral-600">
                No training sessions scheduled for today. Rest day!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
