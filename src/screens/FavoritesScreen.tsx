import React from 'react';
import { ScrollView, useWindowDimensions, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Heart, Utensils } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/recipe';
import { useAppSelector } from '../redux/store';
import { selectFavorites } from '../redux/favoriteSlice';
import { RecipeCard } from '../components/RecipeCard';

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const favorites = useAppSelector(selectFavorites);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Header */}
        <YStack gap={4} marginBottom={16}>
          <XStack alignItems="center" gap={8}>
            <Heart size={22} color="#e11d48" fill="#e11d48" />
            <Text fontSize={22} fontWeight="800" color="#0f172a">
              Món Ăn Yêu Thích ({favorites.length})
            </Text>
          </XStack>
          <Text fontSize={13} color="#64748b">
            Danh sách công thức bạn đã lưu lại để trổ tài nấu nướng (Quản lý qua Redux Toolkit).
          </Text>
        </YStack>

        {favorites.length === 0 ? (
          <YStack paddingVertical={48} alignItems="center" gap={12}>
            <View style={styles.emptyIconCircle}>
              <Heart size={40} color="#e11d48" />
            </View>
            <Text fontSize={16} fontWeight="700" color="#334155">
              Chưa có món ăn yêu thích nào
            </Text>
            <Text fontSize={13} color="#94a3b8" textAlign="center" maxWidth={280}>
              Hãy dạo qua Trang chủ và bấm vào biểu tượng trái tim để lưu lại những món bạn thích nhé!
            </Text>

            <Button
              size="sm"
              marginTop={8}
              backgroundColor="#ea580c"
              onPress={() => (navigation as any).navigate('HomeTab')}
            >
              <XStack alignItems="center" gap={6}>
                <Utensils size={16} color="#ffffff" />
                <Text color="#ffffff" fontWeight="700">
                  Khám phá món ngon ngay
                </Text>
              </XStack>
            </Button>
          </YStack>
        ) : (
          <XStack
            flexWrap="wrap"
            justifyContent={isTablet ? 'space-between' : 'center'}
          >
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isTabletOrLandscape={isTablet}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffe4e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
