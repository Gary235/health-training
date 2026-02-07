import type { BodySpecifications } from '../../types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

interface BodySpecsFormProps {
  value: BodySpecifications;
  onChange: (value: BodySpecifications) => void;
}

export default function BodySpecsForm({ value, onChange }: BodySpecsFormProps) {
  const handleChange = (field: keyof BodySpecifications, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="measurementSystem">Measurement System</Label>
          <Select
            id="measurementSystem"
            value={value.measurementSystem}
            onChange={(e) => handleChange('measurementSystem', e.target.value)}
          >
            <option value="metric">Metric (cm, kg)</option>
            <option value="imperial">Imperial (in, lbs)</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={value.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value))}
            min="10"
            max="120"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">
            Height ({value.measurementSystem === 'metric' ? 'cm' : 'inches'})
          </Label>
          <Input
            id="height"
            type="number"
            value={value.height}
            onChange={(e) => handleChange('height', parseFloat(e.target.value))}
            step="0.1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">
            Weight ({value.measurementSystem === 'metric' ? 'kg' : 'lbs'})
          </Label>
          <Input
            id="weight"
            type="number"
            value={value.weight}
            onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
            step="0.1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          id="gender"
          value={value.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fitnessLevel">Fitness Level</Label>
        <Select
          id="fitnessLevel"
          value={value.fitnessLevel}
          onChange={(e) => handleChange('fitnessLevel', e.target.value)}
        >
          <option value="beginner">Beginner - New to fitness</option>
          <option value="intermediate">Intermediate - Regular exercise</option>
          <option value="advanced">Advanced - Experienced athlete</option>
          <option value="athlete">Athlete - Competitive level</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="activityLevel">Activity Level</Label>
        <Select
          id="activityLevel"
          value={value.activityLevel}
          onChange={(e) => handleChange('activityLevel', e.target.value)}
        >
          <option value="sedentary">Sedentary - Little to no exercise</option>
          <option value="lightly_active">Lightly Active - Light exercise 1-3 days/week</option>
          <option value="moderately_active">Moderately Active - Moderate exercise 3-5 days/week</option>
          <option value="very_active">Very Active - Hard exercise 6-7 days/week</option>
          <option value="extremely_active">Extremely Active - Very hard exercise & physical job</option>
        </Select>
      </div>
    </div>
  );
}
