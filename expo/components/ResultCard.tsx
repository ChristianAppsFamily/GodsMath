import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';

interface ResultCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export default function ResultCard({ label, value, highlight = false }: ResultCardProps) {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  return (
    <View style={[styles.container, highlight && styles.highlighted]}>
      <Text style={[styles.label, highlight && styles.highlightedLabel]}>{label}</Text>
      <Text style={[styles.value, highlight && styles.highlightedValue]}>{value}</Text>
    </View>
  );
}

const createStyles = (Colors: ColorSet) => StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  highlighted: {
    backgroundColor: Colors.accent,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  highlightedLabel: {
    color: '#FFFFFF',
    opacity: 0.85,
  },
  value: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  highlightedValue: {
    color: '#FFFFFF',
  },
});
