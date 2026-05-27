import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';
import InputField from '@/components/InputField';
import ResultCard from '@/components/ResultCard';
import { useHistory } from '@/contexts/HistoryContext';

export default function LoanCalculatorScreen() {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const { addToHistory } = useHistory();
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');

  const results = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;

    if (p <= 0 || r <= 0 || n <= 0) return null;

    const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - p;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
    };
  }, [principal, rate, years]);

  const formatCurrency = (num: number) => {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSave = () => {
    if (!results) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    addToHistory({
      expression: `Loan: $${principal} @ ${rate}% for ${years}yr`,
      result: formatCurrency(results.monthlyPayment) + '/mo',
      type: 'loan',
    });

    console.log('[LoanCalculator] Saved to history');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <InputField
          label="Loan Amount"
          value={principal}
          onChangeText={setPrincipal}
          prefix="$"
          placeholder="250,000"
        />
        <InputField
          label="Annual Interest Rate"
          value={rate}
          onChangeText={setRate}
          suffix="%"
          placeholder="6.5"
        />
        <InputField
          label="Loan Term"
          value={years}
          onChangeText={setYears}
          suffix="years"
          placeholder="30"
        />

        {results && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Results</Text>
            <ResultCard
              label="Monthly Payment"
              value={formatCurrency(results.monthlyPayment)}
              highlight
            />
            <ResultCard
              label="Total Payment"
              value={formatCurrency(results.totalPayment)}
            />
            <ResultCard
              label="Total Interest"
              value={formatCurrency(results.totalInterest)}
            />
            
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save to History</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (Colors: ColorSet) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  results: {
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.accent,
  }
});
