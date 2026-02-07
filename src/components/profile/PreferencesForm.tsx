import { useState } from 'react';
import type { UserPreferences } from '../../types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';

interface PreferencesFormProps {
  value: UserPreferences;
  onChange: (value: UserPreferences) => void;
}

export default function PreferencesForm({ value, onChange }: PreferencesFormProps) {
  const [newFoodLike, setNewFoodLike] = useState('');
  const [newFoodDislike, setNewFoodDislike] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newEquipment, setNewEquipment] = useState('');

  const handleArrayAdd = (field: keyof UserPreferences, item: string, setter: (v: string) => void) => {
    if (item.trim()) {
      const currentArray = (value[field] as string[]) || [];
      onChange({ ...value, [field]: [...currentArray, item.trim()] });
      setter('');
    }
  };

  const handleArrayRemove = (field: keyof UserPreferences, index: number) => {
    const currentArray = (value[field] as string[]) || [];
    onChange({ ...value, [field]: currentArray.filter((_, i) => i !== index) });
  };

  const handleRestrictionToggle = (restriction: string) => {
    const current = value.dietaryRestrictions || [];
    if (current.includes(restriction as any)) {
      onChange({ ...value, dietaryRestrictions: current.filter(r => r !== restriction) });
    } else {
      onChange({ ...value, dietaryRestrictions: [...current, restriction as any] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Dietary Restrictions</Label>
        <div className="flex flex-wrap gap-2">
          {['vegetarian', 'vegan', 'pescatarian', 'halal', 'kosher', 'gluten_free', 'dairy_free', 'nut_free'].map(restriction => (
            <button
              key={restriction}
              type="button"
              onClick={() => handleRestrictionToggle(restriction)}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                value.dietaryRestrictions?.includes(restriction as any)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {restriction.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies</Label>
        <div className="flex gap-2">
          <Input
            id="allergies"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            placeholder="Add an allergy"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('allergies', newAllergy, setNewAllergy))}
          />
          <Button type="button" size="sm" onClick={() => handleArrayAdd('allergies', newAllergy, setNewAllergy)}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {value.allergies?.map((allergy, i) => (
            <span key={i} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm flex items-center gap-2">
              {allergy}
              <button type="button" onClick={() => handleArrayRemove('allergies', i)} className="hover:text-destructive-foreground cursor-pointer">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="likes">Foods You Like</Label>
        <div className="flex gap-2">
          <Input
            id="likes"
            value={newFoodLike}
            onChange={(e) => setNewFoodLike(e.target.value)}
            placeholder="Add a food you like"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('foodLikes', newFoodLike, setNewFoodLike))}
          />
          <Button type="button" size="sm" onClick={() => handleArrayAdd('foodLikes', newFoodLike, setNewFoodLike)}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {value.foodLikes?.map((food, i) => (
            <span key={i} className="px-3 py-1 bg-secondary rounded-full text-sm flex items-center gap-2">
              {food}
              <button type="button" onClick={() => handleArrayRemove('foodLikes', i)} className="cursor-pointer">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dislikes">Foods You Dislike</Label>
        <div className="flex gap-2">
          <Input
            id="dislikes"
            value={newFoodDislike}
            onChange={(e) => setNewFoodDislike(e.target.value)}
            placeholder="Add a food you dislike"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('foodDislikes', newFoodDislike, setNewFoodDislike))}
          />
          <Button type="button" size="sm" onClick={() => handleArrayAdd('foodDislikes', newFoodDislike, setNewFoodDislike)}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {value.foodDislikes?.map((food, i) => (
            <span key={i} className="px-3 py-1 bg-secondary rounded-full text-sm flex items-center gap-2">
              {food}
              <button type="button" onClick={() => handleArrayRemove('foodDislikes', i)} className="cursor-pointer">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workoutLocation">Workout Location</Label>
        <Select
          id="workoutLocation"
          value={value.workoutLocation}
          onChange={(e) => onChange({ ...value, workoutLocation: e.target.value as any })}
        >
          <option value="home">Home</option>
          <option value="gym">Gym</option>
          <option value="outdoor">Outdoor</option>
          <option value="mixed">Mixed</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="equipment">Available Equipment</Label>
        <div className="flex gap-2">
          <Input
            id="equipment"
            value={newEquipment}
            onChange={(e) => setNewEquipment(e.target.value)}
            placeholder="Add equipment (e.g., dumbbells)"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('equipmentAvailable', newEquipment, setNewEquipment))}
          />
          <Button type="button" size="sm" onClick={() => handleArrayAdd('equipmentAvailable', newEquipment, setNewEquipment)}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {value.equipmentAvailable?.map((equipment, i) => (
            <span key={i} className="px-3 py-1 bg-secondary rounded-full text-sm flex items-center gap-2">
              {equipment}
              <button type="button" onClick={() => handleArrayRemove('equipmentAvailable', i)} className="cursor-pointer">×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
