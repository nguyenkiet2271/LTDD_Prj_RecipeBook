import { createTamagui } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v5';

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  shorthands: {}, // Giữ nguyên các thuộc tính chuẩn React Native (padding, backgroundColor, borderRadius...)
  media: {
    ...defaultConfig.media,
    sm: { maxWidth: 767 },
    gtSm: { minWidth: 768 },
    md: { minWidth: 1024 },
  },
});

export default tamaguiConfig;

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
