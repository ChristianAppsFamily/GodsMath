import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';
import InputField from '@/components/InputField';
import ResultCard from '@/components/ResultCard';
import AdBanner from '@/components/AdBanner';
import { useHistory } from '@/contexts/HistoryContext';

export default function MortgageCalculatorScreen() {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const { addToHistory } = useHistory();
  const [homePrice, setHomePrice] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [years, setYears] = useState<string>('30');
  const [propertyTax, setPropertyTax] = useState<string>('');
  const [insurance, setInsurance] = useState<string>('');

  const results = useMemo(() => {
    const price = parseFloat(homePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const principal = Math.max(price - down, 0);
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;
    const tax = (parseFloat(propertyTax) || 0) / 12;
    const ins = (parseFloat(insurance) || 0) / 12;

    if (principal <= 0 || r <= 0 || n <= 0) return null;

    const piPayment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyPayment = piPayment + tax + ins;
    const totalPayment = piPayment * n;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      piPayment,
      totalInterest,
      totalPayment,
    };
  }, [homePrice, downPayment, rate, years, propertyTax, insurance]);

  const formatCurrency = (num: number) => {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSave = () => {
    if (!results) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToHistory({
      expression: `Mortgage: $${homePrice} @ ${rate}% / ${years}yr`,
      result: formatCurrency(results.monthlyPayment) + '/mo',
      type: 'mortgage',
    });
    console.log('[MortgageCalculator] Saved to history');
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
          label="Home Price"
          value={homePrice}
          onChangeText={setHomePrice}
          prefix="$"
          placeholder="450,000"
        />
        <InputField
          label="Down Payment"
          value={downPayment}
          onChangeText={setDownPayment}
          prefix="$"
          placeholder="90,000"
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
        <InputField
          label="Property Tax (per year)"
          value={propertyTax}
          onChangeText={setPropertyTax}
          prefix="$"
          placeholder="3,600"
        />
        <InputField
          label="Home Insurance (per year)"
          value={insurance}
          onChangeText={setInsurance}
          prefix="$"
          placeholder="1,200"
        />

        {results && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Results</Text>
            <ResultCard
              label="Monthly Payment (PITI)"
              value={formatCurrency(results.monthlyPayment)}
              highlight
            />
            <ResultCard
              label="Principal & Interest"
              value={formatCurrency(results.piPayment)}
            />
            <ResultCard
              label="Total Interest Paid"
              value={formatCurrency(results.totalInterest)}
            />
            <ResultCard
              label="Total of Payments"
              value={formatCurrency(results.totalPayment)}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
              testID="mortgage-save"
            >
              <Text style={styles.saveButtonText}>Save to History</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <View style={[styles.adContainer, { paddingBottom: insets.bottom > 0 ? 0 : 8 }]}>
        <AdBanner />
      </View>
    </View>
  );
}

const createStyles = (Colors: ColorSet) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  results: { marginTop: 24 },
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
  },
  adContainer: { marginTop: 8 },
});
