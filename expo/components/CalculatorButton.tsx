import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';

interface CalculatorButtonProps {
  value: string;
  onPress: (value: string) => void;
  type?: 'number' | 'operator' | 'function' | 'equals' | 'memory';
  wide?: boolean;
}

export default function CalculatorButton({
  value,
  onPress,
  type = 'number',
  wide = false,
}: CalculatorButtonProps) {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(value);
  }, [onPress, value]);

  const getButtonStyle = () => {
    switch (type) {
      case 'operator':
        return styles.operatorButton;
      case 'function':
        return styles.functionButton;
      case 'equals':
        return styles.equalsButton;
      case 'memory':
        return styles.memoryButton;
      default:
        return styles.numberButton;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'operator':
        return styles.operatorText;
      case 'equals':
        return styles.equalsText;
      case 'function':
        return styles.functionText;
      case 'memory':
        return styles.memoryText;
      default:
        return styles.numberText;
    }
  };

  return (
    <Animated.View style={[
      styles.buttonWrapper,
      wide && styles.wideWrapper,
      { transform: [{ scale: scaleAnim }] },
    ]}>
      <TouchableOpacity
        style={[styles.button, getButtonStyle(), wide && styles.wideButton]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        testID={`calc-btn-${value}`}
      >
        <Text style={[styles.text, getTextStyle()]}>{value}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const BUTTON_SIZE = Math.min(68, Math.floor((SCREEN_WIDTH - 16 - 12 * 4) / 4));

const createStyles = (Colors: ColorSet) => StyleSheet.create({
  buttonWrapper: {
    margin: 5,
  },
  wideWrapper: {
    width: BUTTON_SIZE * 2 + 10,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wideButton: {
    width: '100%',
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    paddingLeft: 28,
    alignItems: 'flex-start',
  },
  numberButton: {
    backgroundColor: Colors.number,
  },
  operatorButton: {
    backgroundColor: Colors.accent,
  },
  functionButton: {
    backgroundColor: Colors.function,
  },
  equalsButton: {
    backgroundColor: Colors.success,
  },
  memoryButton: {
    backgroundColor: Colors.surfaceLight,
  },
  text: {
    fontSize: Math.min(30, BUTTON_SIZE * 0.45),
    fontWeight: '500' as const,
  },
  numberText: {
    color: Colors.text,
  },
  operatorText: {
    color: '#FFFFFF',
  },
  equalsText: {
    color: '#FFFFFF',
  },
  functionText: {
    color: Colors.background,
  },
  memoryText: {
    color: Colors.textSecondary,
    fontSize: Math.min(18, BUTTON_SIZE * 0.3),
  },
});
