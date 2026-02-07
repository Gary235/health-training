import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import type { DailyLog } from '../types';
import {
  User,
  MapPin,
  Calendar,
  Settings,
  TrendingUp,
  Target,
  Activity,
  Flame,
  Award,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user.profile);
  const { activeMealPlan, activeTrainingPlan } = useAppSelector((state) => state.plans);
  const { logs } = useAppSelector((state) => state.logs);

  if (!profile) {
    navigate('/onboarding');
    return null;
  }

  // Calculate some profile stats
  const totalLogs = logs.length;
  const recentLogs = logs.slice(-7);
  const avgAdherence = recentLogs.length > 0
    ? Math.round(recentLogs.reduce((sum: number, log: DailyLog) => sum + log.overallAdherence, 0) / recentLogs.length)
    : 0;

  const joinDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  const activityLevel = profile.bodySpecs.activityLevel
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Cover Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 w-full">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-20 relative">
        {/* Profile Header Card */}
        <Card className="mb-6 relative z-10 overflow-visible">
          <CardContent className="p-6 pt-20 md:pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="flex-shrink-0 absolute left-1/2 -translate-x-1/2 -top-16 md:static md:translate-x-0 md:-mt-20">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-lg">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-16 h-16 md:w-20 md:h-20 text-white" />
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4 mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                      Health Enthusiast
                    </h1>
                    <p className="text-neutral-600 mt-1">
                      {profile.bodySpecs.age} years • {profile.bodySpecs.gender.charAt(0).toUpperCase() + profile.bodySpecs.gender.slice(1)}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/profile/edit')}
                    className="w-full md:w-auto"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-neutral-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">{totalLogs}</div>
                    <div className="text-sm text-neutral-600">Days Logged</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">{avgAdherence}%</div>
                    <div className="text-sm text-neutral-600">Avg Adherence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">
                      {(activeMealPlan ? 1 : 0) + (activeTrainingPlan ? 1 : 0)}
                    </div>
                    <div className="text-sm text-neutral-600">Active Plans</div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4" />
                    <span className="capitalize">{profile.goals.primary.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>{activityLevel}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
          {/* Left Column - About */}
          <div className="md:col-span-1 space-y-6">
            {/* Body Stats Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Body Stats
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Height</span>
                    <span className="font-medium text-neutral-900">
                      {profile.bodySpecs.height} {profile.bodySpecs.measurementSystem === 'metric' ? 'cm' : 'in'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Weight</span>
                    <span className="font-medium text-neutral-900">
                      {profile.bodySpecs.weight} {profile.bodySpecs.measurementSystem === 'metric' ? 'kg' : 'lbs'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Fitness Level</span>
                    <span className="font-medium text-neutral-900 capitalize">
                      {profile.bodySpecs.fitnessLevel}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-600">System</span>
                    <span className="font-medium text-neutral-900 capitalize">
                      {profile.bodySpecs.measurementSystem}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Preferences
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-neutral-600 block mb-1">Workout Location</span>
                    <span className="font-medium text-neutral-900 capitalize">
                      {profile.preferences.workoutLocation}
                    </span>
                  </div>
                  {profile.preferences.equipmentAvailable.length > 0 && (
                    <div>
                      <span className="text-neutral-600 block mb-2">Equipment</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.preferences.equipmentAvailable.slice(0, 4).map((equipment: string) => (
                          <span
                            key={equipment}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs capitalize"
                          >
                            {equipment.replace('_', ' ')}
                          </span>
                        ))}
                        {profile.preferences.equipmentAvailable.length > 4 && (
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs">
                            +{profile.preferences.equipmentAvailable.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {profile.preferences.dietaryRestrictions.length > 0 && (
                    <div>
                      <span className="text-neutral-600 block mb-2">Dietary</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.preferences.dietaryRestrictions.map((restriction: string) => (
                          <span
                            key={restriction}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs capitalize"
                          >
                            {restriction.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-neutral-600" />
                  Settings
                </h2>
                <Button
                  onClick={() => navigate('/settings')}
                  variant="secondary"
                  className="w-full"
                >
                  App Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Plans */}
          <div className="md:col-span-2 space-y-6">
            {/* Achievement Highlights */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Highlights
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-orange-900">{recentLogs.length}</div>
                      <div className="text-xs text-orange-700">Day Streak</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-900">{avgAdherence}%</div>
                      <div className="text-xs text-green-700">Adherence</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  My Schedule
                </h2>
                <div className="space-y-4">
                  {/* Training Days */}
                  <div>
                    <span className="text-sm text-neutral-600 block mb-2">Training Days</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(profile.schedule.trainingDays).map(([day, config]: [string, { available: boolean }]) => (
                        <div
                          key={day}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            config.available
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                          }`}
                        >
                          {day.slice(0, 3).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meal Times */}
                  <div>
                    <span className="text-sm text-neutral-600 block mb-2">Meal Times</span>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="text-amber-700 font-medium">Breakfast</div>
                        <div className="text-amber-900 font-mono">{profile.schedule.mealTimes.breakfast}</div>
                      </div>
                      <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-orange-700 font-medium">Lunch</div>
                        <div className="text-orange-900 font-mono">{profile.schedule.mealTimes.lunch}</div>
                      </div>
                      <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-red-700 font-medium">Dinner</div>
                        <div className="text-red-900 font-mono">{profile.schedule.mealTimes.dinner}</div>
                      </div>
                    </div>
                  </div>

                  {/* Sleep Schedule */}
                  <div>
                    <span className="text-sm text-neutral-600 block mb-2">Sleep Schedule</span>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="text-indigo-700 font-medium">Bedtime</div>
                        <div className="text-indigo-900 font-mono">{profile.schedule.sleepSchedule.bedtime}</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-purple-700 font-medium">Wake Time</div>
                        <div className="text-purple-900 font-mono">{profile.schedule.sleepSchedule.wakeTime}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Plans */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  Active Plans
                </h2>
                <div className="space-y-3">
                  {activeMealPlan && (
                    <div
                      onClick={() => navigate('/plans/meal')}
                      className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                          <span className="text-xl">🍽️</span>
                        </div>
                        <div>
                          <div className="font-medium text-amber-900">{activeMealPlan.name}</div>
                          <div className="text-sm text-amber-700">
                            {activeMealPlan.dailyPlans.length} days • Started {new Date(activeMealPlan.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  )}
                  {activeTrainingPlan && (
                    <div
                      onClick={() => navigate('/plans/training')}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-xl">💪</span>
                        </div>
                        <div>
                          <div className="font-medium text-blue-900">{activeTrainingPlan.name}</div>
                          <div className="text-sm text-blue-700">
                            {activeTrainingPlan.sessions.length} sessions • Started {new Date(activeTrainingPlan.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  )}
                  {!activeMealPlan && !activeTrainingPlan && (
                    <p className="text-sm text-neutral-600 text-center py-4">
                      No active plans. Start by generating a meal or training plan!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
