import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../types/recipe';
import { RootState } from './store';

interface FavoriteState {
  favorites: Recipe[];
}

const initialState: FavoriteState = {
  favorites: [],
};

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    // Nạp danh sách từ database sau khi đăng nhập (không đồng bộ ngược lên server)
    setFavorites: (state, action: PayloadAction<Recipe[]>) => {
      state.favorites = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Recipe>) => {
      const exists = state.favorites.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((item) => item.id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<Recipe>) => {
      const index = state.favorites.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite, toggleFavorite } = favoriteSlice.actions;

// Selector lấy danh sách yêu thích
export const selectFavorites = (state: RootState) => state.favorite.favorites;

// Selector kiểm tra món ăn có nằm trong danh sách yêu thích không
export const selectIsFavorite = (id: string) => (state: RootState) =>
  state.favorite.favorites.some((item) => item.id === id);

export default favoriteSlice.reducer;
