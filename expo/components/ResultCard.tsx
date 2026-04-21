import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface ResultCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export default function ResultCard({ label, value, highlight = false }: ResultCardProps) {
  return (
    <View style={[styles.container, highlight && styles.highlighted]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, highlight && styles.highlightedValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  value: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  highlightedValue: {
    color: Colors.background,
  },
});
