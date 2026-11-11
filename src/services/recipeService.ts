import { apiClient } from '../config/supabase';
import { Category, Recipe } from '../types/recipe';

// 1. Lấy danh sách tất cả món ăn (có thể lọc theo danh mục hoặc từ khóa tìm kiếm)
export const getRecipes = async (
  categoryId?: number,
  searchQuery?: string
): Promise<Recipe[]> => {
  let url = '/recipes?select=*&order=created_at.desc';

  if (categoryId) {
    url += `&category_id=eq.${categoryId}`;
  }

  if (searchQuery && searchQuery.trim() !== '') {
    // Tìm kiếm tương đối không phân biệt hoa thường theo title
    url += `&title=ilike.*${encodeURIComponent(searchQuery.trim())}*`;
  }

  const response = await apiClient.get<Recipe[]>(url);
  return response.data;
};

// 2. Lấy thông tin chi tiết một món ăn theo ID
export const getRecipeById = async (id: string): Promise<Recipe> => {
  const response = await apiClient.get<Recipe[]>(`/recipes?id=eq.${id}&select=*`);
  if (!response.data || response.data.length === 0) {
    throw new Error('Không tìm thấy công thức món ăn này');
  }
  return response.data[0];
};

// 3. Lấy danh sách danh mục món ăn
export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories?select=*&order=id.asc');
  return response.data;
};

// 4. Tạo mới công thức món ăn (CRUD - Create)
export const createRecipe = async (
  newRecipe: Omit<Recipe, 'id' | 'created_at'>
): Promise<Recipe> => {
  const response = await apiClient.post<Recipe[]>('/recipes', newRecipe);
  return response.data[0];
};

// 5. Xóa công thức món ăn (CRUD - Delete)
export const deleteRecipe = async (id: string): Promise<void> => {
  await apiClient.delete(`/recipes?id=eq.${id}`);
};
