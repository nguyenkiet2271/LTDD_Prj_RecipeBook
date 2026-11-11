import React, { useState } from 'react';
import {
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Input, Button, Card } from 'tamagui';
import {
  ArrowLeft,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { createRecipe } from '../services/recipeService';
import { Ingredient, CookingStep } from '../types/recipe';

export const CreateRecipeScreen: React.FC = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
  );
  const [cookTime, setCookTime] = useState('25');
  const [calories, setCalories] = useState('350');
  const [servings, setServings] = useState('2');
  const [difficulty, setDifficulty] = useState<'Dễ' | 'Trung bình' | 'Khó'>('Dễ');

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '' },
  ]);

  const [steps, setSteps] = useState<CookingStep[]>([
    { step: 1, instruction: '', duration_minutes: 5 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Quyền truy cập', 'Cần cấp quyền thư viện ảnh để tải ảnh món ăn!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };
  const removeIngredientField = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };
  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addStepField = () => {
    setSteps([
      ...steps,
      { step: steps.length + 1, instruction: '', duration_minutes: 5 },
    ]);
  };
  const removeStepField = (index: number) => {
    if (steps.length > 1) {
      const updated = steps.filter((_, i) => i !== index);
      setSteps(updated.map((s, idx) => ({ ...s, step: idx + 1 })));
    }
  };
  const updateStep = (index: number, instruction: string) => {
    const updated = [...steps];
    updated[index].instruction = instruction;
    setSteps(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn!');
      return;
    }

    const validIngredients = ingredients.filter((i) => i.name.trim() !== '');
    if (validIngredients.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập ít nhất 1 nguyên liệu!');
      return;
    }

    const validSteps = steps.filter((s) => s.instruction.trim() !== '');
    if (validSteps.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập ít nhất 1 bước hướng dẫn nấu!');
      return;
    }

    setIsSubmitting(true);

    try {
      await createRecipe({
        title: title.trim(),
        description: description.trim() || 'Món ăn tự làm thơm ngon, bổ dưỡng.',
        category_id: categoryId,
        image_url: imageUrl,
        cook_time: parseInt(cookTime, 10) || 20,
        difficulty,
        calories: parseInt(calories, 10) || 300,
        servings: parseInt(servings, 10) || 2,
        ingredients: validIngredients,
        steps: validSteps,
        author_name: 'Bạn và Tôi',
      });

      Alert.alert('Thành công', 'Đã thêm công thức mới lên Supabase thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu công thức lên máy chủ. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Header */}
        <XStack alignItems="center" gap={12} marginBottom={16}>
          <TouchableOpacity
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: '#e2e8f0',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={18} color="#0f172a" />
          </TouchableOpacity>
          <Text fontSize={20} fontWeight="800" color="#0f172a">
            Đóng Góp Công Thức Mới
          </Text>
        </XStack>

        <YStack gap={12}>
          {/* Tên món */}
          <YStack gap={4}>
            <Text fontSize={13} fontWeight="700" color="#0f172a">
              Tên món ăn (*):
            </Text>
            <Input
              size="md"
              backgroundColor="#ffffff"
              placeholder="Ví dụ: Bún chả Hà Nội..."
              value={title}
              onChangeText={setTitle}
            />
          </YStack>

          {/* Chọn danh mục */}
          <YStack gap={4}>
            <Text fontSize={13} fontWeight="700" color="#0f172a">
              Danh mục:
            </Text>
            <XStack flexWrap="wrap" gap={8}>
              {[
                { id: 1, name: 'Món Sáng' },
                { id: 2, name: 'Món Trưa' },
                { id: 3, name: 'Món Chay' },
                { id: 4, name: 'Tráng Miệng' },
                { id: 5, name: 'Eat-Clean' },
              ].map((c) => (
                <Button
                  key={c.id}
                  size="sm"
                  backgroundColor={categoryId === c.id ? '#ea580c' : '#ffffff'}
                  borderWidth={1}
                  borderColor={categoryId === c.id ? '#ea580c' : '#cbd5e1'}
                  onPress={() => setCategoryId(c.id)}
                >
                  <Text
                    fontSize={12}
                    fontWeight="700"
                    color={categoryId === c.id ? '#ffffff' : '#475569'}
                  >
                    {c.name}
                  </Text>
                </Button>
              ))}
            </XStack>
          </YStack>

          {/* Mô tả món ăn */}
          <YStack gap={4}>
            <Text fontSize={13} fontWeight="700" color="#0f172a">
              Mô tả ngắn:
            </Text>
            <TextInput
              style={{
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#cbd5e1',
                borderRadius: 10,
                padding: 10,
                height: 70,
                textAlignVertical: 'top',
                fontSize: 14,
              }}
              placeholder="Giới thiệu hương vị, nét đặc trưng của món ăn..."
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </YStack>

          {/* Ảnh món ăn & Nút chọn từ máy */}
          <YStack gap={4}>
            <Text fontSize={13} fontWeight="700" color="#0f172a">
              Hình ảnh món ăn:
            </Text>
            <XStack gap={8} alignItems="center">
              <Input
                flex={1}
                size="sm"
                backgroundColor="#ffffff"
                placeholder="Dán link ảnh online..."
                value={imageUrl}
                onChangeText={setImageUrl}
              />
              <Button
                size="sm"
                backgroundColor="#ffedd5"
                borderWidth={1}
                borderColor="#fed7aa"
                onPress={handlePickImage}
              >
                <XStack alignItems="center" gap={4}>
                  <UploadCloud size={14} color="#ea580c" />
                  <Text fontSize={11} fontWeight="700" color="#ea580c">
                    Thư viện
                  </Text>
                </XStack>
              </Button>
            </XStack>
          </YStack>

          {/* 4 Chỉ số: Thời gian, Calo, Khẩu phần, Độ khó */}
          <XStack gap={8}>
            <YStack flex={1} gap={4}>
              <Text fontSize={12} fontWeight="600" color="#0f172a">
                Thời gian (phút):
              </Text>
              <Input
                size="sm"
                backgroundColor="#ffffff"
                keyboardType="numeric"
                value={cookTime}
                onChangeText={setCookTime}
              />
            </YStack>

            <YStack flex={1} gap={4}>
              <Text fontSize={12} fontWeight="600" color="#0f172a">
                Calo (kcal):
              </Text>
              <Input
                size="sm"
                backgroundColor="#ffffff"
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
              />
            </YStack>

            <YStack flex={1} gap={4}>
              <Text fontSize={12} fontWeight="600" color="#0f172a">
                Khẩu phần:
              </Text>
              <Input
                size="sm"
                backgroundColor="#ffffff"
                keyboardType="numeric"
                value={servings}
                onChangeText={setServings}
              />
            </YStack>
          </XStack>

          {/* Chọn Độ khó */}
          <YStack gap={4}>
            <Text fontSize={13} fontWeight="700" color="#0f172a">
              Độ khó:
            </Text>
            <XStack gap={8}>
              {(['Dễ', 'Trung bình', 'Khó'] as const).map((level) => (
                <Button
                  key={level}
                  flex={1}
                  size="sm"
                  backgroundColor={difficulty === level ? '#059669' : '#ffffff'}
                  borderWidth={1}
                  borderColor={difficulty === level ? '#059669' : '#cbd5e1'}
                  onPress={() => setDifficulty(level)}
                >
                  <Text
                    fontSize={12}
                    fontWeight="700"
                    color={difficulty === level ? '#ffffff' : '#475569'}
                  >
                    {level}
                  </Text>
                </Button>
              ))}
            </XStack>
          </YStack>

          {/* Danh sách nguyên liệu */}
          <Card borderWidth={1} borderColor="#e2e8f0" borderRadius={16} padding={14} backgroundColor="#ffffff" marginTop={8}>
            <XStack justifyContent="space-between" alignItems="center" marginBottom={8}>
              <Text fontSize={14} fontWeight="800" color="#0f172a">
                Nguyên liệu ({ingredients.length}):
              </Text>
              <Button
                size="sm"
                backgroundColor="#ffedd5"
                borderWidth={1}
                borderColor="#fed7aa"
                onPress={addIngredientField}
              >
                <XStack alignItems="center" gap={4}>
                  <Plus size={13} color="#ea580c" />
                  <Text fontSize={11} fontWeight="700" color="#ea580c">
                    Thêm dòng
                  </Text>
                </XStack>
              </Button>
            </XStack>

            <YStack gap={8}>
              {ingredients.map((ing, idx) => (
                <XStack key={idx} gap={8} alignItems="center">
                  <Input
                    flex={2}
                    size="sm"
                    placeholder="Tên nguyên liệu (VD: Thịt bò)"
                    value={ing.name}
                    onChangeText={(val) => updateIngredient(idx, 'name', val)}
                  />
                  <Input
                    flex={1}
                    size="sm"
                    placeholder="Lượng (VD: 300g)"
                    value={ing.amount}
                    onChangeText={(val) => updateIngredient(idx, 'amount', val)}
                  />
                  {ingredients.length > 1 && (
                    <TouchableOpacity onPress={() => removeIngredientField(idx)}>
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </XStack>
              ))}
            </YStack>
          </Card>

          {/* Danh sách các bước làm */}
          <Card borderWidth={1} borderColor="#e2e8f0" borderRadius={16} padding={14} backgroundColor="#ffffff" marginTop={8}>
            <XStack justifyContent="space-between" alignItems="center" marginBottom={8}>
              <Text fontSize={14} fontWeight="800" color="#0f172a">
                Các bước thực hiện ({steps.length}):
              </Text>
              <Button
                size="sm"
                backgroundColor="#ffedd5"
                borderWidth={1}
                borderColor="#fed7aa"
                onPress={addStepField}
              >
                <XStack alignItems="center" gap={4}>
                  <Plus size={13} color="#ea580c" />
                  <Text fontSize={11} fontWeight="700" color="#ea580c">
                    Thêm bước
                  </Text>
                </XStack>
              </Button>
            </XStack>

            <YStack gap={10}>
              {steps.map((st, idx) => (
                <XStack key={idx} gap={8} alignItems="flex-start">
                  <YStack
                    width={26}
                    height={26}
                    borderRadius={13}
                    backgroundColor="#ea580c"
                    justifyContent="center"
                    alignItems="center"
                    marginTop={6}
                  >
                    <Text color="#ffffff" fontWeight="800" fontSize={11}>
                      {st.step}
                    </Text>
                  </YStack>

                  <Input
                    flex={1}
                    size="sm"
                    placeholder={`Nội dung bước ${st.step}...`}
                    value={st.instruction}
                    onChangeText={(val) => updateStep(idx, val)}
                  />

                  {steps.length > 1 && (
                    <TouchableOpacity
                      style={{ marginTop: 8 }}
                      onPress={() => removeStepField(idx)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </XStack>
              ))}
            </YStack>
          </Card>
        </YStack>

        {/* Nút Đăng công thức */}
        <Button
          size="lg"
          marginTop={16}
          backgroundColor="#ea580c"
          borderRadius={14}
          disabled={isSubmitting}
          onPress={handleSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <XStack alignItems="center" gap={8}>
              <CheckCircle size={18} color="#ffffff" />
              <Text color="#ffffff" fontWeight="800" fontSize={15}>
                Đăng Công Thức Lên Máy Chủ
              </Text>
            </XStack>
          )}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};
