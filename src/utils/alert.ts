import { Alert, Platform } from 'react-native';

/**
 * Trên trình duyệt (react-native-web), Alert.alert của React Native KHÔNG làm gì cả,
 * nên các thông báo / hộp thoại xác nhận sẽ "biến mất". File này bổ sung cho Alert.alert
 * hành vi tương đương bằng window.alert / window.confirm để test được trên web.
 * Trên Android/iOS thì giữ nguyên Alert gốc.
 */
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  Alert.alert = (title, message, buttons) => {
    const text = [title, message].filter(Boolean).join('\n\n');

    if (!buttons || buttons.length <= 1) {
      window.alert(text);
      buttons?.[0]?.onPress?.();
      return;
    }

    const cancelBtn = buttons.find((b) => b.style === 'cancel');
    const actionBtn = buttons.find((b) => b !== cancelBtn) ?? buttons[buttons.length - 1];
    if (window.confirm(text)) {
      actionBtn.onPress?.();
    } else {
      cancelBtn?.onPress?.();
    }
  };
}

export {};
