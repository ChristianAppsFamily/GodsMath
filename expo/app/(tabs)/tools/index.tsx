import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Banknote, Receipt, TrendingUp, Home, Briefcase, Fuel } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';
import { useMemo } from 'react';
import AdBanner from '@/components/AdBanner';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
}

function ToolCard({ title, description, icon, onPress }: ToolCardProps) {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.7}
      testID={`tool-${title.toLowerCase().replace(' ', '-')}`}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ToolsScreen() {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const tools = [
    {
      title: 'Loan Calculator',
      description: 'Calculate monthly payments, total interest, and amortization',
      icon: <Banknote size={28} color={Colors.accent} />,
      route: '/tools/loan' as const,
    },
    {
      title: 'Tip Calculator',
      description: 'Split bills and calculate tips with ease',
      icon: <Receipt size={28} color={Colors.accent} />,
      route: '/tools/tip' as const,
    },
    {
      title: 'Interest Calculator',
      description: 'Compound interest and investment growth',
      icon: <TrendingUp size={28} color={Colors.accent} />,
      route: '/tools/interest' as const,
    },
    {
      title: 'Mortgage Calculator',
      description: 'Estimate monthly mortgage with taxes & insurance',
      icon: <Home size={28} color={Colors.accent} />,
      route: '/tools/mortgage' as const,
    },
    {
      title: 'Hourly ↔ Salary',
      description: 'Convert hourly wage to annual salary and back',
      icon: <Briefcase size={28} color={Colors.accent} />,
      route: '/tools/salary' as const,
    },
    {
      title: 'Fuel Cost Calculator',
      description: 'Estimate trip fuel costs based on MPG and price',
      icon: <Fuel size={28} color={Colors.accent} />,
      route: '/tools/fuel' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Financial Calculators</Text>
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            onPress={() => router.push(tool.route)}
          />
        ))}
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  arrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300' as const,
  },
  adContainer: {
    marginTop: 8,
  },
});
