import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { AuthUser } from '../types/recipe';
import * as authService from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  hydrated: boolean; // đã kiểm tra xong phiên đăng nhập đã lưu khi mở app
}

const initialState: AuthState = {
  user: null,
  hydrated: false,
};

// Mở app: khôi phục phiên đăng nhập đã lưu (nếu có)
export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  const session = await authService.restoreSession();
  return session?.user ?? null;
});

// Đăng nhập
export const login = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const session = await authService.signIn(email.trim().toLowerCase(), password);
    return session.user;
  } catch (error) {
    return rejectWithValue(authService.getAuthErrorMessage(error));
  }
});

// Đăng ký. Nếu server không yêu cầu xác nhận email thì đăng nhập luôn.
export const register = createAsyncThunk<
  { user: AuthUser | null; needsConfirmation: boolean },
  { fullName: string; email: string; password: string },
  { rejectValue: string }
>('auth/register', async ({ fullName, email, password }, { rejectWithValue }) => {
  try {
    const result = await authService.signUp(fullName.trim(), email.trim().toLowerCase(), password);
    return { user: result.session?.user ?? null, needsConfirmation: result.needsConfirmation };
  } catch (error) {
    return rejectWithValue(authService.getAuthErrorMessage(error));
  }
});

// Đăng xuất
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.signOut();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Phiên hết hạn (refresh token bị từ chối) -> buộc về màn đăng nhập
    sessionExpired: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.hydrated = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.hydrated = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        if (action.payload.user) state.user = action.payload.user;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { sessionExpired } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthHydrated = (state: RootState) => state.auth.hydrated;

export default authSlice.reducer;
