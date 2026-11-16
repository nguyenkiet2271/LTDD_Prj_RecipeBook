import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/recipe';
import { BottomTabs } from './BottomTabs';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { CookingStepScreen } from '../screens/CookingStepScreen';
import { CreateRecipeScreen } from '../screens/CreateRecipeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { restoreSession, selectAuthHydrated, selectUser } from '../redux/authSlice';
import { selectIsDarkMode } from '../redux/themeSlice';
import { loadUserData } from '../redux/userDataThunks';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const hydrated = useAppSelector(selectAuthHydrated);
  const isDarkMode = useAppSelector(selectIsDarkMode);

  // Mở app: khôi phục phiên đăng nhập đã lưu
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Đăng nhập xong (hoặc mở lại app đã đăng nhập): tải dữ liệu cá nhân từ database
  useEffect(() => {
    if (user?.id) dispatch(loadUserData(user.id));
  }, [dispatch, user?.id]);

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
        }}
      >
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      id="root-stack"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {user ? (
        // Đã đăng nhập
        <>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
          <Stack.Screen name="CookingStep" component={CookingStepScreen} />
          <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        // Chưa đăng nhập
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
