import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { DailyLog } from '../../types';
import { logRepository } from '../../services/db/repositories';

interface LogsState {
  logs: DailyLog[];
  todayLog: DailyLog | null;
  recentLogs: DailyLog[];
  loading: boolean;
  error: string | null;
}

const initialState: LogsState = {
  logs: [],
  todayLog: null,
  recentLogs: [],
  loading: false,
  error: null,
};

// Async thunks
export const loadTodayLog = createAsyncThunk(
  'logs/loadTodayLog',
  async (userId: string) => {
    const today = new Date();
    return await logRepository.getDailyLogByDate(userId, today);
  }
);

export const loadRecentLogs = createAsyncThunk(
  'logs/loadRecentLogs',
  async ({ userId, days }: { userId: string; days: number }) => {
    return await logRepository.getRecentLogs(userId, days);
  }
);

export const loadLogs = createAsyncThunk(
  'logs/loadLogs',
  async ({ userId, startDate, endDate }: {
    userId: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    return await logRepository.getDailyLogs(userId, startDate, endDate);
  }
);

export const saveDailyLog = createAsyncThunk(
  'logs/saveDailyLog',
  async (log: DailyLog) => {
    const existing = await logRepository.getDailyLogByDate(log.userId, log.date);
    if (existing) {
      await logRepository.updateDailyLog(existing.id, log);
      return { ...log, id: existing.id };
    } else {
      const id = await logRepository.createDailyLog(log);
      return { ...log, id };
    }
  }
);

export const updateDailyLog = createAsyncThunk(
  'logs/updateDailyLog',
  async ({ logId, updates }: { logId: string; updates: Partial<DailyLog> }) => {
    await logRepository.updateDailyLog(logId, updates);
    return { logId, updates };
  }
);

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setTodayLog: (state, action: PayloadAction<DailyLog>) => {
      state.todayLog = action.payload;
    },
    clearTodayLog: (state) => {
      state.todayLog = null;
    },
    addLog: (state, action: PayloadAction<DailyLog>) => {
      state.logs.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load today's log
      .addCase(loadTodayLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTodayLog.fulfilled, (state, action) => {
        state.loading = false;
        state.todayLog = action.payload || null;
      })
      .addCase(loadTodayLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load today\'s log';
      })
      // Load recent logs
      .addCase(loadRecentLogs.fulfilled, (state, action) => {
        state.recentLogs = action.payload;
      })
      // Load logs
      .addCase(loadLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(loadLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load logs';
      })
      // Save daily log
      .addCase(saveDailyLog.fulfilled, (state, action) => {
        const existingIndex = state.logs.findIndex(log => log.id === action.payload.id);
        if (existingIndex >= 0) {
          state.logs[existingIndex] = action.payload;
        } else {
          state.logs.push(action.payload);
        }

        const today = new Date();
        const logDate = new Date(action.payload.date);
        if (
          today.getFullYear() === logDate.getFullYear() &&
          today.getMonth() === logDate.getMonth() &&
          today.getDate() === logDate.getDate()
        ) {
          state.todayLog = action.payload;
        }
      })
      // Update daily log
      .addCase(updateDailyLog.fulfilled, (state, action) => {
        const { logId, updates } = action.payload;
        const log = state.logs.find(l => l.id === logId);
        if (log) {
          Object.assign(log, updates);
        }
        if (state.todayLog?.id === logId) {
          Object.assign(state.todayLog, updates);
        }
      });
  },
});

export const { setTodayLog, clearTodayLog, addLog, clearError } = logsSlice.actions;
export default logsSlice.reducer;
