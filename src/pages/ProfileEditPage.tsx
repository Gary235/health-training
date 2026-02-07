import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { updateUserProfile } from '../features/user/userSlice';
import BodySpecsForm from '../components/profile/BodySpecsForm';
import PreferencesForm from '../components/profile/PreferencesForm';
import ScheduleForm from '../components/profile/ScheduleForm';
import GoalsForm from '../components/profile/GoalsForm';
import type { BodySpecifications, UserPreferences, UserSchedule, UserGoals } from '../types';
import { toast } from 'sonner';

type EditStep = 'body' | 'preferences' | 'schedule' | 'goals';

export const ProfileEditPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const [currentStep, setCurrentStep] = useState<EditStep>('body');
  const [loading, setLoading] = useState(false);

  // Initialize state with existing profile data
  const [bodySpecs, setBodySpecs] = useState<BodySpecifications>({
    height: 170,
    weight: 70,
    age: 30,
    gender: 'male',
    fitnessLevel: 'beginner',
    activityLevel: 'moderately_active',
    measurementSystem: 'metric',
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    allergies: [],
    foodLikes: [],
    foodDislikes: [],
    cuisinePreferences: [],
    equipmentAvailable: [],
    workoutLocation: 'home',
  });

  const [schedule, setSchedule] = useState<UserSchedule>({
    trainingDays: {
      monday: { available: true },
      tuesday: { available: true },
      wednesday: { available: true },
      thursday: { available: true },
      friday: { available: true },
      saturday: { available: false },
      sunday: { available: false },
    },
    mealTimes: {
      breakfast: '07:00',
      lunch: '12:00',
      dinner: '19:00',
    },
    sleepSchedule: {
      bedtime: '22:00',
      wakeTime: '06:00',
    },
    preferredWorkoutTime: 'evening',
  });

  const [goals, setGoals] = useState<UserGoals>({
    primary: 'maintenance',
  });

  // Load existing profile data on mount
  useEffect(() => {
    if (!profile) {
      navigate('/onboarding');
      return;
    }

    setBodySpecs(profile.bodySpecs);
    setPreferences(profile.preferences);
    setSchedule(profile.schedule);
    setGoals(profile.goals);
  }, []); // Only run on mount

  const steps: EditStep[] = ['body', 'preferences', 'schedule', 'goals'];
  const currentStepIndex = steps.indexOf(currentStep);

  const stepTitles = {
    body: 'Body Specifications',
    preferences: 'Preferences',
    schedule: 'Schedule',
    goals: 'Goals',
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      await dispatch(updateUserProfile({
        userId: profile.id,
        updates: {
          bodySpecs,
          preferences,
          schedule,
          goals,
          updatedAt: new Date(),
        },
      })).unwrap();

      toast.success('Profile updated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return null;
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'body':
        return <BodySpecsForm value={bodySpecs} onChange={setBodySpecs} />;
      case 'preferences':
        return <PreferencesForm value={preferences} onChange={setPreferences} />;
      case 'schedule':
        return <ScheduleForm value={schedule} onChange={setSchedule} />;
      case 'goals':
        return <GoalsForm value={goals} onChange={setGoals} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-neutral-300">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-neutral-900">Edit Profile</h1>
            <button
              onClick={handleCancel}
              className="text-neutral-600 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      index <= currentStepIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1 text-neutral-600 hidden sm:block text-center">
                    {stepTitles[step]}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-colors ${
                      index < currentStepIndex ? 'bg-blue-600' : 'bg-neutral-100 border border-neutral-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-neutral-300">
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors border cursor-pointer ${
                currentStepIndex === 0
                  ? 'bg-neutral-100 text-neutral-600 border-neutral-300 cursor-not-allowed'
                  : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
              }`}
            >
              Back
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg font-semibold bg-neutral-100 text-neutral-700 border border-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {currentStepIndex === steps.length - 1 ? (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-green-600 cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors border border-blue-600 cursor-pointer"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-800 mb-6">
            {stepTitles[currentStep]}
          </h2>

          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};
