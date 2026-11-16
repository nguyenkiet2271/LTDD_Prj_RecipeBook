import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient, ShoppingItem } from '../types/recipe';
import { RootState } from './store';

interface ShoppingState {
  items: ShoppingItem[];
}

const initialState: ShoppingState = {
  items: [],
};

export const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    // Nạp danh sách từ database sau khi đăng nhập (không đồng bộ ngược lên server)
    setShoppingItems: (state, action: PayloadAction<ShoppingItem[]>) => {
      state.items = action.payload;
    },
    addIngredientsToShoppingList: (
      state,
      action: PayloadAction<{ recipeTitle: string; ingredients: Ingredient[] }>
    ) => {
      const { recipeTitle, ingredients } = action.payload;
      const newItems: ShoppingItem[] = ingredients.map((ing) => ({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: ing.name,
        amount: ing.amount,
        checked: false,
        recipeTitle,
      }));
      state.items.unshift(...newItems);
    },
    toggleItemChecked: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.checked = !item.checked;
      }
    },
    removeShoppingItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCompletedItems: (state) => {
      state.items = state.items.filter((i) => !i.checked);
    },
    addCustomItem: (state, action: PayloadAction<{ name: string; amount: string }>) => {
      state.items.unshift({
        id: `${Date.now()}`,
        name: action.payload.name,
        amount: action.payload.amount || '1 phần',
        checked: false,
        recipeTitle: 'Mua tự do',
      });
    },
  },
});

export const {
  setShoppingItems,
  addIngredientsToShoppingList,
  toggleItemChecked,
  removeShoppingItem,
  clearCompletedItems,
  addCustomItem,
} = shoppingSlice.actions;

export const selectShoppingItems = (state: RootState) => state.shopping.items;

export default shoppingSlice.reducer;
