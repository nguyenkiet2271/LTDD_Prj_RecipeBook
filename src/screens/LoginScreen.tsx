import React, { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Button, Card } from 'tamagui';
import { ChefHat, Mail, Lock, LogIn, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/recipe';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { selectIsDarkMode } from '../redux/themeSlice';
import { login } from '../redux/authSlice';
import { AuthField } from '../components/AuthField';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (isSubmitting) return;
    setServerError(null);

    const eErr = !email.trim()
      ? 'Vui lòng nhập email.'
      : !EMAIL_REGEX.test(email.trim())
        ? 'Địa chỉ email không hợp lệ.'
        : null;
    const pErr = !password ? 'Vui lòng nhập mật khẩu.' : null;
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setIsSubmitting(true);
    const result = await dispatch(login({ email, password }));
    setIsSubmitting(false);

    if (login.rejected.match(result)) {
      setServerError(result.payload ?? 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
    // Đăng nhập thành công: RootNavigator tự chuyển sang màn hình chính
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: '100%', maxWidth: 440, alignSelf: 'center' }}>
            {/* Logo & lời chào */}
            <YStack alignItems="center" gap={6} marginBottom={24}>
              <View
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 42,
                  backgroundColor: '#ffedd5',
                  borderWidth: 2,
                  borderColor: '#ea580c',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ChefHat size={44} color="#ea580c" />
              </View>
              <Text fontSize={26} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                ChefMate
              </Text>
              <Text fontSize={13} color={isDarkMode ? '#94a3b8' : '#64748b'} textAlign="center">
                Đăng nhập để lưu và đồng bộ sổ tay nấu ăn của bạn 👨‍🍳
              </Text>
            </YStack>

            <Card
              borderRadius={20}
              padding={16}
              backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
              borderWidth={1}
              borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
            >
              <YStack gap={14}>
                <Text fontSize={18} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                  Đăng nhập
                </Text>

                {serverError ? (
                  <XStack
                    backgroundColor={isDarkMode ? '#7f1d1d' : '#fee2e2'}
                    borderWidth={1}
                    borderColor={isDarkMode ? '#b91c1c' : '#fca5a5'}
                    borderRadius={12}
                    padding={10}
                    gap={8}
                    alignItems="center"
                  >
                    <AlertCircle size={16} color="#dc2626" />
                    <Text flex={1} fontSize={12} fontWeight="600" color={isDarkMode ? '#fecaca' : '#b91c1c'}>
                      {serverError}
                    </Text>
                  </XStack>
                ) : null}

                <AuthField
                  label="Email:"
                  icon={<Mail size={18} color="#94a3b8" />}
                  placeholder="ban@example.com"
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    setEmailError(null);
                  }}
                  isDarkMode={isDarkMode}
                  keyboardType="email-address"
                  autoComplete="email"
                  returnKeyType="next"
                  error={emailError}
                  testID="login-email"
                />

                <AuthField
                  label="Mật khẩu:"
                  icon={<Lock size={18} color="#94a3b8" />}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    setPasswordError(null);
                  }}
                  isDarkMode={isDarkMode}
                  secure
                  autoComplete="password"
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                  error={passwordError}
                  testID="login-password"
                />

                <Button
                  size="lg"
                  marginTop={4}
                  backgroundColor="#ea580c"
                  borderRadius={14}
                  disabled={isSubmitting}
                  onPress={handleLogin}
                  testID="login-submit"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <XStack alignItems="center" gap={8}>
                      <LogIn size={18} color="#ffffff" />
                      <Text color="#ffffff" fontWeight="800" fontSize={15}>
                        Đăng Nhập
                      </Text>
                    </XStack>
                  )}
                </Button>
              </YStack>
            </Card>

            <XStack justifyContent="center" alignItems="center" gap={6} marginTop={20}>
              <Text fontSize={13} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                Chưa có tài khoản?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')} testID="go-register">
                <Text fontSize={13} fontWeight="800" color="#ea580c">
                  Đăng ký ngay
                </Text>
              </TouchableOpacity>
            </XStack>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
