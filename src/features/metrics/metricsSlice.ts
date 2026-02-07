import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { BodyMetrics } from '../../types';
import { logRepository } from '../../services/db/repositories';

interface MetricsState {
  metrics: BodyMetrics[];
  currentMetrics: BodyMetrics | null;
  loading: boolean;
  error: string | null;
}

const initialState: MetricsState = {
  metrics: [],
  currentMetrics: null,
  loading: false,
  error: null,
};

// Async thunks
export const loadMetrics = createAsyncThunk(
  'metrics/loadMetrics',
  async ({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
    return await logRepository.getBodyMetricsHistory(startDate, endDate);
  }
);

export const loadTodayMetrics = createAsyncThunk(
  'metrics/loadTodayMetrics',
  async () => {
    return await logRepository.getBodyMetrics(new Date());
  }
);

export const saveMetrics = createAsyncThunk(
  'metrics/saveMetrics',
  async (metrics: BodyMetrics) => {
    await logRepository.saveBodyMetrics(metrics);
    return metrics;
  }
);

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    addMetrics: (state, action: PayloadAction<BodyMetrics>) => {
      const existingIndex = state.metrics.findIndex(
        m => new Date(m.date).toDateString() === new Date(action.payload.date).toDateString()
      );
      if (existingIndex >= 0) {
        state.metrics[existingIndex] = action.payload;
      } else {
        state.metrics.push(action.payload);
      }
    },
    setCurrentMetrics: (state, action: PayloadAction<BodyMetrics | null>) => {
      state.currentMetrics = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load metrics
      .addCase(loadMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(loadMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load metrics';
      })
      // Load today's metrics
      .addCase(loadTodayMetrics.fulfilled, (state, action) => {
        state.currentMetrics = action.payload || null;
      })
      // Save metrics
      .addCase(saveMetrics.fulfilled, (state, action) => {
        const existingIndex = state.metrics.findIndex(
          m => new Date(m.date).toDateString() === new Date(action.payload.date).toDateString()
        );
        if (existingIndex >= 0) {
          state.metrics[existingIndex] = action.payload;
        } else {
          state.metrics.push(action.payload);
        }
        state.currentMetrics = action.payload;
      });
  },
});

export const { addMetrics, setCurrentMetrics, clearError } = metricsSlice.actions;
export default metricsSlice.reducer;
