import { combineReducers, configureStore, UnknownAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import favoriteReducer from './favoriteSlice';
import shoppingReducer from './shoppingSlice';
import themeReducer from './themeSlice';
import fridgeReducer from './fridgeSlice';
import authReducer, { logout, sessionExpired } from './authSlice';
import { setSessionExpiredHandler } from '../services/authService';
import { syncMiddleware } from './syncMiddleware';

const appReducer = combineReducers({
  favorite: favoriteReducer,
  shopping: shoppingReducer,
  fridge: fridgeReducer,
  theme: themeReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof appReducer>;

// Khi đăng xuất / hết phiên: xóa dữ liệu cá nhân (yêu thích, đi chợ) để tài khoản sau không thấy,
// chỉ giữ lại cài đặt giao diện (dark mode).
const rootReducer = (state: RootState | undefined, action: UnknownAction): RootState => {
  if (state && (logout.fulfilled.match(action) || logout.rejected.match(action) || sessionExpired.match(action))) {
    return appReducer({ theme: state.theme, auth: state.auth } as RootState, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(syncMiddleware),
});

setSessionExpiredHandler(() => store.dispatch(sessionExpired()));

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
