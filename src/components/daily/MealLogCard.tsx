import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Meal, MealLog, AdherenceLevel, DeviationReason } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface MealLogCardProps {
  meal: Meal;
  existingLog?: MealLog;
  onLog: (log: MealLog) => void;
  mealDate?: Date; // The date this meal is scheduled for
}

export default function MealLogCard({ meal, existingLog, onLog, mealDate }: MealLogCardProps) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [adherence, setAdherence] = useState<AdherenceLevel>(existingLog?.adherence || 'full');
  const [actualTime, setActualTime] = useState(existingLog?.actualTime || '');
  const [deviationReason, setDeviationReason] = useState<DeviationReason>('other');
  const [deviationDescription, setDeviationDescription] = useState('');
  const [portionScale, setPortionScale] = useState(existingLog?.portionScale || 1);

  const handleMealClick = () => {
    navigate('/plans/meal', {
      state: {
        selectedDate: mealDate || new Date(),
        highlightMealId: meal.id,
      },
    });
  };

  const handleLog = () => {
    const log: MealLog = {
      mealId: meal.id,
      mealType: meal.type,
      scheduledTime: meal.scheduledTime,
      actualTime: actualTime || undefined,
      completed: adherence !== 'skipped',
      adherence,
      portionScale,
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
    toast.success(`${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} logged successfully!`);
  };

  const isLogged = !!existingLog;
  const adherenceColor =
    existingLog?.adherence === 'full'
      ? 'bg-success-bg border-success-border'
      : existingLog?.adherence === 'partial'
      ? 'bg-warning-bg border-warning-border'
      : existingLog?.adherence === 'skipped'
      ? 'bg-error-bg border-error-border'
      : '';

  return (
    <Card className={isLogged ? adherenceColor : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-md capitalize">{meal.type}</CardTitle>
            <CardDescription
              onClick={handleMealClick}
              className="cursor-pointer hover:text-primary hover:underline transition-colors"
            >
              {meal.recipe.name} • {meal.scheduledTime}
            </CardDescription>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold font-tabular text-neutral-900">{meal.recipe.nutrition.calories} cal</div>
            {isLogged && (
              <div className="text-xs mt-1 capitalize text-neutral-600">{existingLog.adherence}</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!showDetails && (
          <div className="flex gap-2">
            {!isLogged ? (
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    setAdherence('full');
                    handleLog();
                  }}
                  className="flex-1"
                >
                  Completed
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowDetails(true)}
                  className="flex-1"
                >
                  More Options
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="secondary"
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

            <div className="space-y-2">
              <Label htmlFor="actualTime">Actual Time (optional)</Label>
              <Input
                id="actualTime"
                type="time"
                value={actualTime}
                onChange={(e) => setActualTime(e.target.value)}
              />
            </div>

            {adherence !== 'full' && (
              <>
                <div className="space-y-2">
                  <Label>Reason for deviation</Label>
                  <Select
                    value={deviationReason}
                    onChange={(e) => setDeviationReason(e.target.value as DeviationReason)}
                  >
                    <option value="time_constraint">Time constraint</option>
                    <option value="not_hungry">Not hungry</option>
                    <option value="food_unavailable">Food unavailable</option>
                    <option value="didnt_like">Didn't like the meal</option>
                    <option value="schedule_conflict">Schedule conflict</option>
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

            {adherence === 'partial' && (
              <div className="space-y-2">
                <Label htmlFor="portion">Portion size</Label>
                <Select
                  id="portion"
                  value={portionScale.toString()}
                  onChange={(e) => setPortionScale(parseFloat(e.target.value))}
                >
                  <option value="0.25">Quarter (25%)</option>
                  <option value="0.5">Half (50%)</option>
                  <option value="0.75">Three-quarters (75%)</option>
                  <option value="1">Full (100%)</option>
                  <option value="1.25">More than planned (125%)</option>
                  <option value="1.5">Much more (150%)</option>
                </Select>
              </div>
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
