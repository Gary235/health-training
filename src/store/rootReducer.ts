import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import plansReducer from '../features/plans/plansSlice';
import logsReducer from '../features/logs/logsSlice';
import metricsReducer from '../features/metrics/metricsSlice';

const rootReducer = combineReducers({
  user: userReducer,
  plans: plansReducer,
  logs: logsReducer,
  metrics: metricsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
