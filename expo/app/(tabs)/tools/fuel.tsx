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

export default function FuelCostScreen() {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const { addToHistory } = useHistory();

  const [distance, setDistance] = useState<string>('');
  const [mpg, setMpg] = useState<string>('');
  const [pricePerGallon, setPricePerGallon] = useState<string>('');
  const [passengers, setPassengers] = useState<string>('1');

  const results = useMemo(() => {
    const d = parseFloat(distance) || 0;
    const m = parseFloat(mpg) || 0;
    const p = parseFloat(pricePerGallon) || 0;
    const pax = Math.max(parseFloat(passengers) || 1, 1);
    if (d <= 0 || m <= 0 || p <= 0) return null;

    const gallonsNeeded = d / m;
    const totalCost = gallonsNeeded * p;
    const costPerMile = totalCost / d;
    const costPerPerson = totalCost / pax;

    return { gallonsNeeded, totalCost, costPerMile, costPerPerson };
  }, [distance, mpg, pricePerGallon, passengers]);

  const formatCurrency = (num: number) => {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSave = () => {
    if (!results) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToHistory({
      expression: `Fuel: ${distance}mi @ ${mpg}mpg / $${pricePerGallon}/gal`,
      result: formatCurrency(results.totalCost),
      type: 'fuel',
    });
    console.log('[FuelCalculator] Saved to history');
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
          label="Trip Distance"
          value={distance}
          onChangeText={setDistance}
          suffix="miles"
          placeholder="350"
        />
        <InputField
          label="Vehicle Fuel Economy"
          value={mpg}
          onChangeText={setMpg}
          suffix="mpg"
          placeholder="28"
        />
        <InputField
          label="Fuel Price"
          value={pricePerGallon}
          onChangeText={setPricePerGallon}
          prefix="$"
          suffix="/gal"
          placeholder="3.49"
        />
        <InputField
          label="Passengers (incl. driver)"
          value={passengers}
          onChangeText={setPassengers}
          suffix="ppl"
          placeholder="1"
        />

        {results && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Results</Text>
            <ResultCard
              label="Total Trip Cost"
              value={formatCurrency(results.totalCost)}
              highlight
            />
            <ResultCard
              label="Gallons Needed"
              value={results.gallonsNeeded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' gal'}
            />
            <ResultCard
              label="Cost per Mile"
              value={formatCurrency(results.costPerMile)}
            />
            <ResultCard
              label="Cost per Person"
              value={formatCurrency(results.costPerPerson)}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
              testID="fuel-save"
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
