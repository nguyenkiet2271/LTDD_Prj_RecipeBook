import { apiClient } from '../config/supabase';
import { FridgeItem, Recipe, ShoppingItem } from '../types/recipe';

// Không cần Supabase trả lại bản ghi khi ghi dữ liệu -> nhẹ hơn
const MINIMAL = { Prefer: 'return=minimal' };
const quoteList = (values: string[]) => `(${values.map((v) => `"${v.replace(/"/g, '')}"`).join(',')})`;

// ---------------- Món yêu thích ----------------

export const fetchFavorites = async (): Promise<Recipe[]> => {
  const res = await apiClient.get<{ recipe: Recipe }[]>(
    '/favorites?select=recipe&order=created_at.desc'
  );
  return res.data.map((row) => row.recipe).filter(Boolean);
};

export const addFavoritesToDb = async (recipes: Recipe[]): Promise<void> => {
  if (recipes.length === 0) return;
  await apiClient.post(
    '/favorites?on_conflict=user_id,recipe_id',
    recipes.map((r) => ({ recipe_id: r.id, recipe: r })),
    { headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' } }
  );
};

export const removeFavoritesFromDb = async (recipeIds: string[]): Promise<void> => {
  if (recipeIds.length === 0) return;
  await apiClient.delete(`/favorites?recipe_id=in.${encodeURIComponent(quoteList(recipeIds))}`, {
    headers: MINIMAL,
  });
};

// ---------------- Danh sách đi chợ ----------------

interface ShoppingRow {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
  recipe_title: string | null;
}

export const fetchShoppingItems = async (): Promise<ShoppingItem[]> => {
  const res = await apiClient.get<ShoppingRow[]>('/shopping_items?select=*&order=created_at.desc');
  return res.data.map((r) => ({
    id: r.id,
    name: r.name,
    amount: r.amount,
    checked: r.checked,
    recipeTitle: r.recipe_title ?? undefined,
  }));
};

// items theo thứ tự hiển thị (mới nhất trước) -> gán created_at giảm dần để giữ đúng thứ tự khi tải lại
export const addShoppingItemsToDb = async (items: ShoppingItem[]): Promise<void> => {
  if (items.length === 0) return;
  const base = Date.now();
  await apiClient.post(
    '/shopping_items',
    items.map((it, i) => ({
      id: it.id,
      name: it.name,
      amount: it.amount,
      checked: it.checked,
      recipe_title: it.recipeTitle ?? null,
      created_at: new Date(base + (items.length - i)).toISOString(),
    })),
    { headers: MINIMAL }
  );
};

export const updateShoppingCheckedInDb = async (id: string, checked: boolean): Promise<void> => {
  await apiClient.patch(
    `/shopping_items?id=eq.${encodeURIComponent(id)}`,
    { checked },
    { headers: MINIMAL }
  );
};

export const removeShoppingItemsFromDb = async (ids: string[]): Promise<void> => {
  if (ids.length === 0) return;
  await apiClient.delete(`/shopping_items?id=in.${encodeURIComponent(quoteList(ids))}`, {
    headers: MINIMAL,
  });
};

// ---------------- Tủ lạnh ----------------

interface FridgeRow {
  id: string;
  name: string;
  amount: string;
  expiry_date: string;
}

export const fetchFridgeItems = async (): Promise<FridgeItem[]> => {
  const res = await apiClient.get<FridgeRow[]>('/fridge_items?select=*&order=expiry_date.asc');
  return res.data.map((r) => ({ id: r.id, name: r.name, amount: r.amount, expiryDate: r.expiry_date }));
};

export const addFridgeItemsToDb = async (items: FridgeItem[]): Promise<void> => {
  if (items.length === 0) return;
  await apiClient.post(
    '/fridge_items',
    items.map((i) => ({ id: i.id, name: i.name, amount: i.amount, expiry_date: i.expiryDate })),
    { headers: MINIMAL }
  );
};

export const updateFridgeItemInDb = async (item: FridgeItem): Promise<void> => {
  await apiClient.patch(
    `/fridge_items?id=eq.${encodeURIComponent(item.id)}`,
    { name: item.name, amount: item.amount, expiry_date: item.expiryDate },
    { headers: MINIMAL }
  );
};

export const removeFridgeItemsFromDb = async (ids: string[]): Promise<void> => {
  if (ids.length === 0) return;
  await apiClient.delete(`/fridge_items?id=in.${encodeURIComponent(quoteList(ids))}`, { headers: MINIMAL });
};

// ---------------- Dark mode (profiles.dark_mode) ----------------

export const fetchDarkMode = async (userId: string): Promise<boolean | null> => {
  const res = await apiClient.get<{ dark_mode: boolean }[]>(
    `/profiles?select=dark_mode&id=eq.${userId}`
  );
  return res.data[0]?.dark_mode ?? null;
};

export const saveDarkMode = async (userId: string, value: boolean): Promise<void> => {
  await apiClient.patch(`/profiles?id=eq.${userId}`, { dark_mode: value }, { headers: MINIMAL });
};
