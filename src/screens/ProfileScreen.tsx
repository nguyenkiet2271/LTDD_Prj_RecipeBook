import React, { useState } from 'react';
import {
  ScrollView,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
  Switch,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  Separator,
} from 'tamagui';
import {
  ArrowLeft,
  ChefHat,
  Heart,
  ShoppingCart,
  Moon,
  Sun,
  BookOpen,
  Bell,
  Scale,
  ShieldCheck,
  Star,
  LogOut,
  ChevronRight,
  Camera,
  Award,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/recipe';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { selectFavorites } from '../redux/favoriteSlice';
import { selectShoppingItems } from '../redux/shoppingSlice';
import { selectIsDarkMode, toggleTheme } from '../redux/themeSlice';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const shoppingItems = useAppSelector(selectShoppingItems);
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => Alert.alert('Thông báo', 'Đã đăng xuất tài khoản thành công!'),
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
      }}
      edges={['top']}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Header */}
        <XStack alignItems="center" gap={12} marginBottom={16}>
          <TouchableOpacity
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderWidth: 1,
              borderColor: isDarkMode ? '#334155' : '#e2e8f0',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={18} color={isDarkMode ? '#f8fafc' : '#0f172a'} />
          </TouchableOpacity>
          <Text fontSize={20} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
            Hồ Sơ Cá Nhân
          </Text>
        </XStack>

        {/* Thông tin người dùng (User Profile Card) */}
        <Card
          borderRadius={20}
          padding={16}
          backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
          borderWidth={1}
          borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
          marginBottom={16}
        >
          <XStack alignItems="center" gap={14}>
            {/* Avatar có nút đổi ảnh */}
            <View style={{ position: 'relative' }}>
              <View
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  backgroundColor: '#ffedd5',
                  borderWidth: 2,
                  borderColor: '#ea580c',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ChefHat size={34} color="#ea580c" />
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#ea580c',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: isDarkMode ? '#1e293b' : '#ffffff',
                }}
                onPress={() => Alert.alert('Ảnh đại diện', 'Chọn ảnh mới từ thư viện thiết bị')}
              >
                <Camera size={12} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <YStack flex={1} gap={2}>
              <XStack alignItems="center" gap={6}>
                <Text fontSize={18} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  Chef Huy
                </Text>
                <XStack
                  backgroundColor="#ffedd5"
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={10}
                  alignItems="center"
                  gap={3}
                >
                  <Award size={11} color="#ea580c" />
                  <Text fontSize={10} fontWeight="800" color="#ea580c">
                    PRO
                  </Text>
                </XStack>
              </XStack>

              <Text fontSize={13} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                huy.chefmate@gmail.com
              </Text>
              <Text fontSize={11} color="#059669" fontWeight="600">
                Thành viên Bếp Vàng • Ẩm thực gia
              </Text>
            </YStack>
          </XStack>

          {/* 3 Thống kê nhanh */}
          <XStack
            width="100%"
            marginTop={16}
            paddingTop={14}
            borderTopWidth={1}
            borderTopColor={isDarkMode ? '#334155' : '#f1f5f9'}
            justifyContent="space-around"
          >
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => navigation.navigate('CreateRecipe')}
            >
              <Text fontSize={16} fontWeight="800" color="#ea580c">
                8
              </Text>
              <Text fontSize={11} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                Món đã tạo
              </Text>
            </TouchableOpacity>

            <Separator vertical height={30} borderColor={isDarkMode ? '#334155' : '#e2e8f0'} />

            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => (navigation as any).navigate('FavoritesTab')}
            >
              <XStack alignItems="center" gap={4}>
                <Heart size={14} color="#e11d48" fill="#e11d48" />
                <Text fontSize={16} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  {favorites.length}
                </Text>
              </XStack>
              <Text fontSize={11} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                Món yêu thích
              </Text>
            </TouchableOpacity>

            <Separator vertical height={30} borderColor={isDarkMode ? '#334155' : '#e2e8f0'} />

            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => (navigation as any).navigate('ShoppingTab')}
            >
              <XStack alignItems="center" gap={4}>
                <ShoppingCart size={14} color="#ea580c" />
                <Text fontSize={16} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  {shoppingItems.length}
                </Text>
              </XStack>
              <Text fontSize={11} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                Đồ cần mua
              </Text>
            </TouchableOpacity>
          </XStack>
        </Card>

        {/* Mục 1: Quản lý công thức & Bếp cá nhân */}
        <Text fontSize={13} fontWeight="800" color={isDarkMode ? '#94a3b8' : '#64748b'} marginBottom={8} marginLeft={4}>
          QUẢN LÝ BẾP & CÔNG THỨC
        </Text>
        <Card
          borderWidth={1}
          borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
          borderRadius={16}
          backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
          marginBottom={16}
          overflow="hidden"
        >
          <TouchableOpacity
            style={{
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderBottomColor: isDarkMode ? '#334155' : '#f1f5f9',
            }}
            onPress={() => navigation.navigate('CreateRecipe')}
          >
            <XStack alignItems="center" gap={10}>
              <BookOpen size={18} color="#ea580c" />
              <Text fontSize={14} fontWeight="600" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                Đăng tải công thức mới
              </Text>
            </XStack>
            <ChevronRight size={18} color={isDarkMode ? '#64748b' : '#94a3b8'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onPress={() => (navigation as any).navigate('FavoritesTab')}
          >
            <XStack alignItems="center" gap={10}>
              <Heart size={18} color="#e11d48" />
              <Text fontSize={14} fontWeight="600" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                Bộ sưu tập món ăn đã lưu
              </Text>
            </XStack>
            <ChevronRight size={18} color={isDarkMode ? '#64748b' : '#94a3b8'} />
          </TouchableOpacity>
        </Card>

        {/* Mục 2: Cài đặt ứng dụng */}
        <Text fontSize={13} fontWeight="800" color={isDarkMode ? '#94a3b8' : '#64748b'} marginBottom={8} marginLeft={4}>
          CÀI ĐẶT ỨNG DỤNG
        </Text>
        <Card
          borderWidth={1}
          borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
          borderRadius={16}
          backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
          marginBottom={16}
          overflow="hidden"
        >
          {/* Chế độ Dark Mode */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            padding={14}
            borderBottomWidth={1}
            borderBottomColor={isDarkMode ? '#334155' : '#f1f5f9'}
          >
            <XStack alignItems="center" gap={10}>
              {isDarkMode ? <Moon size={18} color="#6366f1" /> : <Sun size={18} color="#f59e0b" />}
              <YStack>
                <Text fontSize={14} fontWeight="600" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  Chế độ ban đêm (Dark Mode)
                </Text>
                <Text fontSize={11} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                  Giao diện tối giúp dịu mắt khi nấu ăn ban đêm
                </Text>
              </YStack>
            </XStack>

            <Switch
              value={isDarkMode}
              onValueChange={() => {
                dispatch(toggleTheme());
              }}
              trackColor={{ false: '#cbd5e1', true: '#ea580c' }}
              thumbColor="#ffffff"
            />
          </XStack>

          {/* Thông báo nhắc giờ */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            padding={14}
            borderBottomWidth={1}
            borderBottomColor={isDarkMode ? '#334155' : '#f1f5f9'}
          >
            <XStack alignItems="center" gap={10}>
              <Bell size={18} color="#059669" />
              <YStack>
                <Text fontSize={14} fontWeight="600" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  Âm thanh hẹn giờ nấu ăn
                </Text>
                <Text fontSize={11} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                  Chuông báo động khi hết giờ nấu bước
                </Text>
              </YStack>
            </XStack>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#cbd5e1', true: '#ea580c' }}
              thumbColor="#ffffff"
            />
          </XStack>

          {/* Đơn vị đo lường */}
          <TouchableOpacity
            style={{
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onPress={() => Alert.alert('Đơn vị', 'Ứng dụng đang dùng hệ đo lường chuẩn: Gam (g) & Mililit (ml)')}
          >
            <XStack alignItems="center" gap={10}>
              <Scale size={18} color="#0284c7" />
              <Text fontSize={14} fontWeight="600" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                Đơn vị đo lường
              </Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <Text fontSize={12} color="#ea580c" fontWeight="600">
                Gam & Ml
              </Text>
              <ChevronRight size={18} color={isDarkMode ? '#64748b' : '#94a3b8'} />
            </XStack>
          </TouchableOpacity>
        </Card>

        {/* Mục 3: Hỗ trợ & Thông tin */}
        <Text fontSize={13} fontWeight="800" color={isDarkMode ? '#94a3b8' : '#64748b'} marginBottom={8} marginLeft={4}>
          HỖ TRỢ & PHÁP LÝ
        </Text>
        <Card
          borderWidth={1}
          borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
          borderRadius={16}
          backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
          marginBottom={20}
          overflow="hidden"
        >
          <TouchableOpacity
            style={{
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderBottomColor: isDarkMode ? '#334155' : '#f1f5f9',
            }}
            onPress={() => Alert.alert('Điều khoản', 'ChefMate tôn trọng bản quyền ẩm thực và bảo mật thông tin cá nhân của bạn.')}
          >
            <XStack alignItems="center" gap={10}>
              <ShieldCheck size={18} color="#64748b" />
              <Text fontSize={14} fontWeight="600" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                Chính sách bảo mật & Điều khoản
              </Text>
            </XStack>
            <ChevronRight size={18} color={isDarkMode ? '#64748b' : '#94a3b8'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onPress={() => Alert.alert('Đánh giá 5 sao', 'Cảm ơn bạn đã yêu thích ứng dụng ChefMate!')}
          >
            <XStack alignItems="center" gap={10}>
              <Star size={18} color="#f59e0b" />
              <Text fontSize={14} fontWeight="600" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                Đánh giá ứng dụng
              </Text>
            </XStack>
            <Text fontSize={12} color={isDarkMode ? '#64748b' : '#94a3b8'}>
              v1.0.0
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Nút Đăng xuất */}
        <Button
          size="lg"
          backgroundColor={isDarkMode ? '#7f1d1d' : '#fee2e2'}
          borderWidth={1}
          borderColor={isDarkMode ? '#b91c1c' : '#fca5a5'}
          borderRadius={14}
          onPress={handleLogout}
        >
          <XStack alignItems="center" gap={8}>
            <LogOut size={18} color="#dc2626" />
            <Text color="#dc2626" fontWeight="800" fontSize={14}>
              Đăng Xuất Tài Khoản
            </Text>
          </XStack>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};
