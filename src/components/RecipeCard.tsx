import React from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { Card, XStack, YStack, Text } from 'tamagui';
import { Heart, Clock, Flame, ChefHat } from 'lucide-react-native';
import { Recipe } from '../types/recipe';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { selectIsFavorite, toggleFavorite } from '../redux/favoriteSlice';
import { selectIsDarkMode } from '../redux/themeSlice';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  isTabletOrLandscape?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  isTabletOrLandscape = false,
}) => {
  const dispatch = useAppDispatch();
  const isFav = useAppSelector(selectIsFavorite(recipe.id));
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe));
  };

  const imageUri = recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';

  return (
    <Card
      style={{ elevation: 2 }}
      backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
      borderRadius={16}
      overflow="hidden"
      borderWidth={1}
      borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
      marginBottom={14}
      width={isTabletOrLandscape ? '48%' : '100%'}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <View style={styles.imageContainer}>
          {/* Ảnh món ăn */}
          <Image
            source={{ uri: imageUri }}
            style={styles.recipeImage}
            resizeMode="cover"
          />

          {/* Nút thả tim */}
          <TouchableOpacity
            style={[
              styles.heartButton,
              { backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)' },
            ]}
            onPress={handleToggleFavorite}
            activeOpacity={0.8}
          >
            <Heart
              size={18}
              color={isFav ? '#e11d48' : isDarkMode ? '#94a3b8' : '#64748b'}
              fill={isFav ? '#e11d48' : 'none'}
            />
          </TouchableOpacity>

          {/* Badge độ khó */}
          <View style={styles.difficultyBadge}>
            <Text color="#ffffff" fontSize={11} fontWeight="700">
              {recipe.difficulty}
            </Text>
          </View>
        </View>

        {/* Nội dung card */}
        <YStack padding={14} gap={6}>
          <Text
            fontSize={16}
            fontWeight="700"
            color={isDarkMode ? '#f8fafc' : '#0f172a'}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {recipe.title}
          </Text>

          <Text
            fontSize={12}
            color={isDarkMode ? '#94a3b8' : '#64748b'}
            numberOfLines={2}
            ellipsizeMode="tail"
            lineHeight={18}
          >
            {recipe.description}
          </Text>

          {/* Thông số món ăn: Thời gian, Calo, Tác giả */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginTop={8}
            paddingTop={8}
            borderTopWidth={1}
            borderTopColor={isDarkMode ? '#334155' : '#f1f5f9'}
          >
            <XStack alignItems="center" gap={4}>
              <Clock size={13} color="#ea580c" />
              <Text fontSize={11} color={isDarkMode ? '#94a3b8' : '#64748b'} fontWeight="600">
                {recipe.cook_time} phút
              </Text>
            </XStack>

            <XStack alignItems="center" gap={4}>
              <Flame size={13} color="#dc2626" />
              <Text fontSize={11} color={isDarkMode ? '#94a3b8' : '#64748b'} fontWeight="600">
                {recipe.calories} kcal
              </Text>
            </XStack>

            <XStack alignItems="center" gap={4}>
              <ChefHat size={13} color="#059669" />
              <Text fontSize={11} color={isDarkMode ? '#94a3b8' : '#64748b'} fontWeight="600" numberOfLines={1}>
                {recipe.author_name === 'Chef Tuấn' ? 'Chef Huy' : (recipe.author_name || 'Chef Huy')}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
    backgroundColor: '#f1f5f9',
  },
  recipeImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e2e8f0',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
});
