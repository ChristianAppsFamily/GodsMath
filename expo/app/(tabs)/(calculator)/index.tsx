import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';
import { BOTTOM_AD_BAR_HEIGHT } from '@/constants/ads';
import CalculatorButton from '@/components/CalculatorButton';
import DailyVerse from '@/components/DailyVerse';
import { useHistory } from '@/contexts/HistoryContext';
import { useAdSettings } from '@/contexts/AdSettingsContext';

/** Space between keypad and bottom ad footer. */
const KEYPAD_BOTTOM_PADDING = BOTTOM_AD_BAR_HEIGHT + 20;

export default function CalculatorScreen() {
  const Colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(Colors), [Colors]);
  const { history, addToHistory } = useHistory();
  const { showVerses } = useAdSettings();
  const [currentInput, setCurrentInput] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [memoryValue, setMemoryValue] = useState(0);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const formatNumber = (num: string): string => {
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const handleNumber = useCallback((value: string) => {
    if (shouldResetDisplay) {
      setCurrentInput(value);
      setShouldResetDisplay(false);
    } else {
      if (currentInput === '0' && value !== '.') {
        setCurrentInput(value);
      } else if (value === '.' && currentInput.includes('.')) {
        return;
      } else if (currentInput.replace(/[,.-]/g, '').length < 12) {
        setCurrentInput(currentInput + value);
      }
    }
  }, [currentInput, shouldResetDisplay]);

  const handleOperator = useCallback((op: string) => {
    const currentNum = currentInput.replace(/,/g, '');
    setPreviousValue(currentNum);
    setOperation(op);
    setShouldResetDisplay(true);
  }, [currentInput]);

  const handleEquals = useCallback(() => {
    if (!previousValue || !operation) return;

    const current = parseFloat(currentInput.replace(/,/g, ''));
    const previous = parseFloat(previousValue);
    let result = 0;

    const opSymbol = operation === '*' ? '×' : operation === '/' ? '÷' : operation === '-' ? '−' : operation;
    const fullExpression = `${previousValue} ${opSymbol} ${currentInput.replace(/,/g, '')}`;

    try {
      switch (operation) {
        case '+':
          result = previous + current;
          break;
        case '-':
          result = previous - current;
          break;
        case '*':
          result = previous * current;
          break;
        case '/':
          result = current !== 0 ? previous / current : NaN;
          break;
        default:
          return;
      }

      if (isNaN(result) || !isFinite(result)) {
        setCurrentInput('Error');
      } else {
        const resultStr = parseFloat(result.toPrecision(10)).toString();
        setCurrentInput(resultStr);

        addToHistory({
          expression: fullExpression,
          result: resultStr,
          type: 'basic',
        });
      }
    } catch {
      setCurrentInput('Error');
    }

    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  }, [currentInput, previousValue, operation, addToHistory]);

  const handleClear = useCallback(() => {
    setCurrentInput('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (currentInput.length > 1) {
      setCurrentInput(currentInput.slice(0, -1));
    } else {
      setCurrentInput('0');
    }
  }, [currentInput]);

  const handleMemoryClear = useCallback(() => {
    setMemoryValue(0);
  }, []);

  const handleMemoryAdd = useCallback(() => {
    const current = parseFloat(currentInput.replace(/,/g, ''));
    setMemoryValue((prev) => prev + current);
  }, [currentInput]);

  const handleMemorySubtract = useCallback(() => {
    const current = parseFloat(currentInput.replace(/,/g, ''));
    setMemoryValue((prev) => prev - current);
  }, [currentInput]);

  const handleMemoryRecall = useCallback(() => {
    setCurrentInput(memoryValue.toString());
  }, [memoryValue]);

  const handlePercent = useCallback(() => {
    const num = parseFloat(currentInput.replace(/,/g, ''));
    setCurrentInput((num / 100).toString());
  }, [currentInput]);

  const handlePress = useCallback(
    (value: string) => {
      if ('0123456789.'.includes(value)) {
        handleNumber(value);
      } else if (['+', '−', '×', '÷'].includes(value)) {
        const opMap: Record<string, string> = { '−': '-', '×': '*', '÷': '/' };
        handleOperator(opMap[value] || value);
      } else if (value === '=') {
        handleEquals();
      } else if (value === 'C') {
        handleClear();
      } else if (value === '⌫') {
        handleBackspace();
      } else if (value === '%') {
        handlePercent();
      } else if (value === 'MC') {
        handleMemoryClear();
      } else if (value === 'M+') {
        handleMemoryAdd();
      } else if (value === 'M−') {
        handleMemorySubtract();
      } else if (value === 'MR') {
        handleMemoryRecall();
      }
    },
    [
      handleNumber,
      handleOperator,
      handleEquals,
      handleClear,
      handleBackspace,
      handlePercent,
      handleMemoryClear,
      handleMemoryAdd,
      handleMemorySubtract,
      handleMemoryRecall,
    ],
  );

  const displayValue = formatNumber(currentInput);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      testID="calculator-scroll"
    >
      {showVerses && <DailyVerse />}

      <View style={styles.displayContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.displayScroll}
        >
          <Text
            style={[
              styles.display,
              displayValue.length > 8 && styles.displaySmall,
              displayValue.length > 11 && styles.displayXSmall,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayValue}
          </Text>
        </ScrollView>

        {memoryValue !== 0 && (
          <View style={styles.memoryIndicator}>
            <Text style={styles.memoryText}>M</Text>
          </View>
        )}
      </View>

      <View style={styles.keypad}>
        <View style={styles.row}>
          <CalculatorButton value="MC" onPress={handlePress} type="memory" />
          <CalculatorButton value="M+" onPress={handlePress} type="memory" />
          <CalculatorButton value="M−" onPress={handlePress} type="memory" />
          <CalculatorButton value="MR" onPress={handlePress} type="memory" />
        </View>
        <View style={styles.row}>
          <CalculatorButton value="C" onPress={handlePress} type="function" />
          <CalculatorButton value="⌫" onPress={handlePress} type="function" />
          <CalculatorButton value="%" onPress={handlePress} type="function" />
          <CalculatorButton value="÷" onPress={handlePress} type="operator" />
        </View>
        <View style={styles.row}>
          <CalculatorButton value="7" onPress={handlePress} />
          <CalculatorButton value="8" onPress={handlePress} />
          <CalculatorButton value="9" onPress={handlePress} />
          <CalculatorButton value="×" onPress={handlePress} type="operator" />
        </View>
        <View style={styles.row}>
          <CalculatorButton value="4" onPress={handlePress} />
          <CalculatorButton value="5" onPress={handlePress} />
          <CalculatorButton value="6" onPress={handlePress} />
          <CalculatorButton value="−" onPress={handlePress} type="operator" />
        </View>
        <View style={styles.row}>
          <CalculatorButton value="1" onPress={handlePress} />
          <CalculatorButton value="2" onPress={handlePress} />
          <CalculatorButton value="3" onPress={handlePress} />
          <CalculatorButton value="+" onPress={handlePress} type="operator" />
        </View>
        <View style={styles.row}>
          <CalculatorButton value="0" onPress={handlePress} wide />
          <CalculatorButton value="." onPress={handlePress} />
          <CalculatorButton value="=" onPress={handlePress} type="equals" />
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (Colors: ColorSet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: KEYPAD_BOTTOM_PADDING,
    },
    displayContainer: {
      paddingHorizontal: 24,
      paddingBottom: 4,
      paddingTop: 8,
      alignItems: 'flex-end',
    },
    displayScroll: {
      justifyContent: 'flex-end',
    },
    display: {
      fontSize: 56,
      fontWeight: '300',
      color: Colors.text,
      letterSpacing: -2,
      textAlign: 'right',
    },
    displaySmall: {
      fontSize: 44,
    },
    displayXSmall: {
      fontSize: 34,
    },
    memoryIndicator: {
      backgroundColor: Colors.accent,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 8,
    },
    memoryText: {
      color: Colors.background,
      fontSize: 12,
      fontWeight: '600',
    },
    keypad: {
      paddingHorizontal: 8,
      marginTop: 12,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 4,
    },
  });
