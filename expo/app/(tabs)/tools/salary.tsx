import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowLeftRight } from 'lucide-react-native';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';
import InputField from '@/components/InputField';
import ResultCard from '@/components/ResultCard';
import AdBanner from '@/components/AdBanner';
import { useHistory } from '@/contexts/HistoryContext';

type Mode = 'hourlyToSalary' | 'salaryToHourly';

export default function SalaryConverterScreen() {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const { addToHistory } = useHistory();

  const [mode, setMode] = useState<Mode>('hourlyToSalary');
  const [amount, setAmount] = useState<string>('');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [weeksPerYear, setWeeksPerYear] = useState<string>('52');

  const results = useMemo(() => {
    const value = parseFloat(amount) || 0;
    const hpw = parseFloat(hoursPerWeek) || 0;
    const wpy = parseFloat(weeksPerYear) || 0;
    if (value <= 0 || hpw <= 0 || wpy <= 0) return null;

    if (mode === 'hourlyToSalary') {
      const weekly = value * hpw;
      const monthly = (value * hpw * wpy) / 12;
      const annual = value * hpw * wpy;
      return { primaryLabel: 'Annual Salary', primaryValue: annual, weekly, monthly, hourly: value };
    } else {
      const hourly = value / (hpw * wpy);
      const weekly = value / wpy;
      const monthly = value / 12;
      return { primaryLabel: 'Hourly Rate', primaryValue: hourly, weekly, monthly, hourly };
    }
  }, [amount, hoursPerWeek, weeksPerYear, mode]);

  const formatCurrency = (num: number, decimals: number = 2) => {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMode(prev => (prev === 'hourlyToSalary' ? 'salaryToHourly' : 'hourlyToSalary'));
    setAmount('');
  };

  const handleSave = () => {
    if (!results) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const expr = mode === 'hourlyToSalary'
      ? `${formatCurrency(parseFloat(amount) || 0)}/hr \u2192 salary`
      : `${formatCurrency(parseFloat(amount) || 0)}/yr \u2192 hourly`;
    addToHistory({
      expression: expr,
      result: formatCurrency(results.primaryValue, mode === 'salaryToHourly' ? 2 : 0),
      type: 'salary',
    });
    console.log('[SalaryConverter] Saved to history');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.modeToggle}
          onPress={toggleMode}
          activeOpacity={0.8}
          testID="salary-mode-toggle"
        >
          <View style={styles.modeTextContainer}>
            <Text style={styles.modeLabel}>Converting</Text>
            <Text style={styles.modeValue}>
              {mode === 'hourlyToSalary' ? 'Hourly \u2192 Salary' : 'Salary \u2192 Hourly'}
            </Text>
          </View>
          <View style={styles.swapIcon}>
            <ArrowLeftRight size={20} color={Colors.accent} />
          </View>
        </TouchableOpacity>

        <InputField
          label={mode === 'hourlyToSalary' ? 'Hourly Rate' : 'Annual Salary'}
          value={amount}
          onChangeText={setAmount}
          prefix="$"
          placeholder={mode === 'hourlyToSalary' ? '25.00' : '75,000'}
        />
        <InputField
          label="Hours per Week"
          value={hoursPerWeek}
          onChangeText={setHoursPerWeek}
          suffix="hrs"
          placeholder="40"
        />
        <InputField
          label="Weeks per Year"
          value={weeksPerYear}
          onChangeText={setWeeksPerYear}
          suffix="wks"
          placeholder="52"
        />

        {results && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Results</Text>
            <ResultCard
              label={results.primaryLabel}
              value={formatCurrency(results.primaryValue, mode === 'salaryToHourly' ? 2 : 0)}
              highlight
            />
            <ResultCard label="Monthly" value={formatCurrency(results.monthly)} />
            <ResultCard label="Weekly" value={formatCurrency(results.weekly)} />
            <ResultCard label="Hourly" value={formatCurrency(results.hourly)} />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
              testID="salary-save"
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
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeTextContainer: { flex: 1 },
  modeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  modeValue: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  swapIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
