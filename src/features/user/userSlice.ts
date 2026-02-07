import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../../types';
import { userRepository } from '../../services/db/repositories';

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

// Async thunks
export const loadUserProfile = createAsyncThunk(
  'user/loadProfile',
  async () => {
    const profile = await userRepository.getCurrentProfile();
    return profile || null;
  }
);

export const saveUserProfile = createAsyncThunk(
  'user/saveProfile',
  async (profile: UserProfile) => {
    const existingProfile = await userRepository.getProfile(profile.id);
    if (existingProfile) {
      await userRepository.updateProfile(profile.id, profile);
    } else {
      await userRepository.createProfile(profile);
    }
    return profile;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, updates }: { userId: string; updates: Partial<UserProfile> }) => {
    await userRepository.updateProfile(userId, updates);
    const updatedProfile = await userRepository.getProfile(userId);
    return updatedProfile!;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load profile
      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load profile';
      })
      // Save profile
      .addCase(saveUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save profile';
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      });
  },
});

export const { setProfile, clearProfile, setError } = userSlice.actions;
export default userSlice.reducer;
