import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Button, Card } from 'tamagui';
import { AppInput as Input } from '../components/AppInput';
import { Refrigerator, Plus, Trash2, Pencil, Check, Snowflake, CalendarClock } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  addFridgeItems,
  removeFridgeItem,
  selectFridgeItems,
  updateFridgeItem,
} from '../redux/fridgeSlice';
import { selectIsDarkMode } from '../redux/themeSlice';
import { FridgeItem } from '../types/recipe';
import { addDaysISO, daysUntil, formatVN, parseISODate, parseVN, toISODate } from '../utils/date';

// iOS có bàn phím số kèm dấu '/', Android thì dùng bàn phím thường
const DATE_KEYBOARD = Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default';

const QUICK_DAYS = [
  { label: '3 ngày', days: 3 },
  { label: '1 tuần', days: 7 },
  { label: '2 tuần', days: 14 },
  { label: '1 tháng', days: 30 },
  { label: '3 tháng', days: 90 },
];

type Status = 'expired' | 'soon' | 'good';

const getStatus = (days: number): Status => (days < 0 ? 'expired' : days <= 3 ? 'soon' : 'good');

const statusLabel = (days: number): string => {
  if (days < 0) return `Hết hạn ${-days} ngày trước`;
  if (days === 0) return 'Hết hạn hôm nay';
  return `Còn ${days} ngày`;
};

// Cộng thêm n ngày vào ngày đang nhập (nếu ô trống/sai định dạng thì cộng từ hôm nay).
// Nhờ vậy bấm nút nhanh nhiều lần sẽ cộng dồn: +1 tuần, +1 tuần => 14 ngày...
const addDaysToText = (text: string, days: number): string => {
  const baseIso = parseVN(text) ?? addDaysISO(0);
  const d = parseISODate(baseIso);
  d.setDate(d.getDate() + days);
  return formatVN(toISODate(d));
};

export const FridgeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectFridgeItems);
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [expiryText, setExpiryText] = useState(formatVN(addDaysISO(7)));
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'soon' | 'expired'>('all');

  // Đang sửa hạn của món nào
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const palette = {
    expired: { fg: '#dc2626', bg: isDarkMode ? '#7f1d1d' : '#fee2e2', border: isDarkMode ? '#b91c1c' : '#fca5a5' },
    soon: { fg: '#d97706', bg: isDarkMode ? '#78350f' : '#fef3c7', border: isDarkMode ? '#b45309' : '#fcd34d' },
    good: { fg: '#059669', bg: isDarkMode ? '#064e3b' : '#d1fae5', border: isDarkMode ? '#047857' : '#6ee7b7' },
  } as const;

  const text1 = isDarkMode ? '#f8fafc' : '#0f172a';
  const text2 = isDarkMode ? '#94a3b8' : '#64748b';
  const cardBg = isDarkMode ? '#1e293b' : '#ffffff';
  const cardBorder = isDarkMode ? '#334155' : '#e2e8f0';
  const inputBg = isDarkMode ? '#0f172a' : '#f8fafc';

  const enriched = items
    .map((item) => ({ item, days: daysUntil(item.expiryDate) }))
    .sort((a, b) => a.days - b.days);

  const expiredCount = enriched.filter((e) => getStatus(e.days) === 'expired').length;
  const soonCount = enriched.filter((e) => getStatus(e.days) === 'soon').length;
  const goodCount = enriched.length - expiredCount - soonCount;

  const visible = enriched.filter((e) => {
    const s = getStatus(e.days);
    if (filter === 'expired') return s === 'expired';
    if (filter === 'soon') return s === 'soon';
    return true;
  });

  const handleAdd = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên thực phẩm.');
      return;
    }
    const iso = parseVN(expiryText);
    if (!iso) {
      setError('Hạn dùng không hợp lệ. Nhập theo dạng ngày/tháng/năm, ví dụ 25/12/2026.');
      return;
    }
    setError(null);
    dispatch(addFridgeItems([{ name: name.trim(), amount: amount.trim() || '1 phần', expiryDate: iso }]));
    setName('');
    setAmount('');
    setExpiryText(formatVN(addDaysISO(7)));
  };

  const startEdit = (item: FridgeItem) => {
    setEditingId(item.id);
    setEditText(formatVN(item.expiryDate));
    setEditError(null);
  };

  const saveEdit = (item: FridgeItem) => {
    const iso = parseVN(editText);
    if (!iso) {
      setEditError('Hạn dùng không hợp lệ (ngày/tháng/năm).');
      return;
    }
    dispatch(updateFridgeItem({ ...item, expiryDate: iso }));
    setEditingId(null);
  };

  const handleDelete = (item: FridgeItem) => {
    Alert.alert('Xóa khỏi tủ lạnh', `Bạn muốn xóa "${item.name}" khỏi tủ lạnh?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => dispatch(removeFridgeItem(item.id)) },
    ]);
  };

  // Lưu ý: đây là HÀM render (không phải component) để các nút không bị tạo lại mỗi lần state đổi,
  // nhờ đó có thể bấm liên tục nhiều lần.
  const renderQuickChips = (onAdd: (days: number) => void, onReset: () => void) => (
    <XStack flexWrap="wrap" gap={6}>
      {QUICK_DAYS.map((q) => (
        <TouchableOpacity
          key={q.days}
          onPress={() => onAdd(q.days)}
          activeOpacity={0.6}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: isDarkMode ? '#9a3412' : '#fed7aa',
            backgroundColor: isDarkMode ? '#431407' : '#ffedd5',
          }}
        >
          <Text fontSize={11} fontWeight="700" color="#ea580c">
            +{q.label}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={onReset}
        activeOpacity={0.6}
        hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: cardBorder,
          backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9',
        }}
      >
        <Text fontSize={11} fontWeight="700" color={text2}>
          Đặt lại (hôm nay)
        </Text>
      </TouchableOpacity>
    </XStack>
  );

  const filterButton = (key: 'all' | 'soon' | 'expired', label: string) => (
    <Button
      key={key}
      size="sm"
      flex={1}
      borderRadius={10}
      backgroundColor={filter === key ? '#ea580c' : isDarkMode ? '#1e293b' : '#f1f5f9'}
      borderWidth={1}
      borderColor={filter === key ? '#ea580c' : cardBorder}
      onPress={() => setFilter(key)}
    >
      <Text fontSize={12} fontWeight="700" color={filter === key ? '#ffffff' : isDarkMode ? '#94a3b8' : '#475569'}>
        {label}
      </Text>
    </Button>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <YStack gap={4} marginBottom={12}>
          <XStack alignItems="center" gap={8}>
            <Refrigerator size={22} color="#ea580c" />
            <Text fontSize={22} fontWeight="800" color={text1}>
              Tủ Lạnh Của Tôi
            </Text>
          </XStack>
          <Text fontSize={13} color={text2}>
            Theo dõi hạn dùng thực phẩm để không lãng phí đồ ăn.
          </Text>
        </YStack>

        {/* 3 thống kê */}
        <XStack gap={8} marginBottom={12}>
          {(
            [
              { key: 'expired', label: 'Hết hạn', count: expiredCount },
              { key: 'soon', label: 'Sắp hết hạn', count: soonCount },
              { key: 'good', label: 'Còn tốt', count: goodCount },
            ] as const
          ).map((s) => (
            <YStack
              key={s.key}
              flex={1}
              alignItems="center"
              paddingVertical={10}
              borderRadius={14}
              backgroundColor={palette[s.key].bg}
              borderWidth={1}
              borderColor={palette[s.key].border}
            >
              <Text fontSize={20} fontWeight="800" color={palette[s.key].fg}>
                {s.count}
              </Text>
              <Text fontSize={11} fontWeight="700" color={palette[s.key].fg}>
                {s.label}
              </Text>
            </YStack>
          ))}
        </XStack>

        {/* Thêm thực phẩm */}
        <Card
          borderWidth={1}
          borderColor={cardBorder}
          borderRadius={16}
          padding={14}
          backgroundColor={cardBg}
          marginBottom={12}
        >
          <Text fontSize={13} fontWeight="700" color={text1} marginBottom={8}>
            Thêm thực phẩm vào tủ lạnh:
          </Text>

          <XStack gap={8} marginBottom={8}>
            <Input
              flex={2}
              size="sm"
              placeholder="Tên (VD: Sữa tươi, Thịt bò...)"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              value={name}
              onChangeText={(v) => {
                setName(v);
                setError(null);
              }}
              backgroundColor={inputBg}
              color={text1}
              borderColor={cardBorder}
              testID="fridge-name"
            />
            <Input
              flex={1}
              size="sm"
              placeholder="Số lượng"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              value={amount}
              onChangeText={setAmount}
              backgroundColor={inputBg}
              color={text1}
              borderColor={cardBorder}
              testID="fridge-amount"
            />
          </XStack>

          <Text fontSize={12} fontWeight="600" color={text1} marginBottom={4}>
            Hạn sử dụng (ngày/tháng/năm):
          </Text>
          <Input
            size="sm"
            placeholder="dd/mm/yyyy"
            placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
            value={expiryText}
            onChangeText={(v) => {
              setExpiryText(v);
              setError(null);
            }}
            keyboardType={DATE_KEYBOARD}
            backgroundColor={inputBg}
            color={text1}
            borderColor={cardBorder}
            testID="fridge-expiry"
          />
          <YStack marginTop={8}>
            {renderQuickChips(
              (days) => {
                setExpiryText((prev) => addDaysToText(prev, days));
                setError(null);
              },
              () => {
                setExpiryText(formatVN(addDaysISO(0)));
                setError(null);
              }
            )}
          </YStack>

          {error ? (
            <Text fontSize={12} color="#ef4444" fontWeight="600" marginTop={8}>
              {error}
            </Text>
          ) : null}

          <Button
            size="md"
            marginTop={12}
            backgroundColor="#ea580c"
            borderRadius={12}
            onPress={handleAdd}
            testID="fridge-add"
          >
            <XStack alignItems="center" gap={6}>
              <Plus size={16} color="#ffffff" />
              <Text color="#ffffff" fontWeight="800" fontSize={14}>
                Thêm vào tủ lạnh
              </Text>
            </XStack>
          </Button>
        </Card>

        {/* Bộ lọc */}
        <XStack gap={8} marginBottom={12}>
          {filterButton('all', `Tất cả (${items.length})`)}
          {filterButton('soon', `Sắp hết (${soonCount})`)}
          {filterButton('expired', `Hết hạn (${expiredCount})`)}
        </XStack>

        {/* Danh sách */}
        {visible.length === 0 ? (
          <YStack paddingVertical={40} alignItems="center" gap={8}>
            <Snowflake size={40} color={isDarkMode ? '#334155' : '#cbd5e1'} />
            <Text fontSize={15} fontWeight="700" color={text2}>
              {items.length === 0 ? 'Tủ lạnh đang trống' : 'Không có thực phẩm nào trong mục này'}
            </Text>
            {items.length === 0 && (
              <Text fontSize={12} color={isDarkMode ? '#64748b' : '#94a3b8'} textAlign="center">
                Thêm thực phẩm ở phía trên, hoặc bấm "Chuyển vào tủ lạnh" ở màn hình Đi chợ sau khi mua xong!
              </Text>
            )}
          </YStack>
        ) : (
          <YStack gap={8}>
            {visible.map(({ item, days }) => {
              const st = getStatus(days);
              const col = palette[st];
              const editing = editingId === item.id;
              return (
                <YStack
                  key={item.id}
                  backgroundColor={cardBg}
                  borderRadius={12}
                  padding={12}
                  borderWidth={1}
                  borderColor={st === 'good' ? cardBorder : col.border}
                  gap={8}
                >
                  <XStack alignItems="center" justifyContent="space-between" gap={8}>
                    <YStack flex={1} gap={2}>
                      <Text fontSize={14} fontWeight="700" color={text1}>
                        {item.name}{' '}
                        <Text fontSize={13} fontWeight="700" color="#ea580c">
                          · {item.amount}
                        </Text>
                      </Text>
                      <XStack alignItems="center" gap={4}>
                        <CalendarClock size={12} color={text2} />
                        <Text fontSize={11} color={text2}>
                          Hạn dùng: {formatVN(item.expiryDate)}
                        </Text>
                      </XStack>
                    </YStack>

                    <XStack
                      backgroundColor={col.bg}
                      borderRadius={10}
                      paddingHorizontal={8}
                      paddingVertical={4}
                      borderWidth={1}
                      borderColor={col.border}
                    >
                      <Text fontSize={11} fontWeight="800" color={col.fg}>
                        {statusLabel(days)}
                      </Text>
                    </XStack>

                    <TouchableOpacity onPress={() => (editing ? setEditingId(null) : startEdit(item))} hitSlop={8}>
                      <Pencil size={16} color={isDarkMode ? '#64748b' : '#94a3b8'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={8}>
                      <Trash2 size={16} color={isDarkMode ? '#64748b' : '#94a3b8'} />
                    </TouchableOpacity>
                  </XStack>

                  {editing && (
                    <YStack gap={8} paddingTop={8} borderTopWidth={1} borderTopColor={cardBorder}>
                      <XStack gap={8} alignItems="center">
                        <Input
                          flex={1}
                          size="sm"
                          placeholder="dd/mm/yyyy"
                          placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
                          value={editText}
                          onChangeText={(v) => {
                            setEditText(v);
                            setEditError(null);
                          }}
                          keyboardType={DATE_KEYBOARD}
                          backgroundColor={inputBg}
                          color={text1}
                          borderColor={cardBorder}
                        />
                        <Button size="sm" backgroundColor="#ea580c" borderRadius={10} onPress={() => saveEdit(item)}>
                          <XStack alignItems="center" gap={4}>
                            <Check size={14} color="#ffffff" />
                            <Text color="#ffffff" fontWeight="800" fontSize={12}>
                              Lưu
                            </Text>
                          </XStack>
                        </Button>
                      </XStack>
                      {renderQuickChips(
                        (d) => {
                          setEditText((prev) => addDaysToText(prev, d));
                          setEditError(null);
                        },
                        () => {
                          setEditText(formatVN(addDaysISO(0)));
                          setEditError(null);
                        }
                      )}
                      {editError ? (
                        <Text fontSize={12} color="#ef4444" fontWeight="600">
                          {editError}
                        </Text>
                      ) : null}
                    </YStack>
                  )}
                </YStack>
              );
            })}
          </YStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};