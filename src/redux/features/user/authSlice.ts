import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'user_auth';

interface User {
  id: string;
  email: string;
  fullName: string;
  isVerified: boolean;
}

interface SliceState {
  token?: string | null;
  user?: User | null;
  hydrated: boolean;
}

export const initAuth = createAsyncThunk('auth/init', async () => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (json) return JSON.parse(json) as SliceState;
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, user: null, hydrated: false } as SliceState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<SliceState>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    logout: state => {
      state.token = null;
      state.user = null;
      AsyncStorage.removeItem(STORAGE_KEY);
    },
  },
  extraReducers: builder => {
    builder.addCase(initAuth.fulfilled, (state, action) => {
      if (action.payload) {
        state.token = action.payload.token;
        state.user = action.payload.user;
      }
      state.hydrated = true;
    });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;