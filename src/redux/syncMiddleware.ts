import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from './store';
import {
  addFavoritesToDb,
  removeFavoritesFromDb,
  addShoppingItemsToDb,
  removeShoppingItemsFromDb,
  updateShoppingCheckedInDb,
  saveDarkMode,
  addFridgeItemsToDb,
  updateFridgeItemInDb,
  removeFridgeItemsFromDb,
} from '../services/userDataService';

const warn = (what: string) => (e: unknown) => console.warn(`Không đồng bộ được ${what} lên máy chủ`, e);

/**
 * Tự động đồng bộ dữ liệu cá nhân lên Supabase mỗi khi người dùng thay đổi
 * (yêu thích, đi chợ, dark mode). Các màn hình vẫn dispatch action như cũ.
 * Cách làm: so sánh state trước/sau action rồi gọi API tương ứng.
 * Các action nạp dữ liệu từ server (setFavorites, setShoppingItems, setTheme) bị bỏ qua để không ghi ngược.
 */
export const syncMiddleware: Middleware = (api) => (next) => (action: any) => {
  const before = api.getState() as RootState;
  const result = next(action);
  const after = api.getState() as RootState;

  const user = after.auth.user;
  const type: string = action?.type ?? '';
  if (!user || type === 'favorite/setFavorites' || type === 'shopping/setShoppingItems' || type === 'fridge/setFridgeItems') {
    return result;
  }

  // ---- Món yêu thích ----
  if (before.favorite.favorites !== after.favorite.favorites) {
    const beforeIds = new Set(before.favorite.favorites.map((r) => r.id));
    const afterIds = new Set(after.favorite.favorites.map((r) => r.id));
    addFavoritesToDb(after.favorite.favorites.filter((r) => !beforeIds.has(r.id))).catch(warn('món yêu thích'));
    removeFavoritesFromDb(before.favorite.favorites.filter((r) => !afterIds.has(r.id)).map((r) => r.id)).catch(
      warn('món yêu thích')
    );
  }

  // ---- Danh sách đi chợ ----
  if (before.shopping.items !== after.shopping.items) {
    const beforeMap = new Map(before.shopping.items.map((i) => [i.id, i]));
    const afterMap = new Map(after.shopping.items.map((i) => [i.id, i]));

    addShoppingItemsToDb(after.shopping.items.filter((i) => !beforeMap.has(i.id))).catch(warn('danh sách đi chợ'));
    removeShoppingItemsFromDb(before.shopping.items.filter((i) => !afterMap.has(i.id)).map((i) => i.id)).catch(
      warn('danh sách đi chợ')
    );
    after.shopping.items.forEach((i) => {
      const old = beforeMap.get(i.id);
      if (old && old.checked !== i.checked) {
        updateShoppingCheckedInDb(i.id, i.checked).catch(warn('danh sách đi chợ'));
      }
    });
  }

  // ---- Tủ lạnh ----
  if (before.fridge.items !== after.fridge.items) {
    const beforeMap = new Map(before.fridge.items.map((i) => [i.id, i]));
    const afterMap = new Map(after.fridge.items.map((i) => [i.id, i]));

    addFridgeItemsToDb(after.fridge.items.filter((i) => !beforeMap.has(i.id))).catch(warn('tủ lạnh'));
    removeFridgeItemsFromDb(before.fridge.items.filter((i) => !afterMap.has(i.id)).map((i) => i.id)).catch(
      warn('tủ lạnh')
    );
    after.fridge.items.forEach((i) => {
      const old = beforeMap.get(i.id);
      if (old && (old.name !== i.name || old.amount !== i.amount || old.expiryDate !== i.expiryDate)) {
        updateFridgeItemInDb(i).catch(warn('tủ lạnh'));
      }
    });
  }

  // ---- Dark mode (chỉ khi người dùng bật/tắt, không phải lúc nạp từ server) ----
  if (type === 'theme/toggleTheme' && before.theme.isDarkMode !== after.theme.isDarkMode) {
    saveDarkMode(user.id, after.theme.isDarkMode).catch(warn('chế độ giao diện'));
  }

  return result;
};
