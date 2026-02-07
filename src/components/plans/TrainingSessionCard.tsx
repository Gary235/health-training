import type { TrainingSession } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Clock, Dumbbell } from 'lucide-react';
import ExerciseCard from './ExerciseCard';

interface TrainingSessionCardProps {
  session: TrainingSession;
  showExercises?: boolean;
}

export default function TrainingSessionCard({ session, showExercises = true }: TrainingSessionCardProps) {
  const totalExercises = session.exercises.length +
    (session.warmup?.length || 0) +
    (session.cooldown?.length || 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-md">{session.name}</CardTitle>
            <CardDescription className="capitalize">
              {session.type} • {session.targetIntensity} intensity
            </CardDescription>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold font-tabular text-neutral-900">{session.duration} min</div>
            {session.estimatedCalories && (
              <div className="text-xs text-neutral-600 font-tabular">{session.estimatedCalories} cal</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-4 text-sm text-neutral-600">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(session.date).toLocaleDateString()}
          </span>
          {session.scheduledTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {session.scheduledTime}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4" />
            {totalExercises} exercises
          </span>
        </div>

        {session.notes && (
          <p className="text-sm text-neutral-600">{session.notes}</p>
        )}

        {showExercises && (
          <div className="space-y-3">
            {session.warmup && session.warmup.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-neutral-800 mb-2">Warmup</h4>
                <div className="space-y-2">
                  {session.warmup.map((exercise) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} showDetails={false} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm text-neutral-800 mb-2">Main Exercises</h4>
              <div className="space-y-2">
                {session.exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            </div>

            {session.cooldown && session.cooldown.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-neutral-800 mb-2">Cooldown</h4>
                <div className="space-y-2">
                  {session.cooldown.map((exercise) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} showDetails={false} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
