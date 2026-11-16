import React, { useState } from 'react';
import { TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Eye, EyeOff } from 'lucide-react-native';

interface AuthFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  isDarkMode: boolean;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
  error?: string | null;
  testID?: string;
}

// Ô nhập liệu dùng chung cho màn Đăng nhập / Đăng ký (cùng style với thanh tìm kiếm & form tạo công thức)
export const AuthField: React.FC<AuthFieldProps> = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  isDarkMode,
  secure,
  keyboardType,
  autoCapitalize = 'none',
  autoComplete,
  returnKeyType,
  onSubmitEditing,
  error,
  testID,
}) => {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <YStack gap={4}>
      <Text fontSize={13} fontWeight="700" color={isDarkMode ? '#f8fafc' : '#0f172a'}>
        {label}
      </Text>
      <XStack
        backgroundColor={isDarkMode ? '#0f172a' : '#f8fafc'}
        borderRadius={12}
        alignItems="center"
        paddingHorizontal={12}
        borderWidth={1}
        borderColor={error ? '#ef4444' : isDarkMode ? '#334155' : '#e2e8f0'}
      >
        {icon}
        {/* Dùng TextInput gốc của React Native: chạy đúng trên Android/iOS/web
            (Tamagui Input gây lỗi borderRadius trên Android và bỏ qua secureTextEntry trên web) */}
        <TextInput
          style={{
            flex: 1,
            height: 44,
            marginLeft: 8,
            fontSize: 14,
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            // outlineStyle chỉ có trên web: tắt viền focus mặc định của trình duyệt
            outlineStyle: 'none',
          } as any}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={false}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          testID={testID}
        />
        {secure && (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} hitSlop={8}>
            {hidden ? (
              <Eye size={18} color={isDarkMode ? '#64748b' : '#94a3b8'} />
            ) : (
              <EyeOff size={18} color={isDarkMode ? '#64748b' : '#94a3b8'} />
            )}
          </TouchableOpacity>
        )}
      </XStack>
      {error ? (
        <Text fontSize={11} color="#ef4444" fontWeight="600">
          {error}
        </Text>
      ) : null}
    </YStack>
  );
};
