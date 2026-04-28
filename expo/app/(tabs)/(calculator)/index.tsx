import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Settings as SettingsIcon } from 'lucide-react-native';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';
import CalculatorButton from '@/components/CalculatorButton';
import AdBanner from '@/components/AdBanner';
import DailyVerse from '@/components/DailyVerse';
import { useHistory } from '@/contexts/HistoryContext';
import { useAdSettings } from '@/contexts/AdSettingsContext';

export default function CalculatorScreen() {
  const Colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { history, addToHistory } = useHistory();
  const { removeAds, showVerses } = useAdSettings();
  const [currentInput, setCurrentInput] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [memoryValue, setMemoryValue] = useState(0);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const recentHistory = history.slice(0, 5);

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
        case '+': result = previous + current; break;
        case '-': result = previous - current; break;
        case '*': result = previous * current; break;
        case '/': result = current !== 0 ? previous / current : NaN; break;
        default: return;
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
    console.log('[Calculator] Memory cleared');
  }, []);

  const handleMemoryAdd = useCallback(() => {
    const current = parseFloat(currentInput.replace(/,/g, ''));
    setMemoryValue(prev => prev + current);
    console.log('[Calculator] Memory add:', current);
  }, [currentInput]);

  const handleMemorySubtract = useCallback(() => {
    const current = parseFloat(currentInput.replace(/,/g, ''));
    setMemoryValue(prev => prev - current);
    console.log('[Calculator] Memory subtract:', current);
  }, [currentInput]);

  const handleMemoryRecall = useCallback(() => {
    setCurrentInput(memoryValue.toString());
    console.log('[Calculator] Memory recall:', memoryValue);
  }, [memoryValue]);

  const handlePercent = useCallback(() => {
    const num = parseFloat(currentInput.replace(/,/g, ''));
    setCurrentInput((num / 100).toString());
  }, [currentInput]);

  const handlePress = useCallback((value: string) => {
    console.log('[Calculator] Button pressed:', value);
    
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
  }, [handleNumber, handleOperator, handleEquals, handleClear, handleBackspace, handlePercent, handleMemoryClear, handleMemoryAdd, handleMemorySubtract, handleMemoryRecall]);

  const handleHistoryTap = useCallback((result: string) => {
    setCurrentInput(result);
    setShouldResetDisplay(true);
  }, []);

  const displayValue = formatNumber(currentInput);

  const openSettings = useCallback(() => {
    router.push('/(tabs)/(calculator)/settings');
  }, [router]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={openSettings}
              style={styles.headerBtn}
              testID="open-settings"
              hitSlop={12}
            >
              <SettingsIcon size={22} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
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

      {recentHistory.length > 0 && (
        <View style={styles.historyTape}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {recentHistory.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.historyItem}
                onPress={() => handleHistoryTap(item.result)}
                activeOpacity={0.7}
              >
                <Text style={styles.historyExpression} numberOfLines={1}>
                  {item.expression}
                </Text>
                <Text style={styles.historyResult}>= {formatNumber(item.result)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

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

      {!removeAds && (
        <View style={[styles.adContainer, { paddingBottom: insets.bottom > 0 ? 0 : 8 }]} testID="calculator-ad-slot">
          <AdBanner />
        </View>
      )}
    </View>
  );
}

const createStyles = (Colors: ColorSet) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  displayContainer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: 'flex-end',
  },
  displayScroll: {
    justifyContent: 'flex-end',
  },
  display: {
    fontSize: 72,
    fontWeight: '300' as const,
    color: Colors.text,
    letterSpacing: -2,
    textAlign: 'right',
  },
  displaySmall: {
    fontSize: 56,
  },
  displayXSmall: {
    fontSize: 42,
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
    fontWeight: '600' as const,
  },
  historyTape: {
    maxHeight: 120,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  historyExpression: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 12,
  },
  historyResult: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  keypad: {
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  adContainer: {
    marginTop: 8,
  },
  headerBtn: {
    paddingHorizontal: 8,
  },
});
