import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import rootReducer, { type RootState } from './rootReducer';
import { syncMiddleware } from '../services/sync/syncMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'user/saveProfile/fulfilled',
          'user/updateProfile/fulfilled',
          'logs/saveDailyLog/fulfilled',
          'metrics/saveMetrics/fulfilled',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.date', 'payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        ignoredPaths: [
          'user.profile.createdAt',
          'user.profile.updatedAt',
          'plans.mealPlans',
          'plans.trainingPlans',
          'logs.logs',
          'logs.todayLog',
          'metrics.metrics',
        ],
      },
    }).concat(syncMiddleware),
});

export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
