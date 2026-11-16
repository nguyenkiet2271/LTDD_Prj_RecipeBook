import { createAsyncThunk } from '@reduxjs/toolkit';
import { setFavorites } from './favoriteSlice';
import { setShoppingItems } from './shoppingSlice';
import { setTheme } from './themeSlice';
import { fetchDarkMode, fetchFavorites, fetchShoppingItems } from '../services/userDataService';

// Sau khi đăng nhập / mở lại app: tải yêu thích, đi chợ, dark mode của tài khoản từ database
export const loadUserData = createAsyncThunk<void, string>(
  'userData/load',
  async (userId, { dispatch }) => {
    const [favorites, shopping, dark] = await Promise.allSettled([
      fetchFavorites(),
      fetchShoppingItems(),
      fetchDarkMode(userId),
    ]);

    if (favorites.status === 'fulfilled') dispatch(setFavorites(favorites.value));
    else console.warn('Không tải được món yêu thích', favorites.reason);

    if (shopping.status === 'fulfilled') dispatch(setShoppingItems(shopping.value));
    else console.warn('Không tải được danh sách đi chợ', shopping.reason);

    if (dark.status === 'fulfilled' && dark.value !== null) dispatch(setTheme(dark.value));
  }
);
