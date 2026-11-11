import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Compass, Sparkles, ShoppingCart, Heart } from 'lucide-react-native';
import { BottomTabParamList } from '../types/recipe';
import { HomeScreen } from '../screens/HomeScreen';
import { AIChefScreen } from '../screens/AIChefScreen';
import { ShoppingListScreen } from '../screens/ShoppingListScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { useAppSelector } from '../redux/store';
import { selectFavorites } from '../redux/favoriteSlice';
import { selectShoppingItems } from '../redux/shoppingSlice';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabs: React.FC = () => {
  const favorites = useAppSelector(selectFavorites);
  const shoppingItems = useAppSelector(selectShoppingItems);

  return (
    <Tab.Navigator
      id="main-tabs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ea580c',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: 60,
          paddingBottom: 8,
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
