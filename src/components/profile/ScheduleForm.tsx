import type { UserSchedule } from '../../types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

interface ScheduleFormProps {
  value: UserSchedule;
  onChange: (value: UserSchedule) => void;
}

export default function ScheduleForm({ value, onChange }: ScheduleFormProps) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  const handleDayToggle = (day: typeof days[number]) => {
    const isCurrentlyAvailable = value.trainingDays[day].available;
    onChange({
      ...value,
      trainingDays: {
        ...value.trainingDays,
        [day]: {
          ...value.trainingDays[day],
          available: !isCurrentlyAvailable,
          // Set default location when enabling a day
          location: !isCurrentlyAvailable ? 'home' : value.trainingDays[day].location,
        },
      },
    });
  };

  const handleLocationChange = (day: typeof days[number], location: 'gym' | 'home' | 'outdoor') => {
    onChange({
      ...value,
      trainingDays: {
        ...value.trainingDays,
        [day]: {
          ...value.trainingDays[day],
          location,
        },
      },
    });
  };

  const handleMealTimeChange = (meal: 'breakfast' | 'lunch' | 'dinner', time: string) => {
    onChange({
      ...value,
      mealTimes: {
        ...value.mealTimes,
        [meal]: time,
      },
    });
  };

  const handleSleepScheduleChange = (field: 'bedtime' | 'wakeTime', time: string) => {
    onChange({
      ...value,
      sleepSchedule: {
        ...value.sleepSchedule,
        [field]: time,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Training Days</Label>
          <p className="text-sm text-muted-foreground">Select the days you can train</p>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200 border-2 cursor-pointer ${
                  value.trainingDays[day].available
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-sm'
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Location selection for each enabled day */}
        {days.some(day => value.trainingDays[day].available) && (
          <div className="space-y-3">
            <Label>Training Location per Day</Label>
            <p className="text-sm text-muted-foreground">Specify where you'll train on each active day</p>
            <div className="space-y-2">
              {days.map((day) => {
                if (!value.trainingDays[day].available) return null;

                const currentLocation = value.trainingDays[day].location || 'home';

                return (
                  <div key={day} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize min-w-[100px] text-gray-700">
                      {day}
                    </span>
                    <div className="flex gap-2 flex-1">
                      <button
                        type="button"
                        onClick={() => handleLocationChange(day, 'gym')}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 ${
                          currentLocation === 'gym'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        🏋️ Gym
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLocationChange(day, 'home')}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 ${
                          currentLocation === 'home'
                            ? 'bg-green-600 text-white border-green-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                        }`}
                      >
                        🏠 Home
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLocationChange(day, 'outdoor')}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 ${
                          currentLocation === 'outdoor'
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
                        }`}
                      >
                        🌳 Outdoor
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Preferred Workout Time</Label>
        <Select
          value={value.preferredWorkoutTime || 'evening'}
          onChange={(e) => onChange({ ...value, preferredWorkoutTime: e.target.value as any })}
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Meal Times</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="breakfast" className="text-sm">Breakfast</Label>
            <Input
              id="breakfast"
              type="time"
              value={value.mealTimes.breakfast || '07:00'}
              onChange={(e) => handleMealTimeChange('breakfast', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lunch" className="text-sm">Lunch</Label>
            <Input
              id="lunch"
              type="time"
              value={value.mealTimes.lunch || '12:00'}
              onChange={(e) => handleMealTimeChange('lunch', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dinner" className="text-sm">Dinner</Label>
            <Input
              id="dinner"
              type="time"
              value={value.mealTimes.dinner || '19:00'}
              onChange={(e) => handleMealTimeChange('dinner', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Sleep Schedule</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedtime" className="text-sm">Bedtime</Label>
            <Input
              id="bedtime"
              type="time"
              value={value.sleepSchedule.bedtime}
              onChange={(e) => handleSleepScheduleChange('bedtime', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wakeTime" className="text-sm">Wake Time</Label>
            <Input
              id="wakeTime"
              type="time"
              value={value.sleepSchedule.wakeTime}
              onChange={(e) => handleSleepScheduleChange('wakeTime', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
