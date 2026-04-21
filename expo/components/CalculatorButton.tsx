import React, { useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

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
  wide = false 
}: CalculatorButtonProps) {
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      { transform: [{ scale: scaleAnim }] }
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

const BUTTON_SIZE = 68;

const styles = StyleSheet.create({
  buttonWrapper: {
    margin: 6,
  },
  wideWrapper: {
    flex: 2,
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
    fontSize: 32,
    fontWeight: '500' as const,
  },
  numberText: {
    color: Colors.text,
  },
  operatorText: {
    color: Colors.text,
  },
  equalsText: {
    color: Colors.text,
  },
  functionText: {
    color: Colors.background,
  },
  memoryText: {
    color: Colors.textSecondary,
    fontSize: 20,
  },
});
