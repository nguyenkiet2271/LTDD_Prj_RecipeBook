import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Input, Button, Card } from 'tamagui';
import {
  Sparkles,
  Plus,
  X,
  ChefHat,
  Clock,
  Flame,
  ArrowRight,
  BookOpen,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Recipe } from '../types/recipe';
import { generateAIRecipe } from '../services/geminiService';
import { createRecipe } from '../services/recipeService';
import { useAppSelector } from '../redux/store';
import { selectIsDarkMode } from '../redux/themeSlice';

const SUGGESTED_INGREDIENTS = [
  'Trứng gà',
  'Cà chua',
  'Thịt heo băm',
  'Thịt bò',
  'Ức gà',
  'Đậu hũ',
  'Hành lá',
  'Khoai tây',
  'Nấm hương',
];

export const AIChefScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Trứng gà',
    'Cà chua',
  ]);
  const [customInput, setCustomInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiRecipes, setAiRecipes] = useState<Recipe[]>([]);

  const handleToggleIngredient = (item: string) => {
    if (selectedIngredients.includes(item)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== item));
    } else {
      setSelectedIngredients([...selectedIngredients, item]);
    }
  };

  const handleAddCustom = () => {
    if (customInput.trim() && !selectedIngredients.includes(customInput.trim())) {
      setSelectedIngredients([...selectedIngredients, customInput.trim()]);
      setCustomInput('');
    }
  };

  const handleRemove = (item: string) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i !== item));
  };

  const handleAskAI = async () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('Nhắc nhở', 'Hãy chọn hoặc nhập ít nhất 1 nguyên liệu có trong tủ lạnh!');
      return;
    }

    setIsGenerating(true);
    setAiRecipes([]);

    try {
      const results = await generateAIRecipe(selectedIngredients);
      setAiRecipes(results);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo công thức từ AI lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToBook = async (recipe: Recipe) => {
    try {
      await createRecipe({
        title: recipe.title,
        description: recipe.description,
        category_id: recipe.category_id || 1,
        image_url: recipe.image_url,
        cook_time: recipe.cook_time,
        difficulty: recipe.difficulty,
        calories: recipe.calories,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        author_name: 'Chef Huy',
      });
      Alert.alert('Thành công', 'Đã lưu món ăn của AI vào Sổ tay ẩm thực!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu món ăn vào máy chủ.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Tiêu đề & Giới thiệu tính năng AI */}
        <YStack gap={4} marginBottom={16}>
          <XStack alignItems="center" gap={8}>
            <Sparkles size={22} color="#ea580c" />
            <Text fontSize={22} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
              Đầu Bếp AI Thông Minh
            </Text>
          </XStack>
          <Text fontSize={13} color={isDarkMode ? '#94a3b8' : '#64748b'} lineHeight={18}>
            Tủ lạnh còn nguyên liệu gì? Hãy chọn hoặc nhập, AI sẽ sáng tạo công thức nấu ăn ngon cho bạn!
          </Text>
        </YStack>

        {/* Ô nhập nguyên liệu tự do */}
        <Card
          borderWidth={1}
          borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
          borderRadius={16}
          padding={14}
          backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
          marginBottom={12}
        >
          <Text fontSize={13} fontWeight="700" color={isDarkMode ? '#f8fafc' : '#0f172a'} marginBottom={8}>
            Thêm nguyên liệu có sẵn:
          </Text>
          <XStack gap={8} alignItems="center">
            <Input
              flex={1}
              size="sm"
              placeholder="Nhập tên nguyên liệu (VD: Thịt ba chỉ...)"
              value={customInput}
              onChangeText={setCustomInput}
              onSubmitEditing={handleAddCustom}
              backgroundColor={isDarkMode ? '#0f172a' : '#f8fafc'}
              color={isDarkMode ? '#f8fafc' : '#0f172a'}
              borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
            />
            <Button
              size="sm"
              backgroundColor="#ea580c"
              onPress={handleAddCustom}
            >
              <Plus size={18} color="#ffffff" />
            </Button>
          </XStack>

          {/* Gợi ý nguyên liệu phổ biến */}
          <Text fontSize={12} color={isDarkMode ? '#64748b' : '#94a3b8'} marginTop={12} marginBottom={8}>
            Gợi ý nhanh trong tủ lạnh:
          </Text>
          <XStack flexWrap="wrap" gap={8}>
            {SUGGESTED_INGREDIENTS.map((item) => {
              const isSelected = selectedIngredients.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleToggleIngredient(item)}
                  activeOpacity={0.7}
                >
                  <XStack
                    paddingHorizontal={12}
                    paddingVertical={6}
                    borderRadius={16}
                    backgroundColor={isSelected ? (isDarkMode ? '#7c2d12' : '#ffedd5') : (isDarkMode ? '#0f172a' : '#f1f5f9')}
                    borderWidth={1}
                    borderColor={isSelected ? '#ea580c' : (isDarkMode ? '#334155' : '#e2e8f0')}
                  >
                    <Text
                      fontSize={12}
                      fontWeight="600"
                      color={isSelected ? '#ea580c' : (isDarkMode ? '#cbd5e1' : '#475569')}
                    >
                      {item} {isSelected ? '✓' : '+'}
                    </Text>
                  </XStack>
                </TouchableOpacity>
              );
            })}
          </XStack>
        </Card>

        {/* Danh sách nguyên liệu đã chọn */}
        <YStack marginBottom={16}>
          <Text fontSize={14} fontWeight="700" color={isDarkMode ? '#f8fafc' : '#0f172a'} marginBottom={8}>
            Nguyên liệu đã chọn ({selectedIngredients.length}):
          </Text>
          {selectedIngredients.length === 0 ? (
            <Text fontSize={12} color={isDarkMode ? '#64748b' : '#94a3b8'} fontStyle="italic">
              Chưa có nguyên liệu nào được chọn.
            </Text>
          ) : (
            <XStack flexWrap="wrap" gap={8}>
              {selectedIngredients.map((item) => (
                <XStack
                  key={item}
                  backgroundColor={isDarkMode ? '#431407' : '#ffedd5'}
                  borderColor={isDarkMode ? '#9a3412' : '#fdba74'}
                  borderWidth={1}
                  borderRadius={12}
                  paddingHorizontal={12}
                  paddingVertical={6}
                  alignItems="center"
                  gap={6}
                >
                  <Text fontSize={13} fontWeight="600" color={isDarkMode ? '#fdba74' : '#c2410c'}>
                    {item}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemove(item)}>
                    <X size={14} color={isDarkMode ? '#fdba74' : '#c2410c'} />
                  </TouchableOpacity>
                </XStack>
              ))}
            </XStack>
          )}
        </YStack>

        {/* Nút Gọi AI tạo công thức */}
        <Button
          size="lg"
          backgroundColor="#ea580c"
          borderRadius={14}
          disabled={isGenerating}
          onPress={handleAskAI}
        >
          {isGenerating ? (
            <XStack alignItems="center" gap={8}>
              <ActivityIndicator color="#ffffff" />
              <Text color="#ffffff" fontWeight="800" fontSize={14}>
                AI đang suy nghĩ và sáng tạo món...
              </Text>
            </XStack>
          ) : (
            <XStack alignItems="center" gap={8}>
              <Sparkles size={18} color="#ffffff" />
              <Text color="#ffffff" fontWeight="800" fontSize={15}>
                Nhờ AI Gợi Ý Món Ăn Ngay
              </Text>
            </XStack>
          )}
        </Button>

        {/* Kết quả món ăn do AI đề xuất */}
        {aiRecipes.length > 0 && (
          <YStack marginTop={20} gap={12}>
            <XStack alignItems="center" gap={8}>
              <ChefHat size={20} color="#059669" />
              <Text fontSize={18} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                Món ăn AI gợi ý cho bạn ({aiRecipes.length})
              </Text>
            </XStack>

            {aiRecipes.map((item, idx) => (
              <Card
                key={idx}
                borderWidth={1}
                borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
                borderRadius={16}
                backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
                padding={16}
                gap={10}
              >
                {/* Ảnh món ăn do AI đề xuất */}
                <Image
                  source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800' }}
                  style={{ width: '100%', height: 160, borderRadius: 12, backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9' }}
                  resizeMode="cover"
                />

                <Text fontSize={17} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  {item.title}
                </Text>

                <Text fontSize={13} color={isDarkMode ? '#94a3b8' : '#64748b'} lineHeight={18}>
                  {item.description}
                </Text>

                <XStack gap={16} marginVertical={4}>
                  <XStack alignItems="center" gap={4}>
                    <Clock size={14} color="#ea580c" />
                    <Text fontSize={12} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                      {item.cook_time} phút
                    </Text>
                  </XStack>
                  <XStack alignItems="center" gap={4}>
                    <Flame size={14} color="#dc2626" />
                    <Text fontSize={12} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                      {item.calories} kcal
                    </Text>
                  </XStack>
                  <XStack alignItems="center" gap={4}>
                    <Text fontSize={12} color="#059669" fontWeight="700">
                      Độ khó: {item.difficulty}
                    </Text>
                  </XStack>
                </XStack>

                {/* Các nút hành động */}
                <XStack gap={8} marginTop={8}>
                  <Button
                    size="sm"
                    flex={1}
                    backgroundColor={isDarkMode ? '#431407' : '#ffedd5'}
                    borderWidth={1}
                    borderColor={isDarkMode ? '#9a3412' : '#fed7aa'}
                    onPress={() =>
                      navigation.navigate('RecipeDetail', {
                        recipeId: item.id,
                        recipe: item,
                      })
                    }
                  >
                    <XStack alignItems="center" gap={4}>
                      <Text fontSize={12} fontWeight="700" color="#ea580c">
                        Xem chi tiết
                      </Text>
                      <ArrowRight size={14} color="#ea580c" />
                    </XStack>
                  </Button>

                  <Button
                    size="sm"
                    backgroundColor="#059669"
                    onPress={() => handleSaveToBook(item)}
                  >
                    <XStack alignItems="center" gap={4}>
                      <BookOpen size={14} color="#ffffff" />
                      <Text fontSize={12} fontWeight="700" color="#ffffff">
                        Lưu vào Sổ tay
                      </Text>
                    </XStack>
                  </Button>
                </XStack>
              </Card>
            ))}
          </YStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
