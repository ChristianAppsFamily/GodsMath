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

const TIP_PRESETS = [10, 15, 18, 20, 25];

export default function TipCalculatorScreen() {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const { addToHistory } = useHistory();
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState('18');
  const [splitCount, setSplitCount] = useState('1');

  const results = useMemo(() => {
    const bill = parseFloat(billAmount) || 0;
    const tip = parseFloat(tipPercent) || 0;
    const split = parseInt(splitCount) || 1;

    if (bill <= 0) return null;

    const tipAmount = bill * (tip / 100);
    const totalAmount = bill + tipAmount;
    const perPerson = totalAmount / split;

    return {
      tipAmount,
      totalAmount,
      perPerson,
    };
  }, [billAmount, tipPercent, splitCount]);

  const formatCurrency = (num: number) => {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handlePresetPress = (percent: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTipPercent(percent.toString());
  };

  const handleSave = () => {
    if (!results) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const expression = parseInt(splitCount) > 1 
      ? `Tip: $${billAmount} @ ${tipPercent}% ÷ ${splitCount}`
      : `Tip: $${billAmount} @ ${tipPercent}%`;
    
    addToHistory({
      expression,
      result: formatCurrency(results.totalAmount),
      type: 'tip',
    });

    console.log('[TipCalculator] Saved to history');
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
          label="Bill Amount"
          value={billAmount}
          onChangeText={setBillAmount}
          prefix="$"
          placeholder="85.00"
        />

        <Text style={styles.label}>Tip Percentage</Text>
        <View style={styles.presets}>
          {TIP_PRESETS.map((percent) => (
            <TouchableOpacity
              key={percent}
              style={[
                styles.presetButton,
                tipPercent === percent.toString() && styles.presetButtonActive,
              ]}
              onPress={() => handlePresetPress(percent)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.presetText,
                tipPercent === percent.toString() && styles.presetTextActive,
              ]}>
                {percent}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <InputField
          label="Custom Tip"
          value={tipPercent}
          onChangeText={setTipPercent}
          suffix="%"
          placeholder="18"
        />

        <InputField
          label="Split Between"
          value={splitCount}
          onChangeText={setSplitCount}
          suffix="people"
          placeholder="1"
          keyboardType="numeric"
        />

        {results && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Results</Text>
            
            {parseInt(splitCount) > 1 && (
              <ResultCard
                label="Per Person"
                value={formatCurrency(results.perPerson)}
                highlight
              />
            )}
            <ResultCard
              label="Total Amount"
              value={formatCurrency(results.totalAmount)}
              highlight={parseInt(splitCount) <= 1}
            />
            <ResultCard
              label="Tip Amount"
              value={formatCurrency(results.tipAmount)}
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
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presets: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  presetText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  presetTextActive: {
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
