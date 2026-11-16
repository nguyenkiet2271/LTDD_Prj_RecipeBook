import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface AppInputProps extends TextInputProps {
  flex?: number;
  size?: 'sm' | 'md';
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  fontSize?: number;
}

/**
 * Ô nhập liệu dùng chung, thay cho Input của Tamagui.
 * Lý do: Tamagui Input truyền bo góc dạng chuỗi ("$4") xuống Android gây lỗi
 * "java.lang.String cannot be cast to java.lang.Double", và bỏ qua secureTextEntry trên web.
 * Component này dùng TextInput gốc với style số, chạy đúng trên Android / iOS / web
 * và nhận các prop giống Input cũ nên không cần sửa chỗ dùng.
 */
export const AppInput: React.FC<AppInputProps> = ({
  flex,
  size = 'md',
  backgroundColor = '#ffffff',
  color = '#0f172a',
  borderColor = '#e2e8f0',
  borderWidth = 1,
  fontSize,
  style,
  ...rest
}) => (
  <TextInput
    {...rest}
    style={[
      {
        flex,
        minWidth: 0, // cho phép ô co lại trong hàng nhiều ô, không tràn ra ngoài
        height: size === 'sm' ? 40 : 46,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth,
        borderColor,
        backgroundColor,
        color,
        fontSize: fontSize ?? 14,
        // outlineStyle chỉ có trên web: tắt viền focus mặc định của trình duyệt
        outlineStyle: 'none',
      } as any,
      style,
    ]}
  />
);
