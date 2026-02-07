import type { Exercise } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface ExerciseCardProps {
  exercise: Exercise;
  showDetails?: boolean;
}

export default function ExerciseCard({ exercise, showDetails = true }: ExerciseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{exercise.name}</CardTitle>
            <CardDescription className="capitalize">
              {exercise.type} • {exercise.intensity} intensity
            </CardDescription>
          </div>
          {exercise.sets && exercise.reps && (
            <div className="text-right text-sm font-semibold font-tabular text-neutral-900">
              {exercise.sets} × {exercise.reps}
            </div>
          )}
          {exercise.duration && (
            <div className="text-right text-sm font-semibold font-tabular text-neutral-900">
              {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="space-y-3">
          <p className="text-sm text-neutral-700">{exercise.description}</p>

          <div className="flex flex-wrap gap-2">
            {exercise.muscleGroups.map((muscle, index) => (
              <span key={index} className="px-2 py-1 bg-neutral-100 rounded-full text-xs capitalize text-neutral-700">
                {muscle}
              </span>
            ))}
          </div>

          {exercise.equipment.length > 0 && (
            <div className="text-sm text-neutral-700">
              <strong className="text-neutral-800">Equipment:</strong> {exercise.equipment.join(', ')}
            </div>
          )}

          {exercise.instructions.length > 0 && (
            <div>
              <h5 className="font-semibold text-sm text-neutral-800 mb-2">How to perform:</h5>
              <ol className="text-sm space-y-1 list-decimal list-inside text-neutral-700">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="flex gap-4 text-sm text-neutral-600 pt-2 border-t border-neutral-200 font-tabular">
            {exercise.sets && <span>Sets: {exercise.sets}</span>}
            {exercise.reps && <span>Reps: {exercise.reps}</span>}
            {exercise.restBetweenSets && <span>Rest: {exercise.restBetweenSets}s</span>}
          </div>

          {exercise.notes && (
            <p className="text-sm text-neutral-600 italic">{exercise.notes}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
