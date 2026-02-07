import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../store';
import { saveUserProfile } from '../features/user/userSlice';
import type { UserProfile, BodySpecifications, UserPreferences, UserSchedule, UserGoals } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import BodySpecsForm from '../components/profile/BodySpecsForm';
import PreferencesForm from '../components/profile/PreferencesForm';
import ScheduleForm from '../components/profile/ScheduleForm';
import GoalsForm from '../components/profile/GoalsForm';

type OnboardingStep = 'body' | 'preferences' | 'schedule' | 'goals';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('body');
  const [loading, setLoading] = useState(false);

  // If user already has a profile, redirect to home
  useEffect(() => {
    if (profile) {
      console.log('[OnboardingPage] Profile exists, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [profile, navigate]);

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

  const steps: OnboardingStep[] = ['body', 'preferences', 'schedule', 'goals'];
  const currentStepIndex = steps.indexOf(currentStep);

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

  const handleComplete = async () => {
    setLoading(true);
    try {
      const profile: UserProfile = {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        bodySpecs,
        preferences,
        schedule,
        goals,
        onboardingCompleted: true,
      };

      await dispatch(saveUserProfile(profile)).unwrap();
      toast.success('Profile created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'body':
        return 'Body Specifications';
      case 'preferences':
        return 'Preferences';
      case 'schedule':
        return 'Schedule';
      case 'goals':
        return 'Goals';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'body':
        return 'Tell us about your physical characteristics';
      case 'preferences':
        return 'Let us know your dietary and workout preferences';
      case 'schedule':
        return 'Set up your training and meal schedule';
      case 'goals':
        return 'Define your fitness and health goals';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{getStepTitle()}</CardTitle>
          <CardDescription>{getStepDescription()}</CardDescription>
          <div className="flex gap-2 mt-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full ${
                  index <= currentStepIndex ? 'bg-primary' : 'bg-neutral-100'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {currentStep === 'body' && (
            <BodySpecsForm value={bodySpecs} onChange={setBodySpecs} />
          )}
          {currentStep === 'preferences' && (
            <PreferencesForm value={preferences} onChange={setPreferences} />
          )}
          {currentStep === 'schedule' && (
            <ScheduleForm value={schedule} onChange={setSchedule} />
          )}
          {currentStep === 'goals' && (
            <GoalsForm value={goals} onChange={setGoals} />
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0 || loading}
          >
            Back
          </Button>
          {currentStepIndex < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={loading}>
              Next
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={loading}>
              {loading ? 'Saving...' : 'Complete'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
