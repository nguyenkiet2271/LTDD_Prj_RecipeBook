import React from 'react';
import './src/utils/alert'; // Làm Alert.alert hoạt động trên trình duyệt (web)
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { TamaguiProvider, Theme } from 'tamagui';

import tamaguiConfig from './tamagui.config';
import { store, useAppSelector } from './src/redux/store';
import { selectIsDarkMode } from './src/redux/themeSlice';
import { RootNavigator } from './src/navigation/RootNavigator';

function AppContent() {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const currentTheme = isDarkMode ? 'dark' : 'light';

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={currentTheme}>
      <Theme name={currentTheme}>
        <SafeAreaProvider>
          <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </Theme>
    </TamaguiProvider>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <AppContent />
    </ReduxProvider>
  );
}
