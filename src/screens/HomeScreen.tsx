import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Input, Button, Card } from 'tamagui';
import { Search, Sparkles, Plus, ChefHat, RefreshCw } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/recipe';
import { Category, Recipe } from '../types/recipe';
import { getCategories, getRecipes } from '../services/recipeService';
import { RecipeCard } from '../components/RecipeCard';
import { CategoryPills } from '../components/CategoryPills';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isTabletOrLandscape = width >= 768;

  // Quản lý trạng thái bằng useState/useEffect thủ công
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Lỗi lấy danh mục:', err);
    }
  };

  const fetchRecipesData = useCallback(async () => {
    try {
      setErrorMessage(null);
      const data = await getRecipes(selectedCategoryId || undefined, searchQuery);
      setRecipes(data);
    } catch (err: any) {
      setErrorMessage('Không thể tải danh sách món ăn. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCategoryId, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchRecipesData();
  }, [fetchRecipesData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchRecipesData();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#ea580c']} />
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* Header App */}
        <YStack paddingHorizontal={16} paddingTop={8} paddingBottom={12}>
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Text fontSize={13} color="#64748b" fontWeight="600">
                Hôm nay bạn muốn nấu gì? 👨‍🍳
              </Text>
              <Text fontSize={22} fontWeight="800" color="#0f172a">
                Sổ Tay Ẩm Thực
              </Text>
            </YStack>

            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
            >
              <XStack
                backgroundColor="#ffedd5"
                paddingHorizontal={10}
                paddingVertical={6}
                borderRadius={20}
                alignItems="center"
                gap={6}
                borderWidth={1}
                borderColor="#fed7aa"
              >
                <ChefHat size={18} color="#ea580c" />
                <Text fontSize={12} fontWeight="700" color="#ea580c">
                  Hồ Sơ
                </Text>
              </XStack>
            </TouchableOpacity>
          </XStack>

          {/* Thanh tìm kiếm món ăn */}
          <XStack
            marginTop={12}
            backgroundColor="#ffffff"
            borderRadius={12}
            alignItems="center"
            paddingHorizontal={12}
            borderWidth={1}
            borderColor="#e2e8f0"
          >
            <Search size={18} color="#94a3b8" />
            <Input
              flex={1}
              borderWidth={0}
              placeholder="Tìm kiếm món ăn, ví dụ: Phở bò, Salad..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              fontSize={14}
              backgroundColor="transparent"
            />
          </XStack>
        </YStack>

        {/* Banner Trợ lý AI Đầu Bếp */}
        <YStack paddingHorizontal={16} marginBottom={12}>
          <Card
            borderWidth={1}
            borderRadius={16}
            backgroundColor="#fff7ed"
            borderColor="#fdba74"
            padding={16}
          >
            <XStack justifyContent="space-between" alignItems="center" gap={12}>
              <YStack flex={1} gap={4}>
                <XStack alignItems="center" gap={6}>
                  <Sparkles size={16} color="#ea580c" />
                  <Text fontSize={14} fontWeight="800" color="#c2410c">
                    TRỢ LÝ ĐẦU BẾP AI
                  </Text>
                </XStack>
                <Text fontSize={12} color="#7c2d12" lineHeight={17}>
                  Tủ lạnh còn gì nấu nấy! Nhập nguyên liệu để AI tạo công thức ngay.
                </Text>
              </YStack>

              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300' }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
                resizeMode="cover"
              />

              <Button
                size="sm"
                backgroundColor="#ea580c"
                borderRadius={10}
                onPress={() => (navigation as any).navigate('AIChefTab')}
              >
                <Text color="#ffffff" fontWeight="700" fontSize={12}>
                  Thử ngay
                </Text>
              </Button>
            </XStack>
          </Card>
        </YStack>

        {/* Thanh cuộn ngang danh mục */}
        <CategoryPills
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        {/* Tiêu đề danh sách món */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={16}
          marginTop={12}
          marginBottom={8}
        >
          <Text fontSize={18} fontWeight="800" color="#0f172a">
            Công thức nổi bật ({recipes.length})
          </Text>
          {isTabletOrLandscape && (
            <Text fontSize={12} color="#ea580c" fontWeight="700">
              Chế độ Tablet / Màn hình rộng
            </Text>
          )}
        </XStack>

        {/* Trạng thái Loading / Lỗi / Danh sách */}
        <YStack paddingHorizontal={16}>
          {isLoading ? (
            <YStack paddingVertical={40} alignItems="center" gap={12}>
              <ActivityIndicator size="large" color="#ea580c" />
              <Text fontSize={13} color="#64748b">
                Đang tải công thức nấu ăn ngon từ máy chủ...
              </Text>
            </YStack>
          ) : errorMessage ? (
            <YStack paddingVertical={30} alignItems="center" gap={12}>
              <Text fontSize={14} color="#dc2626" textAlign="center">
                {errorMessage}
              </Text>
              <Button size="sm" onPress={fetchRecipesData}>
                <Text color="#ffffff" fontWeight="700">Thử lại</Text>
              </Button>
            </YStack>
          ) : recipes.length === 0 ? (
            <YStack paddingVertical={40} alignItems="center" gap={8}>
              <Text fontSize={16} fontWeight="700" color="#334155">
                Không tìm thấy món ăn nào 🥣
              </Text>
              <Text fontSize={13} color="#94a3b8">
                Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục.
              </Text>
            </YStack>
          ) : (
            <XStack
              flexWrap="wrap"
              justifyContent={isTabletOrLandscape ? 'space-between' : 'center'}
            >
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isTabletOrLandscape={isTabletOrLandscape}
                  onPress={() =>
                    navigation.navigate('RecipeDetail', {
                      recipeId: recipe.id,
                      recipe,
                    })
                  }
                />
              ))}
            </XStack>
          )}
        </YStack>
      </ScrollView>

      {/* Nút Floating Action Button (+) Đóng góp công thức mới */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateRecipe')}
        activeOpacity={0.85}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ea580c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
});
