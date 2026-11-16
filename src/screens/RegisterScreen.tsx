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
import {
  ArrowLeft,
  ChefHat,
  Mail,
  Lock,
  User,
  UserPlus,
  AlertCircle,
  CheckCircle,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/recipe';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { selectIsDarkMode } from '../redux/themeSlice';
import { register } from '../redux/authSlice';
import { AuthField } from '../components/AuthField';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(null);

  const clearError = (key: string) => setErrors((prev) => ({ ...prev, [key]: null }));

  const handleRegister = async () => {
    if (isSubmitting) return;
    setServerError(null);

    const next: Record<string, string | null> = {
      fullName: fullName.trim().length < 2 ? 'Vui lòng nhập tên hiển thị (ít nhất 2 ký tự).' : null,
      email: !email.trim()
        ? 'Vui lòng nhập email.'
        : !EMAIL_REGEX.test(email.trim())
          ? 'Địa chỉ email không hợp lệ.'
          : null,
      password: password.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự.' : null,
      confirm: confirm !== password ? 'Mật khẩu nhập lại không khớp.' : null,
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setIsSubmitting(true);
    const result = await dispatch(register({ fullName, email, password }));
    setIsSubmitting(false);

    if (register.rejected.match(result)) {
      setServerError(result.payload ?? 'Đăng ký thất bại. Vui lòng thử lại.');
      return;
    }
    // Nếu server yêu cầu xác nhận email: báo cho người dùng. Ngược lại đã tự đăng nhập.
    if (result.payload.needsConfirmation) {
      setConfirmationSentTo(email.trim().toLowerCase());
    }
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
                testID="register-back"
              >
                <ArrowLeft size={18} color={isDarkMode ? '#f8fafc' : '#0f172a'} />
              </TouchableOpacity>
              <Text fontSize={20} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                Tạo Tài Khoản
              </Text>
            </XStack>

            <YStack alignItems="center" gap={6} marginBottom={20}>
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
              <Text fontSize={13} color={isDarkMode ? '#94a3b8' : '#64748b'} textAlign="center">
                Gia nhập cộng đồng ChefMate để đăng tải công thức của riêng bạn
              </Text>
            </YStack>

            <Card
              borderRadius={20}
              padding={16}
              backgroundColor={isDarkMode ? '#1e293b' : '#ffffff'}
              borderWidth={1}
              borderColor={isDarkMode ? '#334155' : '#e2e8f0'}
            >
              {confirmationSentTo ? (
                <YStack gap={12} alignItems="center" paddingVertical={8}>
                  <CheckCircle size={44} color="#059669" />
                  <Text fontSize={18} fontWeight="800" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
                    Đăng ký thành công!
                  </Text>
                  <Text
                    fontSize={13}
                    textAlign="center"
                    lineHeight={19}
                    color={isDarkMode ? '#94a3b8' : '#64748b'}
                  >
                    Chúng tôi đã gửi email xác nhận tới{' '}
                    <Text fontWeight="800" color="#ea580c">
                      {confirmationSentTo}
                    </Text>
                    . Hãy bấm vào liên kết trong email rồi quay lại đăng nhập.
                  </Text>
                  <Button
                    size="lg"
                    alignSelf="stretch"
                    backgroundColor="#ea580c"
                    borderRadius={14}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text color="#ffffff" fontWeight="800" fontSize={15}>
                      Về màn hình đăng nhập
                    </Text>
                  </Button>
                </YStack>
              ) : (
                <YStack gap={14}>
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
                    label="Tên hiển thị (*):"
                    icon={<User size={18} color="#94a3b8" />}
                    placeholder="Ví dụ: Chef Huy"
                    value={fullName}
                    onChangeText={(v) => {
                      setFullName(v);
                      clearError('fullName');
                    }}
                    isDarkMode={isDarkMode}
                    autoCapitalize="words"
                    autoComplete="name"
                    returnKeyType="next"
                    error={errors.fullName}
                    testID="register-name"
                  />

                  <AuthField
                    label="Email (*):"
                    icon={<Mail size={18} color="#94a3b8" />}
                    placeholder="ban@example.com"
                    value={email}
                    onChangeText={(v) => {
                      setEmail(v);
                      clearError('email');
                    }}
                    isDarkMode={isDarkMode}
                    keyboardType="email-address"
                    autoComplete="email"
                    returnKeyType="next"
                    error={errors.email}
                    testID="register-email"
                  />

                  <AuthField
                    label="Mật khẩu (*):"
                    icon={<Lock size={18} color="#94a3b8" />}
                    placeholder="Ít nhất 6 ký tự"
                    value={password}
                    onChangeText={(v) => {
                      setPassword(v);
                      clearError('password');
                    }}
                    isDarkMode={isDarkMode}
                    secure
                    autoComplete="new-password"
                    returnKeyType="next"
                    error={errors.password}
                    testID="register-password"
                  />

                  <AuthField
                    label="Nhập lại mật khẩu (*):"
                    icon={<Lock size={18} color="#94a3b8" />}
                    placeholder="Nhập lại mật khẩu"
                    value={confirm}
                    onChangeText={(v) => {
                      setConfirm(v);
                      clearError('confirm');
                    }}
                    isDarkMode={isDarkMode}
                    secure
                    autoComplete="new-password"
                    returnKeyType="go"
                    onSubmitEditing={handleRegister}
                    error={errors.confirm}
                    testID="register-confirm"
                  />

                  <Button
                    size="lg"
                    marginTop={4}
                    backgroundColor="#ea580c"
                    borderRadius={14}
                    disabled={isSubmitting}
                    onPress={handleRegister}
                    testID="register-submit"
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <XStack alignItems="center" gap={8}>
                        <UserPlus size={18} color="#ffffff" />
                        <Text color="#ffffff" fontWeight="800" fontSize={15}>
                          Đăng Ký
                        </Text>
                      </XStack>
                    )}
                  </Button>
                </YStack>
              )}
            </Card>

            {!confirmationSentTo && (
              <XStack justifyContent="center" alignItems="center" gap={6} marginTop={20}>
                <Text fontSize={13} color={isDarkMode ? '#94a3b8' : '#64748b'}>
                  Đã có tài khoản?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text fontSize={13} fontWeight="800" color="#ea580c">
                    Đăng nhập
                  </Text>
                </TouchableOpacity>
              </XStack>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
