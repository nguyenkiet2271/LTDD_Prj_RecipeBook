import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FridgeItem } from '../types/recipe';
import type { RootState } from './store';

interface FridgeState {
  items: FridgeItem[];
}

const initialState: FridgeState = { items: [] };

const genId = () => `fr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

export const fridgeSlice = createSlice({
  name: 'fridge',
  initialState,
  reducers: {
    // Nạp từ database sau khi đăng nhập (không đồng bộ ngược lên server)
    setFridgeItems: (state, action: PayloadAction<FridgeItem[]>) => {
      state.items = action.payload;
    },
    // Thêm 1 hoặc nhiều món (từ màn Tủ lạnh hoặc chuyển từ danh sách đi chợ)
    addFridgeItems: {
      reducer: (state, action: PayloadAction<FridgeItem[]>) => {
        state.items.push(...action.payload);
      },
      prepare: (items: Omit<FridgeItem, 'id'>[]) => ({
        payload: items.map((i) => ({ ...i, id: genId() })),
      }),
    },
    updateFridgeItem: (state, action: PayloadAction<FridgeItem>) => {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
    },
    removeFridgeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const { setFridgeItems, addFridgeItems, updateFridgeItem, removeFridgeItem } = fridgeSlice.actions;

export const selectFridgeItems = (state: RootState) => state.fridge.items;

export default fridgeSlice.reducer;
