import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Button, Card } from 'tamagui';
import { AppInput as Input } from '../components/AppInput';
import {
  ShoppingCart,
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  CheckSquare,
  Refrigerator,
} from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  selectShoppingItems,
  toggleItemChecked,
  removeShoppingItem,
  clearCompletedItems,
  addCustomItem,
} from '../redux/shoppingSlice';
import { selectIsDarkMode } from '../redux/themeSlice';
import { addFridgeItems } from '../redux/fridgeSlice';
import { addDaysISO, formatVN } from '../utils/date';

export const ShoppingListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectShoppingItems);
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleAddItem = () => {
    if (customName.trim() === '') {
      Alert.alert('Nhắc nhở', 'Vui lòng nhập tên nguyên liệu cần mua!');
      return;
    }
    dispatch(addCustomItem({ name: customName.trim(), amount: customAmount.trim() || '1 phần' }));
    setCustomName('');
    setCustomAmount('');
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'pending') return !item.checked;
    if (filter === 'completed') return item.checked;
    return true;
  });

  const completedCount = items.filter((i) => i.checked).length;

  // Chuyển các món đã mua vào tủ lạnh (hạn tạm tính 7 ngày, chỉnh lại ở màn Tủ lạnh) rồi xóa khỏi danh sách đi chợ
  const handleMoveToFridge = () => {
    const bought = items.filter((i) => i.checked);
    if (bought.length === 0) return;
    const defaultExpiry = addDaysISO(7);
    dispatch(
      addFridgeItems(bought.map((i) => ({ name: i.name, amount: i.amount, expiryDate: defaultExpiry })))
    );
    dispatch(clearCompletedItems());
    Alert.alert(
      'Đã chuyển vào tủ lạnh',
      `${bought.length} món đã được thêm vào tủ lạnh với hạn dùng tạm tính ${formatVN(defaultExpiry)}. Vào tab "Tủ lạnh" để chỉnh lại hạn dùng chính xác.`
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Header */}
        <YStack gap={4} marginBottom={12}>
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap={8}>
              <ShoppingCart size={22} color="#ea580c" />
              <Text fontSize={22} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                Danh Sách Đi Chợ
              </Text>
            </XStack>

            {completedCount > 0 && (
              <Button
                size="sm"
                backgroundColor={isDarkMode ? '#7f1d1d' : '#fee2e2'}
                borderWidth={1}
                borderColor={isDarkMode ? '#b91c1c' : '#fca5a5'}
                borderRadius={8}
                onPress={() => dispatch(clearCompletedItems())}
              >
                <XStack alignItems="center" gap={4}>
                  <Trash2 size={12} color="#ef4444" />
                  <Text fontSize={11} color="#ef4444" fontWeight="700">
                    Xóa đã mua ({completedCount})
                  </Text>
                </XStack>
              </Button>
            )}
          </XStack>
          <Text fontSize={13} color={isDarkMode ? '#94a3b8' : '#64748b'}>
            Quản lý nguyên liệu cần mua sắm khi chuẩn bị vào bếp.
          </Text>
        </YStack>

        {/* Ô thêm nguyên liệu nhanh */}
        <Card
          borderWidth={1}
          borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
          borderRadius={16}
          padding={14}
          backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
          marginBottom={12}
        >
          <Text fontSize={13} fontWeight="700" color={isDarkMode ? '#f8fafc' : '#0f172a'} marginBottom={8}>
            Thêm đồ cần mua:
          </Text>
          <XStack gap={8} alignItems="center">
            <Input
              flex={2}
              size="sm"
              placeholder="Tên đồ cần mua (VD: Nước tương...)"
              value={customName}
              onChangeText={setCustomName}
              backgroundColor={isDarkMode ? '#0f172a' : '#f8fafc'}
              color={isDarkMode ? '#f8fafc' : '#0f172a'}
              borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
            />
            <Input
              flex={1}
              size="sm"
              placeholder="Số lượng"
              value={customAmount}
              onChangeText={setCustomAmount}
              onSubmitEditing={handleAddItem}
              backgroundColor={isDarkMode ? '#0f172a' : '#f8fafc'}
              color={isDarkMode ? '#f8fafc' : '#0f172a'}
              borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
            />
            <Button
              size="sm"
              backgroundColor="#ea580c"
              onPress={handleAddItem}
            >
              <Plus size={18} color="#ffffff" />
            </Button>
          </XStack>
        </Card>

        {/* Chuyển đồ đã mua vào tủ lạnh */}
        {completedCount > 0 && (
          <Button
            size="md"
            marginBottom={12}
            backgroundColor={isDarkMode ? '#064e3b' : '#d1fae5'}
            borderWidth={1}
            borderColor={isDarkMode ? '#047857' : '#6ee7b7'}
            borderRadius={12}
            onPress={handleMoveToFridge}
            testID="move-to-fridge"
          >
            <XStack alignItems="center" gap={6}>
              <Refrigerator size={16} color="#059669" />
              <Text fontSize={13} fontWeight="800" color="#059669">
                Chuyển {completedCount} món đã mua vào tủ lạnh
              </Text>
            </XStack>
          </Button>
        )}

        {/* Bộ lọc All / Pending / Completed */}
        <XStack gap={8} marginBottom={12}>
          <Button
            size="sm"
            flex={1}
            borderRadius={10}
            backgroundColor={filter === 'all' ? '#ea580c' : isDarkMode ? '#1e293b' : '#f1f5f9'}
            borderWidth={1}
            borderColor={filter === 'all' ? '#ea580c' : isDarkMode ? '#334155' : '#e2e8f0'}
            onPress={() => setFilter('all')}
          >
            <Text
              fontSize={12}
              fontWeight="700"
              color={filter === 'all' ? '#ffffff' : isDarkMode ? '#94a3b8' : '#475569'}
            >
              Tất cả ({items.length})
            </Text>
          </Button>

          <Button
            size="sm"
            flex={1}
            borderRadius={10}
            backgroundColor={filter === 'pending' ? '#ea580c' : isDarkMode ? '#1e293b' : '#f1f5f9'}
            borderWidth={1}
            borderColor={filter === 'pending' ? '#ea580c' : isDarkMode ? '#334155' : '#e2e8f0'}
            onPress={() => setFilter('pending')}
          >
            <Text
              fontSize={12}
              fontWeight="700"
              color={filter === 'pending' ? '#ffffff' : isDarkMode ? '#94a3b8' : '#475569'}
            >
              Chưa mua ({items.length - completedCount})
            </Text>
          </Button>

          <Button
            size="sm"
            flex={1}
            borderRadius={10}
            backgroundColor={filter === 'completed' ? '#ea580c' : isDarkMode ? '#1e293b' : '#f1f5f9'}
            borderWidth={1}
            borderColor={filter === 'completed' ? '#ea580c' : isDarkMode ? '#334155' : '#e2e8f0'}
            onPress={() => setFilter('completed')}
          >
            <Text
              fontSize={12}
              fontWeight="700"
              color={filter === 'completed' ? '#ffffff' : isDarkMode ? '#94a3b8' : '#475569'}
            >
              Đã mua ({completedCount})
            </Text>
          </Button>
        </XStack>

        {/* Danh sách các món đồ đi chợ */}
        {filteredItems.length === 0 ? (
          <YStack paddingVertical={40} alignItems="center" gap={8}>
            <CheckSquare size={40} color={isDarkMode ? '#334155' : '#cbd5e1'} />
            <Text fontSize={15} fontWeight="700" color={isDarkMode ? '#94a3b8' : '#64748b'}>
              Không có món đồ nào trong danh sách
            </Text>
            <Text fontSize={12} color={isDarkMode ? '#64748b' : '#94a3b8'} textAlign="center">
              Bạn có thể thêm từ trang Chi tiết món ăn hoặc tự gõ vào ô phía trên!
            </Text>
          </YStack>
        ) : (
          <YStack gap={8}>
            {filteredItems.map((item) => (
              <XStack
                key={item.id}
                backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
                borderRadius={12}
                padding={12}
                alignItems="center"
                justifyContent="space-between"
                borderWidth={1}
                borderColor={item.checked ? (isDarkMode ? '#334155' : '#e2e8f0') : (isDarkMode ? '#475569' : '#cbd5e1')}
              >
                <TouchableOpacity
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}
                  onPress={() => dispatch(toggleItemChecked(item.id))}
                  activeOpacity={0.7}
                >
                  {item.checked ? (
                    <CheckCircle2 size={20} color="#059669" />
                  ) : (
                    <Circle size={20} color={isDarkMode ? '#64748b' : '#94a3b8'} />
                  )}

                  <YStack flex={1}>
                    <Text
                      fontSize={14}
                      fontWeight="600"
                      color={item.checked ? (isDarkMode ? '#64748b' : '#94a3b8') : (isDarkMode ? '#f8fafc' : '#0f172a')}
                      textDecorationLine={item.checked ? 'line-through' : 'none'}
                    >
                      {item.name}
                    </Text>
                    {item.recipeTitle && (
                      <Text fontSize={11} color={isDarkMode ? '#64748b' : '#94a3b8'}>
                        Từ món: {item.recipeTitle}
                      </Text>
                    )}
                  </YStack>
                </TouchableOpacity>

                <XStack alignItems="center" gap={12}>
                  <Text
                    fontSize={13}
                    fontWeight="700"
                    color={item.checked ? (isDarkMode ? '#64748b' : '#94a3b8') : '#ea580c'}
                  >
                    {item.amount}
                  </Text>

                  <TouchableOpacity
                    onPress={() => dispatch(removeShoppingItem(item.id))}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color={isDarkMode ? '#64748b' : '#94a3b8'} />
                  </TouchableOpacity>
                </XStack>
              </XStack>
            ))}
          </YStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
