import { createAsyncThunk } from '@reduxjs/toolkit';
import { setFavorites } from './favoriteSlice';
import { setShoppingItems } from './shoppingSlice';
import { setFridgeItems } from './fridgeSlice';
import { setTheme } from './themeSlice';
import { fetchDarkMode, fetchFavorites, fetchFridgeItems, fetchShoppingItems } from '../services/userDataService';

// Sau khi đăng nhập / mở lại app: tải yêu thích, đi chợ, dark mode của tài khoản từ database
export const loadUserData = createAsyncThunk<void, string>(
  'userData/load',
  async (userId, { dispatch }) => {
    const [favorites, shopping, fridge, dark] = await Promise.allSettled([
      fetchFavorites(),
      fetchShoppingItems(),
      fetchFridgeItems(),
      fetchDarkMode(userId),
    ]);

    if (favorites.status === 'fulfilled') dispatch(setFavorites(favorites.value));
    else console.warn('Không tải được món yêu thích', favorites.reason);

    if (shopping.status === 'fulfilled') dispatch(setShoppingItems(shopping.value));
    else console.warn('Không tải được danh sách đi chợ', shopping.reason);

    if (fridge.status === 'fulfilled') dispatch(setFridgeItems(fridge.value));
    else console.warn('Không tải được tủ lạnh', fridge.reason);

    if (dark.status === 'fulfilled' && dark.value !== null) dispatch(setTheme(dark.value));
  }
);
