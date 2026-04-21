import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import InputField from '@/components/InputField';
import ResultCard from '@/components/ResultCard';
import AdBanner from '@/components/AdBanner';
import { useHistory } from '@/contexts/HistoryContext';

const COMPOUND_FREQUENCIES = [
  { label: 'Monthly', value: 12 },
  { label: 'Quarterly', value: 4 },
  { label: 'Annually', value: 1 },
];

export default function InterestCalculatorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useHistory();
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [compoundFrequency, setCompoundFrequency] = useState(12);

  const results = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = compoundFrequency;

    if (p <= 0 || r <= 0 || t <= 0) return null;

    const futureValue = p * Math.pow(1 + r / n, n * t);
    const totalInterest = futureValue - p;

    return {
      futureValue,
      totalInterest,
    };
  }, [principal, rate, years, compoundFrequency]);

  const formatCurrency = (num: number) => {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleFrequencyPress = (freq: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompoundFrequency(freq);
  };

  const handleSave = () => {
    if (!results) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const freqLabel = COMPOUND_FREQUENCIES.find(f => f.value === compoundFrequency)?.label || '';
    
    addToHistory({
      expression: `Interest: $${principal} @ ${rate}% for ${years}yr (${freqLabel})`,
      result: formatCurrency(results.futureValue),
      type: 'interest',
    });

    console.log('[InterestCalculator] Saved to history');
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
          label="Principal Amount"
          value={principal}
          onChangeText={setPrincipal}
          prefix="$"
          placeholder="10,000"
        />
        <InputField
          label="Annual Interest Rate"
          value={rate}
          onChangeText={setRate}
          suffix="%"
          placeholder="7.0"
        />
        <InputField
          label="Time Period"
          value={years}
          onChangeText={setYears}
          suffix="years"
          placeholder="10"
        />

        <Text style={styles.label}>Compound Frequency</Text>
        <View style={styles.frequencies}>
          {COMPOUND_FREQUENCIES.map((freq) => (
            <TouchableOpacity
              key={freq.value}
              style={[
                styles.freqButton,
                compoundFrequency === freq.value && styles.freqButtonActive,
              ]}
              onPress={() => handleFrequencyPress(freq.value)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.freqText,
                compoundFrequency === freq.value && styles.freqTextActive,
              ]}>
                {freq.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {results && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Results</Text>
            <ResultCard
              label="Future Value"
              value={formatCurrency(results.futureValue)}
              highlight
            />
            <ResultCard
              label="Total Interest Earned"
              value={formatCurrency(results.totalInterest)}
            />
            <ResultCard
              label="Initial Investment"
              value={formatCurrency(parseFloat(principal) || 0)}
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
      <View style={[styles.adContainer, { paddingBottom: insets.bottom > 0 ? 0 : 8 }]}>
        <AdBanner />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  frequencies: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  freqButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  freqButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  freqText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  freqTextActive: {
    color: Colors.background,
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
  },
  adContainer: {
    marginTop: 8,
  },
});
