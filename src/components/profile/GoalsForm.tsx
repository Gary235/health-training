import { useState } from 'react';
import type { UserGoals } from '../../types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';

interface GoalsFormProps {
  value: UserGoals;
  onChange: (value: UserGoals) => void;
  measurementSystem?: 'metric' | 'imperial';
}

export default function GoalsForm({ value, onChange, measurementSystem = 'metric' }: GoalsFormProps) {
  const [newSpecificGoal, setNewSpecificGoal] = useState('');

  const handleArrayAdd = (item: string) => {
    if (item.trim()) {
      onChange({ ...value, specificGoals: [...(value.specificGoals || []), item.trim()] });
      setNewSpecificGoal('');
    }
  };

  const handleArrayRemove = (index: number) => {
    onChange({ ...value, specificGoals: value.specificGoals?.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="primaryGoal">Primary Goal</Label>
        <Select
          id="primaryGoal"
          value={value.primary}
          onChange={(e) => onChange({ ...value, primary: e.target.value as any })}
        >
          <option value="weight_loss">Weight Loss</option>
          <option value="weight_gain">Weight Gain</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="maintenance">Maintenance</option>
          <option value="endurance">Endurance</option>
          <option value="strength">Strength</option>
          <option value="flexibility">Flexibility</option>
        </Select>
      </div>

      {(value.primary === 'weight_loss' || value.primary === 'weight_gain') && (
        <>
          <div className="space-y-2">
            <Label htmlFor="targetWeight">
              Target Weight ({measurementSystem === 'metric' ? 'kg' : 'lbs'})
            </Label>
            <Input
              id="targetWeight"
              type="number"
              value={value.targetWeight || ''}
              onChange={(e) => onChange({ ...value, targetWeight: parseFloat(e.target.value) || undefined })}
              step="0.1"
              placeholder="Enter your target weight"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeklyChange">
              Weekly Target ({measurementSystem === 'metric' ? 'kg' : 'lbs'}/week)
            </Label>
            <Input
              id="weeklyChange"
              type="number"
              value={value.weeklyWeightChangeGoal || ''}
              onChange={(e) => onChange({ ...value, weeklyWeightChangeGoal: parseFloat(e.target.value) || undefined })}
              step="0.1"
              placeholder="e.g., 0.5"
            />
            <p className="text-sm text-muted-foreground">
              Recommended: {value.primary === 'weight_loss' ? '0.5-1' : '0.25-0.5'} {measurementSystem === 'metric' ? 'kg' : 'lbs'}/week
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date (Optional)</Label>
            <Input
              id="targetDate"
              type="date"
              value={value.targetDate ? new Date(value.targetDate).toISOString().split('T')[0] : ''}
              onChange={(e) => onChange({ ...value, targetDate: e.target.value ? new Date(e.target.value) : undefined })}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="specificGoals">Specific Goals</Label>
        <p className="text-sm text-muted-foreground">
          Add specific goals like "run a 5k" or "bench press 100kg"
        </p>
        <div className="flex gap-2">
          <Input
            id="specificGoals"
            value={newSpecificGoal}
            onChange={(e) => setNewSpecificGoal(e.target.value)}
            placeholder="Add a specific goal"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd(newSpecificGoal))}
          />
          <Button type="button" size="sm" onClick={() => handleArrayAdd(newSpecificGoal)}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {value.specificGoals?.map((goal, i) => (
            <span key={i} className="px-3 py-1 bg-secondary rounded-full text-sm flex items-center gap-2">
              {goal}
              <button type="button" onClick={() => handleArrayRemove(i)} className="cursor-pointer">×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
