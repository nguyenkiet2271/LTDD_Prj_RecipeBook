import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Compass, Sparkles, ShoppingCart, Heart, Refrigerator } from 'lucide-react-native';
import { BottomTabParamList } from '../types/recipe';
import { HomeScreen } from '../screens/HomeScreen';
import { AIChefScreen } from '../screens/AIChefScreen';
import { ShoppingListScreen } from '../screens/ShoppingListScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { FridgeScreen } from '../screens/FridgeScreen';
import { useAppSelector } from '../redux/store';
import { selectFavorites } from '../redux/favoriteSlice';
import { selectShoppingItems } from '../redux/shoppingSlice';
import { selectIsDarkMode } from '../redux/themeSlice';
import { selectFridgeItems } from '../redux/fridgeSlice';
import { daysUntil } from '../utils/date';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabs: React.FC = () => {
  const favorites = useAppSelector(selectFavorites);
  const shoppingItems = useAppSelector(selectShoppingItems);
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const fridgeItems = useAppSelector(selectFridgeItems);
  // Số thực phẩm đã hết hạn hoặc còn <= 3 ngày (hiện trên tab Tủ lạnh)
  const fridgeAlerts = fridgeItems.filter((i) => daysUntil(i.expiryDate) <= 3).length;
  // Chừa chỗ cho thanh điều hướng / vạch home của điện thoại để tab bar không bị che
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      id="main-tabs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ea580c',
        tabBarInactiveTintColor: isDarkMode ? '#64748b' : '#94a3b8',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#1e293b' : '#f1f5f9',
          height: 52 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Khám phá',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size - 2} />,
        }}
      />

      <Tab.Screen
        name="AIChefTab"
        component={AIChefScreen}
        options={{
          tabBarLabel: 'Đầu Bếp AI',
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size - 2} />,
        }}
      />

      <Tab.Screen
        name="ShoppingTab"
        component={ShoppingListScreen}
        options={{
          tabBarLabel: 'Đi chợ',
          tabBarBadge: shoppingItems.length > 0 ? shoppingItems.length : undefined,
          tabBarBadgeStyle: { backgroundColor: '#ea580c', fontSize: 10 },
          tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size - 2} />,
        }}
      />

      <Tab.Screen
        name="FridgeTab"
        component={FridgeScreen}
        options={{
          tabBarLabel: 'Tủ lạnh',
          tabBarBadge: fridgeAlerts > 0 ? fridgeAlerts : undefined,
          tabBarBadgeStyle: { backgroundColor: '#dc2626', fontSize: 10 },
          tabBarIcon: ({ color, size }) => <Refrigerator color={color} size={size - 2} />,
        }}
      />

      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Yêu thích',
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          tabBarBadgeStyle: { backgroundColor: '#e11d48', fontSize: 10 },
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size - 2} />,
        }}
      />
    </Tab.Navigator>
  );
};
