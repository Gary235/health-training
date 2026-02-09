import { useState } from 'react';
import type { TrainingSession, TrainingLog, AdherenceLevel, DeviationReason, ExerciseLog, ExerciseDifficulty, Exercise } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface TrainingLogCardProps {
  session: TrainingSession;
  existingLog?: TrainingLog;
  onLog: (log: TrainingLog) => void;
}

export default function TrainingLogCard({ session, existingLog, onLog }: TrainingLogCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [adherence, setAdherence] = useState<AdherenceLevel>(existingLog?.adherence || 'full');
  const [startTime, setStartTime] = useState(existingLog?.startTime || '');
  const [endTime, setEndTime] = useState(existingLog?.endTime || '');
  const [deviationReason, setDeviationReason] = useState<DeviationReason>('other');
  const [deviationDescription, setDeviationDescription] = useState('');
  const [perceivedExertion, setPerceivedExertion] = useState<number>(5);

  // Initialize difficulty state for all exercises
  const initializeDifficulties = () => {
    const difficulties: { [key: string]: ExerciseDifficulty } = {};
    if (existingLog) {
      existingLog.exercises.forEach((log) => {
        difficulties[log.exerciseId] = log.difficulty || 'possible';
      });
    } else {
      session.exercises.forEach((exercise) => {
        difficulties[exercise.id] = 'possible';
      });
    }
    return difficulties;
  };

  const [exerciseDifficulties, setExerciseDifficulties] = useState<{ [key: string]: ExerciseDifficulty }>(initializeDifficulties);

  const handleLog = () => {
    const exerciseLogs: ExerciseLog[] = session.exercises.map((exercise) => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      completed: exerciseDifficulties[exercise.id] !== 'could_not_do',
      difficulty: exerciseDifficulties[exercise.id],
      perceivedIntensity: 3,
    }));

    const log: TrainingLog = {
      sessionId: session.id,
      sessionName: session.name,
      scheduledTime: session.scheduledTime,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      completed: adherence !== 'skipped',
      adherence,
      exercises: exerciseLogs,
      perceivedExertion: perceivedExertion as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
      deviations:
        adherence !== 'full'
          ? [
              {
                reason: deviationReason,
                description: deviationDescription || undefined,
                impact: adherence === 'skipped' ? 'significant' : 'moderate',
              },
            ]
          : undefined,
    };

    onLog(log);
    setShowDetails(false);
    toast.success('Training session logged successfully!');
  };

  const setExerciseDifficulty = (exerciseId: string, difficulty: ExerciseDifficulty) => {
    setExerciseDifficulties((prev) => ({
      ...prev,
      [exerciseId]: difficulty,
    }));
  };

  const getDifficultyColor = (difficulty: ExerciseDifficulty) => {
    switch (difficulty) {
      case 'possible':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'difficult':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'could_not_do':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-neutral-200 hover:bg-neutral-300';
    }
  };

  const isLogged = !!existingLog;
  const adherenceColor =
    existingLog?.adherence === 'full'
      ? 'bg-green-500/10 text-green-700'
      : existingLog?.adherence === 'partial'
      ? 'bg-yellow-500/10 text-yellow-700'
      : existingLog?.adherence === 'skipped'
      ? 'bg-red-500/10 text-red-700'
      : '';

  return (
    <Card className={isLogged ? adherenceColor : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{session.name}</CardTitle>
            <CardDescription className="capitalize">
              {session.type} • {session.duration} min
            </CardDescription>
          </div>
          <div className="text-right text-sm">
            {session.scheduledTime && <div>{session.scheduledTime}</div>}
            {isLogged && (
              <div className="text-xs mt-1 capitalize">{existingLog.adherence}</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!showDetails && (
          <div className="text-sm text-muted-foreground">
            {session.exercises.length} exercises
          </div>
        )}

        {!showDetails && (
          <div className="flex gap-2">
            {!isLogged ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAdherence('full');
                    handleLog();
                  }}
                  className="flex-1"
                >
                  ✓ Completed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDetails(true)}
                  className="flex-1"
                >
                  More Options
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDetails(true)}
                className="w-full"
              >
                Edit Log
              </Button>
            )}
          </div>
        )}

        {showDetails && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label>Adherence</Label>
              <Select
                value={adherence}
                onChange={(e) => setAdherence(e.target.value as AdherenceLevel)}
              >
                <option value="full">Completed as planned</option>
                <option value="partial">Partially completed</option>
                <option value="skipped">Skipped</option>
              </Select>
            </div>

            {adherence !== 'skipped' && (
              <div className="space-y-3">
                <Label>Exercises - Rate Difficulty</Label>
                <div className="space-y-2">
                  {session.exercises.map((exercise: Exercise) => (
                    <div key={exercise.id} className="border rounded-lg p-3 space-y-2">
                      <div className="text-sm font-medium text-neutral-900">{exercise.name}</div>
                      <div className="text-xs text-neutral-600">
                        {exercise.sets && exercise.reps && `${exercise.sets} sets × ${exercise.reps} reps`}
                        {exercise.duration && `${Math.floor(exercise.duration / 60)} min`}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className={`flex-1 ${
                            exerciseDifficulties[exercise.id] === 'possible'
                              ? getDifficultyColor('possible')
                              : ''
                          }`}
                          onClick={() => setExerciseDifficulty(exercise.id, 'possible')}
                        >
                          ✓ Possible
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`flex-1 ${
                            exerciseDifficulties[exercise.id] === 'difficult'
                              ? getDifficultyColor('difficult')
                              : ''
                          }`}
                          onClick={() => setExerciseDifficulty(exercise.id, 'difficult')}
                        >
                          ⚠ Difficult
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`flex-1 ${
                            exerciseDifficulties[exercise.id] === 'could_not_do'
                              ? getDifficultyColor('could_not_do')
                              : ''
                          }`}
                          onClick={() => setExerciseDifficulty(exercise.id, 'could_not_do')}
                        >
                          ✗ Could Not Do
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            {adherence !== 'skipped' && (
              <div className="space-y-2">
                <Label htmlFor="exertion">Perceived Exertion (1-10)</Label>
                <Select
                  id="exertion"
                  value={perceivedExertion.toString()}
                  onChange={(e) => setPerceivedExertion(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <option key={level} value={level}>
                      {level} - {level <= 3 ? 'Easy' : level <= 6 ? 'Moderate' : level <= 8 ? 'Hard' : 'Maximum'}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {adherence !== 'full' && (
              <>
                <div className="space-y-2">
                  <Label>Reason for deviation</Label>
                  <Select
                    value={deviationReason}
                    onChange={(e) => setDeviationReason(e.target.value as DeviationReason)}
                  >
                    <option value="too_tired">Too tired</option>
                    <option value="injury">Injury</option>
                    <option value="illness">Illness</option>
                    <option value="schedule_conflict">Schedule conflict</option>
                    <option value="lack_of_motivation">Lack of motivation</option>
                    <option value="equipment_unavailable">Equipment unavailable</option>
                    <option value="other">Other</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional notes</Label>
                  <Input
                    id="description"
                    placeholder="Describe what happened..."
                    value={deviationDescription}
                    onChange={(e) => setDeviationDescription(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button size="sm" onClick={handleLog} className="flex-1">
                Save Log
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDetails(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
