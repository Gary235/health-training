import type { Middleware } from '@reduxjs/toolkit';
import { userRepository, planRepository, logRepository } from '../db/repositories';

// Actions that should trigger database sync
const SYNC_ACTIONS = [
  'user/saveProfile/fulfilled',
  'user/updateProfile/fulfilled',
  'plans/saveMealPlan/fulfilled',
  'plans/saveTrainingPlan/fulfilled',
  'plans/updateMealPlanStatus/fulfilled',
  'plans/updateTrainingPlanStatus/fulfilled',
  'logs/saveDailyLog/fulfilled',
  'logs/updateDailyLog/fulfilled',
  'metrics/saveMetrics/fulfilled',
];

export const syncMiddleware: Middleware = () => (next) => async (action: any) => {
  // Pass action to next middleware
  const result = next(action);

  // Check if this action should trigger sync
  if (action.type && SYNC_ACTIONS.includes(action.type)) {
    try {
      // The sync happens in the async thunks themselves
      // This middleware is primarily for additional sync logic if needed
      console.log(`Synced action: ${action.type}`);
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  return result;
};

// State hydration from IndexedDB
export async function hydrateStoreFromDB(dispatch: any) {
  try {
    console.log('Hydrating store from IndexedDB...');

    // Load user profile
    const profile = await userRepository.getCurrentProfile();
    if (profile) {
      dispatch({ type: 'user/setProfile', payload: profile });

      // Load active plans
      const activeMealPlan = await planRepository.getActiveMealPlan(profile.id);
      if (activeMealPlan) {
        dispatch({ type: 'plans/setActiveMealPlan', payload: activeMealPlan });
      }

      const activeTrainingPlan = await planRepository.getActiveTrainingPlan(profile.id);
      if (activeTrainingPlan) {
        dispatch({ type: 'plans/setActiveTrainingPlan', payload: activeTrainingPlan });
      }

      // Load today's log
      const today = new Date();
      const todayLog = await logRepository.getDailyLogByDate(profile.id, today);
      if (todayLog) {
        dispatch({ type: 'logs/setTodayLog', payload: todayLog });
      }

      // Load recent logs for adherence analysis
      const recentLogs = await logRepository.getRecentLogs(profile.id, 7);
      if (recentLogs.length > 0) {
        dispatch({
          type: 'logs/loadRecentLogs/fulfilled',
          payload: recentLogs,
        });
      }

      // Load recent metrics
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const metrics = await logRepository.getBodyMetricsHistory(startDate, endDate);
      if (metrics.length > 0) {
        dispatch({
          type: 'metrics/loadMetrics/fulfilled',
          payload: metrics,
        });
      }
    }

    console.log('Store hydration complete');
  } catch (error) {
    console.error('Failed to hydrate store:', error);
  }
}
