import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { loadTodayLog, saveDailyLog } from '../features/logs/logsSlice';
import { planRepository } from '../services/db/repositories';
import type { Meal, TrainingSession, DailyLog, MealLog, TrainingLog } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function useDailyPlan() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const { todayLog } = useAppSelector((state) => state.logs);

  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [todaySessions, setTodaySessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadTodayPlans();
      dispatch(loadTodayLog(profile.id));
    }
  }, [dispatch, profile]);

  const loadTodayPlans = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Load meal plan for today
      const mealPlan = await planRepository.getMealPlanForDate(profile.id, today);
      if (mealPlan) {
        const todayPlan = mealPlan.dailyPlans.find((plan) => {
          const planDate = new Date(plan.date);
          planDate.setHours(0, 0, 0, 0);
          return planDate.getTime() === today.getTime();
        });
        setTodayMeals(todayPlan?.meals || []);
      } else {
        setTodayMeals([]);
      }

      // Load training plan for today
      const trainingPlan = await planRepository.getTrainingPlanForDate(profile.id, today);
      if (trainingPlan) {
        const todaySessions = trainingPlan.sessions.filter((session) => {
          const sessionDate = new Date(session.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate.getTime() === today.getTime();
        });
        setTodaySessions(todaySessions);
      } else {
        setTodaySessions([]);
      }
    } catch (error) {
      console.error('Failed to load today\'s plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const logMeal = async (mealLog: MealLog) => {
    if (!profile) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's log
    let currentLog = todayLog;
    if (!currentLog) {
      currentLog = {
        id: uuidv4(),
        userId: profile.id,
        date: today,
        mealLogs: [],
        trainingLogs: [],
        overallAdherence: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // Update or add meal log
    const existingIndex = currentLog.mealLogs.findIndex(
      (log: MealLog) => log.mealId === mealLog.mealId
    );

    let updatedMealLogs;
    if (existingIndex >= 0) {
      updatedMealLogs = [...currentLog.mealLogs];
      updatedMealLogs[existingIndex] = mealLog;
    } else {
      updatedMealLogs = [...currentLog.mealLogs, mealLog];
    }

    const updatedLog: DailyLog = {
      ...currentLog,
      mealLogs: updatedMealLogs,
      overallAdherence: calculateAdherence(updatedMealLogs, currentLog.trainingLogs),
      updatedAt: new Date(),
    };

    await dispatch(saveDailyLog(updatedLog)).unwrap();
  };

  const logTraining = async (trainingLog: TrainingLog) => {
    if (!profile) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's log
    let currentLog = todayLog;
    if (!currentLog) {
      currentLog = {
        id: uuidv4(),
        userId: profile.id,
        date: today,
        mealLogs: [],
        trainingLogs: [],
        overallAdherence: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // Update or add training log
    const existingIndex = currentLog.trainingLogs.findIndex(
      (log: TrainingLog) => log.sessionId === trainingLog.sessionId
    );

    let updatedTrainingLogs;
    if (existingIndex >= 0) {
      updatedTrainingLogs = [...currentLog.trainingLogs];
      updatedTrainingLogs[existingIndex] = trainingLog;
    } else {
      updatedTrainingLogs = [...currentLog.trainingLogs, trainingLog];
    }

    const updatedLog: DailyLog = {
      ...currentLog,
      trainingLogs: updatedTrainingLogs,
      overallAdherence: calculateAdherence(currentLog.mealLogs, updatedTrainingLogs),
      updatedAt: new Date(),
    };

    await dispatch(saveDailyLog(updatedLog)).unwrap();
  };

  const calculateAdherence = (
    mealLogs: MealLog[],
    trainingLogs: TrainingLog[]
  ): number => {
    const totalItems = todayMeals.length + todaySessions.length;
    if (totalItems === 0) return 0;

    let completedCount = 0;

    mealLogs.forEach((log) => {
      if (log.adherence === 'full') completedCount += 1;
      else if (log.adherence === 'partial') completedCount += 0.5;
    });

    trainingLogs.forEach((log) => {
      if (log.adherence === 'full') completedCount += 1;
      else if (log.adherence === 'partial') completedCount += 0.5;
    });

    return Math.round((completedCount / totalItems) * 100);
  };

  const getMealLog = (mealId: string): MealLog | undefined => {
    return todayLog?.mealLogs.find((log: MealLog) => log.mealId === mealId);
  };

  const getTrainingLog = (sessionId: string): TrainingLog | undefined => {
    return todayLog?.trainingLogs.find((log: TrainingLog) => log.sessionId === sessionId);
  };

  return {
    todayMeals,
    todaySessions,
    todayLog,
    loading,
    logMeal,
    logTraining,
    getMealLog,
    getTrainingLog,
  };
}
