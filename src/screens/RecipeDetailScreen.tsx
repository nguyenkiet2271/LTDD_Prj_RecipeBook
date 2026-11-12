import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Button, Card, Separator } from 'tamagui';
import {
  ArrowLeft,
  Heart,
  Clock,
  Flame,
  Users,
  ChefHat,
  ShoppingCart,
  Play,
  CheckCircle2,
  Circle,
} from 'lucide-react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Recipe } from '../types/recipe';
import { getRecipeById } from '../services/recipeService';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { selectIsFavorite, toggleFavorite } from '../redux/favoriteSlice';
import { addIngredientsToShoppingList } from '../redux/shoppingSlice';
import { selectIsDarkMode } from '../redux/themeSlice';

type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

export const RecipeDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RecipeDetailRouteProp>();
  const { recipeId, recipe: initialRecipe } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const isDarkMode = useAppSelector(selectIsDarkMode);

  const [recipe, setRecipe] = useState<Recipe | null>(initialRecipe || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialRecipe);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  const dispatch = useAppDispatch();
  const isFav = useAppSelector(selectIsFavorite(recipeId));

  useEffect(() => {
    if (!initialRecipe) {
      const loadDetail = async () => {
        try {
          const data = await getRecipeById(recipeId);
          setRecipe(data);
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể tải thông tin món ăn');
          navigation.goBack();
        } finally {
          setIsLoading(false);
        }
      };
      loadDetail();
    }
  }, [recipeId, initialRecipe, navigation]);

  if (isLoading || !recipe) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor={isDarkMode ? '#0f172a' : '#ffffff'}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text marginTop={12} color={isDarkMode ? '#94a3b8' : '#64748b'}>Đang tải chi tiết món ăn...</Text>
      </YStack>
    );
  }

  const handleAddToShoppingList = () => {
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      dispatch(
        addIngredientsToShoppingList({
          recipeTitle: recipe.title,
          ingredients: recipe.ingredients,
        })
      );
      Alert.alert('Thành công', 'Đã thêm các nguyên liệu vào Danh sách đi chợ!');
    } else {
      Alert.alert('Thông báo', 'Món ăn này chưa có danh sách nguyên liệu.');
    }
  };

  const toggleCheckIngredient = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' }} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Ảnh bìa & Nút điều hướng */}
        <View style={[styles.heroContainer, { height: isTablet ? 380 : 280 }]}>
          <Image
            source={{ uri: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800' }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          {/* Nút Quay lại */}
          <TouchableOpacity
            style={[styles.navButtonLeft, { backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)' }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color={isDarkMode ? '#f8fafc' : '#0f172a'} />
          </TouchableOpacity>

          {/* Nút Yêu thích */}
          <TouchableOpacity
            style={[styles.navButtonRight, { backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)' }]}
            onPress={() => dispatch(toggleFavorite(recipe))}
            activeOpacity={0.8}
          >
            <Heart
              size={20}
              color={isFav ? '#e11d48' : isDarkMode ? '#94a3b8' : '#64748b'}
              fill={isFav ? '#e11d48' : 'none'}
            />
          </TouchableOpacity>
        </View>

        {/* Nội dung chi tiết */}
        <YStack padding={16} gap={12}>
          <Text fontSize={24} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
            {recipe.title}
          </Text>

          <Text fontSize={14} color={isDarkMode ? '#94a3b8' : '#64748b'} lineHeight={22}>
            {recipe.description}
          </Text>

          {/* Thanh thông số 4 chỉ số */}
          <Card
            borderRadius={16}
            padding={12}
            backgroundColor={isDarkMode ? '#1e293b' : '#f8fafc'}
            borderWidth={1}
            borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
            marginTop={8}
          >
            <XStack justifyContent="space-around" alignItems="center">
              <YStack alignItems="center" gap={4}>
                <Clock size={18} color="#ea580c" />
                <Text fontSize={13} fontWeight="700" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  {recipe.cook_time}p
                </Text>
                <Text fontSize={11} color={isDarkMode ? '#64748b' : '#94a3b8'}>
                  Thời gian
                </Text>
              </YStack>

              <Separator vertical height={35} borderColor={isDarkMode ? '#334155' : '#e2e8f0'} />

              <YStack alignItems="center" gap={4}>
                <Flame size={18} color="#dc2626" />
                <Text fontSize={13} fontWeight="700" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  {recipe.calories} kcal
                </Text>
                <Text fontSize={11} color={isDarkMode ? '#64748b' : '#94a3b8'}>
                  Năng lượng
                </Text>
              </YStack>

              <Separator vertical height={35} borderColor={isDarkMode ? '#334155' : '#e2e8f0'} />

              <YStack alignItems="center" gap={4}>
                <Users size={18} color="#0284c7" />
                <Text fontSize={13} fontWeight="700" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  {recipe.servings || 2} người
                </Text>
                <Text fontSize={11} color={isDarkMode ? '#64748b' : '#94a3b8'}>
                  Khẩu phần
                </Text>
              </YStack>

              <Separator vertical height={35} borderColor={isDarkMode ? '#334155' : '#e2e8f0'} />

              <YStack alignItems="center" gap={4}>
                <ChefHat size={18} color="#059669" />
                <Text fontSize={13} fontWeight="700" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  {recipe.difficulty}
                </Text>
                <Text fontSize={11} color={isDarkMode ? '#64748b' : '#94a3b8'}>
                  Độ khó
                </Text>
              </YStack>
            </XStack>
          </Card>

          {/* Tác giả */}
          <XStack alignItems="center" gap={8} marginTop={4}>
            <ChefHat size={16} color="#059669" />
            <Text fontSize={12} color={isDarkMode ? '#94a3b8' : '#64748b'}>
              Công thức đóng góp bởi:{' '}
              <Text fontWeight="700" color="#059669">
                {recipe.author_name === 'Chef Tuấn' ? 'Chef Huy' : (recipe.author_name || 'Chef Huy')}
              </Text>
            </Text>
          </XStack>

          {/* Phần Nguyên liệu */}
          <YStack marginTop={12} gap={10}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={18} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                Nguyên liệu ({recipe.ingredients?.length || 0})
              </Text>

              <TouchableOpacity
                onPress={handleAddToShoppingList}
                activeOpacity={0.8}
              >
                <XStack
                  alignItems="center"
                  gap={4}
                  backgroundColor={isDarkMode ? '#431407' : '#ffedd5'}
                  paddingHorizontal={10}
                  paddingVertical={6}
                  borderRadius={8}
                  borderWidth={1}
                  borderColor={isDarkMode ? '#9a3412' : '#fed7aa'}
                >
                  <ShoppingCart size={13} color="#ea580c" />
                  <Text fontSize={11} fontWeight="700" color="#ea580c">
                    + Đi chợ
                  </Text>
                </XStack>
              </TouchableOpacity>
            </XStack>

            <YStack gap={8}>
              {recipe.ingredients?.map((item, index) => {
                const isChecked = !!checkedIngredients[index];
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => toggleCheckIngredient(index)}
                  >
                    <XStack
                      justifyContent="space-between"
                      alignItems="center"
                      padding={12}
                      backgroundColor={isChecked ? (isDarkMode ? '#0f172a' : '#f1f5f9') : (isDarkMode ? '#1e293b' : '#f8fafc')}
                      borderRadius={10}
                      borderWidth={1}
                      borderColor={isChecked ? (isDarkMode ? '#334155' : '#cbd5e1') : (isDarkMode ? '#334155' : '#f1f5f9')}
                    >
                      <XStack alignItems="center" gap={10} flex={1}>
                        {isChecked ? (
                          <CheckCircle2 size={18} color="#059669" />
                        ) : (
                          <Circle size={18} color={isDarkMode ? '#64748b' : '#94a3b8'} />
                        )}
                        <Text
                          fontSize={14}
                          color={isChecked ? (isDarkMode ? '#64748b' : '#94a3b8') : (isDarkMode ? '#f8fafc' : '#0f172a')}
                          textDecorationLine={isChecked ? 'line-through' : 'none'}
                        >
                          {item.name}
                        </Text>
                      </XStack>
                      <Text fontSize={13} fontWeight="700" color="#ea580c">
                        {item.amount}
                      </Text>
                    </XStack>
                  </TouchableOpacity>
                );
              })}
            </YStack>
          </YStack>

          {/* Phần Các bước thực hiện */}
          <YStack marginTop={12} gap={10}>
            <Text fontSize={18} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
              Các bước nấu ({recipe.steps?.length || 0})
            </Text>

            <YStack gap={10}>
              {recipe.steps?.map((step, idx) => (
                <XStack
                  key={idx}
                  backgroundColor={isDarkMode ? '#1e293b' : '#f8fafc'}
                  borderRadius={12}
                  padding={14}
                  gap={12}
                  borderWidth={1}
                  borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
                >
                  <YStack
                    width={28}
                    height={28}
                    borderRadius={14}
                    backgroundColor="#ea580c"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text color="#ffffff" fontWeight="800" fontSize={13}>
                      {step.step || idx + 1}
                    </Text>
                  </YStack>

                  <YStack flex={1} gap={4}>
                    <Text fontSize={14} color={isDarkMode ? '#f8fafc' : '#0f172a'} lineHeight={20}>
                      {step.instruction}
                    </Text>
                    {step.duration_minutes ? (
                      <XStack alignItems="center" gap={4} marginTop={4}>
                        <Clock size={12} color="#64748b" />
                        <Text fontSize={11} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                          Khoảng {step.duration_minutes} phút
                        </Text>
                      </XStack>
                    ) : null}
                  </YStack>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Thanh cố định dưới cùng: Nút bắt đầu nấu (Step-by-Step Mode) */}
      <View style={[styles.bottomBar, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderTopColor: isDarkMode ? '#334155' : '#e2e8f0' }]}>
        <Button
          size="lg"
          backgroundColor="#ea580c"
          borderRadius={14}
          onPress={() => navigation.navigate('CookingStep', { recipe })}
        >
          <XStack alignItems="center" gap={8}>
            <Play size={18} color="#ffffff" fill="#ffffff" />
            <Text color="#ffffff" fontWeight="800" fontSize={15}>
              Bắt đầu nấu theo từng bước (Step-by-Step)
            </Text>
          </XStack>
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    position: 'relative',
    width: '100%',
  },
  navButtonLeft: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  navButtonRight: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    elevation: 10,
  },
});
