// Định nghĩa các kiểu dữ liệu cho toàn bộ ứng dụng Sổ tay nấu ăn

export interface Ingredient {
  name: string;
  amount: string;
  checked?: boolean;
}

export interface CookingStep {
  step: number;
  instruction: string;
  duration_minutes: number;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category_id: number;
  image_url: string;
  cook_time: number; // số phút
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  calories: number;
  servings: number;
  ingredients: Ingredient[];
  steps: CookingStep[];
  author_name: string;
  author_id?: string | null; // id người dùng (Supabase Auth) đã đăng món này
  created_at?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
  recipeTitle?: string;
}

// Thực phẩm trong tủ lạnh
export interface FridgeItem {
  id: string;
  name: string;
  amount: string;
  expiryDate: string; // 'YYYY-MM-DD'
}

// Người dùng đăng nhập (Supabase Auth)
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

// Kiểu tham số điều hướng (Navigation Params)
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  RecipeDetail: { recipeId: string; recipe?: Recipe };
  CookingStep: { recipe: Recipe };
  CreateRecipe: undefined;
  Profile: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  AIChefTab: undefined;
  ShoppingTab: undefined;
  FridgeTab: undefined;
  FavoritesTab: undefined;
};
