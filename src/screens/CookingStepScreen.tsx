import React, { useState, useEffect } from 'react';
import {
  Alert,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Button, Card } from 'tamagui';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Timer,
} from 'lucide-react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/recipe';

type CookingStepRouteProp = RouteProp<RootStackParamList, 'CookingStep'>;

export const CookingStepScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CookingStepRouteProp>();
  const { recipe } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const steps = recipe.steps || [];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Bộ đếm giờ (Timer) đếm ngược
  const currentStep = steps[currentStepIndex];
  const initialSeconds = (currentStep?.duration_minutes || 5) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const newSeconds = (currentStep?.duration_minutes || 5) * 60;
    setSecondsLeft(newSeconds);
    setIsTimerRunning(false);
  }, [currentStepIndex, currentStep]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      Alert.alert('⏰ Hết giờ!', `Đã hoàn thành thời gian cho bước ${currentStepIndex + 1}!`);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft, currentStepIndex]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      Alert.alert(
        '🎉 Chúc mừng!',
        `Bạn đã hoàn thành món ${recipe.title}! Hãy thưởng thức thành quả của mình nhé!`,
        [{ text: 'Về trang chi tiết', onPress: () => navigation.goBack() }]
      );
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const progressPercent = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'space-between' }}>
        {/* Top Header */}
        <YStack gap={12}>
          <XStack justifyContent="space-between" alignItems="center">
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <ArrowLeft size={18} color="#ffffff" />
            </TouchableOpacity>

            <Text color="#ffffff" fontSize={15} fontWeight="800">
              CHẾ ĐỘ NẤU ĂN BẾP
            </Text>

            <View style={{ width: 40 }} />
          </XStack>

          {/* Thanh tiến độ */}
          <YStack gap={6}>
            <XStack justifyContent="space-between">
              <Text color="#94a3b8" fontSize={12} fontWeight="600">
                Món: {recipe.title}
              </Text>
              <Text color="#ea580c" fontSize={12} fontWeight="800">
                Bước {currentStepIndex + 1} / {steps.length}
              </Text>
            </XStack>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </YStack>
        </YStack>

        {/* Nội dung Bước nấu (Chữ to, dễ đọc trên bàn bếp) */}
        <YStack
          marginVertical={20}
          alignItems="center"
          justifyContent="center"
          padding={isTablet ? 32 : 16}
        >
          <Card
            backgroundColor="#1e293b"
            borderWidth={1}
            borderColor="#334155"
            borderRadius={20}
            padding={20}
            width="100%"
            maxWidth={isTablet ? 650 : '100%'}
          >
            <YStack gap={12} alignItems="center">
              <XStack
                backgroundColor="#ea580c"
                paddingHorizontal={14}
                paddingVertical={6}
                borderRadius={20}
                alignItems="center"
                gap={6}
              >
                <Text color="#ffffff" fontSize={13} fontWeight="800">
                  BƯỚC {currentStepIndex + 1}
                </Text>
              </XStack>

              <Text
                color="#ffffff"
                fontSize={isTablet ? 24 : 18}
                fontWeight="700"
                textAlign="center"
                lineHeight={isTablet ? 36 : 28}
                marginTop={8}
              >
                {currentStep?.instruction || 'Thực hiện thao tác nấu theo hướng dẫn.'}
              </Text>
            </YStack>

            {/* Đồng hồ hẹn giờ nấu ăn tích hợp */}
            <YStack
              marginTop={24}
              paddingTop={16}
              borderTopWidth={1}
              borderTopColor="#334155"
              alignItems="center"
              gap={12}
            >
              <XStack alignItems="center" gap={8}>
                <Timer size={18} color="#fdba74" />
                <Text color="#94a3b8" fontSize={13} fontWeight="700">
                  HẸN GIỜ NẤU (KITCHEN TIMER)
                </Text>
              </XStack>

              <Text
                color="#f97316"
                fontSize={44}
                fontWeight="900"
                letterSpacing={2}
              >
                {formatTime(secondsLeft)}
              </Text>

              {/* Điều khiển Timer */}
              <XStack gap={12}>
                <Button
                  size="md"
                  borderRadius={12}
                  backgroundColor={isTimerRunning ? '#dc2626' : '#ea580c'}
                  onPress={() => setIsTimerRunning(!isTimerRunning)}
                >
                  <XStack alignItems="center" gap={6}>
                    {isTimerRunning ? (
                      <Pause size={16} color="#ffffff" />
                    ) : (
                      <Play size={16} color="#ffffff" fill="#ffffff" />
                    )}
                    <Text color="#ffffff" fontWeight="700">
                      {isTimerRunning ? 'Tạm dừng' : 'Bắt đầu đếm'}
                    </Text>
                  </XStack>
                </Button>

                <Button
                  size="md"
                  borderRadius={12}
                  backgroundColor="#334155"
                  onPress={() => {
                    setIsTimerRunning(false);
                    setSecondsLeft((currentStep?.duration_minutes || 5) * 60);
                  }}
                >
                  <XStack alignItems="center" gap={4}>
                    <RotateCcw size={16} color="#cbd5e1" />
                    <Text color="#cbd5e1" fontWeight="700">
                      Đặt lại
                    </Text>
                  </XStack>
                </Button>
              </XStack>
            </YStack>
          </Card>
        </YStack>

        {/* Nút điều hướng Chuyển bước */}
        <XStack justifyContent="space-between" alignItems="center" gap={12}>
          <Button
            size="lg"
            flex={1}
            borderRadius={14}
            backgroundColor="#1e293b"
            disabled={currentStepIndex === 0}
            opacity={currentStepIndex === 0 ? 0.4 : 1}
            onPress={handlePrevStep}
          >
            <XStack alignItems="center" gap={6}>
              <ChevronLeft size={18} color="#ffffff" />
              <Text color="#ffffff" fontWeight="700">
                Bước trước
              </Text>
            </XStack>
          </Button>

          <Button
            size="lg"
            flex={1.5}
            borderRadius={14}
            backgroundColor="#ea580c"
            onPress={handleNextStep}
          >
            <XStack alignItems="center" gap={6}>
              <Text color="#ffffff" fontWeight="800">
                {currentStepIndex === steps.length - 1 ? 'Hoàn thành món' : 'Bước tiếp theo'}
              </Text>
              {currentStepIndex === steps.length - 1 ? (
                <CheckCircle size={18} color="#ffffff" />
              ) : (
                <ChevronRight size={18} color="#ffffff" />
              )}
            </XStack>
          </Button>
        </XStack>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#334155',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ea580c',
    borderRadius: 3,
  },
});
