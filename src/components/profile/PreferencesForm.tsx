import { useState, useEffect } from 'react';
import type { UserPreferences, CookingMethod, CookingPreferenceLevel, Region } from '../../types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import CookingMethodPreferenceRow from './CookingMethodPreferenceRow';
import { detectUserRegion, getAllRegions } from '../../utils/locationDetection';
import { regionalContextService } from '../../services/external/regionalContextService';

interface PreferencesFormProps {
  value: UserPreferences;
  onChange: (value: UserPreferences) => void;
}

const COOKING_METHODS: CookingMethod[] = [
  'baking',
  'frying',
  'grilling',
  'boiling',
  'steaming',
  'roasting',
  'sauteing',
  'slow_cooking',
  'pressure_cooking',
  'raw',
  'no_cook',
];

export default function PreferencesForm({ value, onChange }: PreferencesFormProps) {
  const [newFoodLike, setNewFoodLike] = useState('');
  const [newFoodDislike, setNewFoodDislike] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [detectedRegion, setDetectedRegion] = useState<Region | null>(null);

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

  // Auto-detect region on mount
  useEffect(() => {
    detectUserRegion().then(({ region }) => {
      setDetectedRegion(region);
    });
  }, []);

  // Cooking preference handlers
  const getCookingPreference = (method: CookingMethod): CookingPreferenceLevel => {
    const pref = value.cookingPreferences?.find((p) => p.method === method);
    return pref?.level || 'normal';
  };

  const handleCookingPreferenceChange = (method: CookingMethod, level: CookingPreferenceLevel) => {
    const current = value.cookingPreferences || [];
    const existing = current.find((p) => p.method === method);

    let updated;
    if (existing) {
      updated = current.map((p) => (p.method === method ? { ...p, level } : p));
    } else {
      updated = [...current, { method, level }];
    }

    onChange({ ...value, cookingPreferences: updated });
  };

  // Location handlers
  const handleRegionChange = (region: string) => {
    const location = value.location || {
      region: region as Region,
      preferLocalIngredients: true,
      culturalCuisines: [],
    };

    onChange({
      ...value,
      location: {
        ...location,
        region: region as Region,
      },
    });
  };

  const handleCountryChange = (country: string) => {
    if (!value.location) return;
    onChange({
      ...value,
      location: {
        ...value.location,
        country,
      },
    });
  };

  const handlePreferLocalIngredientsToggle = (checked: boolean) => {
    if (!value.location) return;
    onChange({
      ...value,
      location: {
        ...value.location,
        preferLocalIngredients: checked,
      },
    });
  };

  const toggleCuisine = (cuisine: string) => {
    if (!value.location) return;
    const current = value.location.culturalCuisines || [];
    const updated = current.includes(cuisine)
      ? current.filter((c) => c !== cuisine)
      : [...current, cuisine];

    onChange({
      ...value,
      location: {
        ...value.location,
        culturalCuisines: updated,
      },
    });
  };

  const handleMealTimeInstructionChange = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', instruction: string) => {
    onChange({
      ...value,
      mealTimeInstructions: {
        ...value.mealTimeInstructions,
        [mealType]: instruction.trim() || undefined,
      },
    });
  };

  const handleAutoDetectRegion = () => {
    if (detectedRegion) {
      handleRegionChange(detectedRegion);
    }
  };

  const getSuggestedCuisines = (): string[] => {
    if (!value.location?.region) return [];
    return regionalContextService.getCulturalCuisines(value.location.region);
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
              className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                value.dietaryRestrictions?.includes(restriction as any)
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {restriction.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies" >Allergies</Label>
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
        <Label htmlFor="likes" >Foods You Like</Label>
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
            <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm flex items-center gap-2">
              {food}
              <button type="button" onClick={() => handleArrayRemove('foodLikes', i)} className="cursor-pointer hover:text-neutral-900">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dislikes" >Foods You Dislike</Label>
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
            <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm flex items-center gap-2">
              {food}
              <button type="button" onClick={() => handleArrayRemove('foodDislikes', i)} className="cursor-pointer hover:text-neutral-900">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workoutLocation" >Workout Location</Label>
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
        <Label htmlFor="equipment" >Available Equipment</Label>
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
            <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm flex items-center gap-2">
              {equipment}
              <button type="button" onClick={() => handleArrayRemove('equipmentAvailable', i)} className="cursor-pointer hover:text-neutral-900">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Feature 4: Cooking Method Preferences */}
      <div className="space-y-4 border-t pt-6 mt-6">
        <div>
          <div className="text-lg font-semibold text-neutral-800">Cooking Method Preferences</div>
          <p className="text-sm text-neutral-600 mt-1 mb-2">
            Customize how often different cooking methods appear in your meal plans. Leave at "Normal" to get a balanced variety.
          </p>
          <div className="text-xs bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-900">
            <span className="font-medium">💡 Tip:</span> Select "Avoid" for methods you can't use (no oven = avoid baking),
            "Prefer" for your favorites, or leave at "Normal" for balanced variety.
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs bg-neutral-100 p-3 rounded-md border text-neutral-700">
          <span className="font-semibold mr-1">Legend:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-red-500 rounded shadow-sm"></div>
            <span>Avoid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-orange-500 rounded shadow-sm"></div>
            <span>Less</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-gray-500 rounded shadow-sm"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-blue-500 rounded shadow-sm"></div>
            <span>More</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
            <span>Prefer</span>
          </div>
        </div>

        <div className="space-y-1 border rounded-lg overflow-hidden bg-card">
          {COOKING_METHODS.map((method) => (
            <CookingMethodPreferenceRow
              key={method}
              method={method}
              preference={getCookingPreference(method)}
              onChange={handleCookingPreferenceChange}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <Label htmlFor="maxPrepTime" className="text-sm font-medium">
              Max Prep Time (optional)
            </Label>
            <Input
              id="maxPrepTime"
              type="number"
              min="0"
              value={value.maxPrepTime || ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  maxPrepTime: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="e.g., 30 minutes"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="maxCookTime" className="text-sm font-medium">
              Max Cook Time (optional)
            </Label>
            <Input
              id="maxCookTime"
              type="number"
              min="0"
              value={value.maxCookTime || ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  maxCookTime: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="e.g., 60 minutes"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Feature 5: Location & Regional Preferences */}
      <div className="space-y-4 border-t pt-6 mt-6">
        <div>
          <div className="text-lg font-semibold text-neutral-800">Location & Regional Preferences</div>
          <p className="text-sm text-neutral-600 mt-1 mb-2">
            Get meal suggestions with ingredients commonly available in your region (optional)
          </p>
          <div className="text-xs bg-green-50 border border-green-200 rounded-md p-3 text-green-900">
            <span className="font-medium">🌍 Why this helps:</span> Meals will use ingredients you can easily find at local markets
            and match familiar cooking styles from your region.
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="region" >Region</Label>
            <div className="flex gap-2">
              <Select
                id="region"
                value={value.location?.region || ''}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="flex-1"
              >
                <option value="">Select region...</option>
                {getAllRegions().map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </Select>
              {detectedRegion && !value.location?.region && (
                <Button type="button" size="sm" onClick={handleAutoDetectRegion}>
                  Auto-detect
                </Button>
              )}
            </div>
            {detectedRegion && !value.location?.region && (
              <p className="text-xs text-neutral-600 mt-1">
                Detected: {getAllRegions().find((r) => r.value === detectedRegion)?.label}
              </p>
            )}
          </div>

          {value.location?.region && (
            <>
              <div>
                <Label htmlFor="country" >Country (optional)</Label>
                <Input
                  id="country"
                  value={value.location?.country || ''}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  placeholder="e.g., United States"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preferLocal"
                  checked={value.location?.preferLocalIngredients ?? true}
                  onCheckedChange={handlePreferLocalIngredientsToggle}
                />
                <Label htmlFor="preferLocal" className="font-normal cursor-pointer">
                  Prefer locally available ingredients
                </Label>
              </div>

              <div>
                <Label >Cultural Cuisines You Enjoy (optional)</Label>
                <p className="text-xs text-neutral-600 mb-2">
                  Select cuisines popular in your region
                </p>
                <div className="flex flex-wrap gap-2">
                  {getSuggestedCuisines().map((cuisine) => {
                    const isSelected = value.location?.culturalCuisines?.includes(cuisine);
                    return (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() => toggleCuisine(cuisine)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          isSelected
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {cuisine}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Meal Time Instructions */}
      <div className="space-y-4 border-t pt-6 mt-6">
        <div>
          <div className="text-lg font-semibold text-neutral-800">Meal Time Instructions</div>
          <p className="text-sm text-neutral-600 mt-1 mb-2">
            Tell the AI how you want each meal time to be planned. These instructions will be followed every time.
          </p>
          <div className="text-xs bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-900">
            <span className="font-medium">💡 Examples:</span>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>"Same overnight oats every day for meal prep"</li>
              <li>"High protein lunches that can be eaten cold"</li>
              <li>"Different cuisines each night, family portions"</li>
              <li>"Quick grab-and-go snacks under 200 calories"</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {/* Breakfast Instructions */}
          <div>
            <Label htmlFor="breakfast-instructions" className="text-sm font-medium">
              🍳 Breakfast Instructions (optional)
            </Label>
            <textarea
              id="breakfast-instructions"
              value={value.mealTimeInstructions?.breakfast || ''}
              onChange={(e) => handleMealTimeInstructionChange('breakfast', e.target.value)}
              placeholder="e.g., Same high-protein breakfast every day, easy to prep ahead"
              className="mt-1 w-full min-h-[60px] p-2 border border-neutral-300 rounded-md"
              rows={2}
            />
          </div>

          {/* Lunch Instructions */}
          <div>
            <Label htmlFor="lunch-instructions" className="text-sm font-medium">
              🥗 Lunch Instructions (optional)
            </Label>
            <textarea
              id="lunch-instructions"
              value={value.mealTimeInstructions?.lunch || ''}
              onChange={(e) => handleMealTimeInstructionChange('lunch', e.target.value)}
              placeholder="e.g., Office-friendly meals that can be eaten cold or reheated"
              className="mt-1 w-full min-h-[60px] p-2 border border-neutral-300 rounded-md"
              rows={2}
            />
          </div>

          {/* Dinner Instructions */}
          <div>
            <Label htmlFor="dinner-instructions" className="text-sm font-medium">
              🍽️ Dinner Instructions (optional)
            </Label>
            <textarea
              id="dinner-instructions"
              value={value.mealTimeInstructions?.dinner || ''}
              onChange={(e) => handleMealTimeInstructionChange('dinner', e.target.value)}
              placeholder="e.g., Different cuisines each night, family-style servings for 4"
              className="mt-1 w-full min-h-[60px] p-2 border border-neutral-300 rounded-md"
              rows={2}
            />
          </div>

          {/* Snack Instructions */}
          <div>
            <Label htmlFor="snack-instructions" className="text-sm font-medium">
              🍎 Snack Instructions (optional)
            </Label>
            <textarea
              id="snack-instructions"
              value={value.mealTimeInstructions?.snack || ''}
              onChange={(e) => handleMealTimeInstructionChange('snack', e.target.value)}
              placeholder="e.g., Healthy grab-and-go options under 200 calories"
              className="mt-1 w-full min-h-[60px] p-2 border border-neutral-300 rounded-md"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
