const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Đảm bảo Metro Bundler chỉ dùng đúng 1 instance duy nhất của các thư viện cốt lõi
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@tamagui/web': path.resolve(__dirname, 'node_modules/@tamagui/web'),
  '@tamagui/core': path.resolve(__dirname, 'node_modules/@tamagui/core'),
  tamagui: path.resolve(__dirname, 'node_modules/tamagui'),
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
};

module.exports = config;
