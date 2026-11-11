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
  created_at?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
  recipeTitle?: string;
}

// Kiểu tham số điều hướng (Navigation Params)
export type RootStackParamList = {
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
  FavoritesTab: undefined;
};
