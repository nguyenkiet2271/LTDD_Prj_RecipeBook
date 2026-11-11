import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text } from 'tamagui';
import { Category } from '../types/recipe';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
    >
      {/* Nút "Tất cả" */}
      <Button
        size="sm"
        borderRadius={20}
        backgroundColor={selectedCategoryId === null ? '#ea580c' : '#f1f5f9'}
        borderWidth={1}
        borderColor={selectedCategoryId === null ? '#ea580c' : '#e2e8f0'}
        onPress={() => onSelectCategory(null)}
      >
        <Text
          fontSize={13}
          fontWeight="700"
          color={selectedCategoryId === null ? '#ffffff' : '#475569'}
        >
          Tất cả món
        </Text>
      </Button>

      {/* Danh sách các danh mục từ Supabase */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <Button
            key={cat.id}
            size="sm"
            borderRadius={20}
            backgroundColor={isSelected ? '#ea580c' : '#f1f5f9'}
            borderWidth={1}
            borderColor={isSelected ? '#ea580c' : '#e2e8f0'}
            onPress={() => onSelectCategory(cat.id)}
          >
            <Text
              fontSize={13}
              fontWeight="700"
              color={isSelected ? '#ffffff' : '#475569'}
            >
              {cat.name}
            </Text>
          </Button>
        );
      })}
    </ScrollView>
  );
};
