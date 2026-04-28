import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { BookOpen, Sparkles, ShieldCheck, Check, RotateCcw, Sun, Moon, SunMoon, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors, useTheme, type ThemeMode } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';
import { useAdSettings } from '@/contexts/AdSettingsContext';

interface ThemeOption {
  id: ThemeMode;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const THEME_OPTIONS: ThemeOption[] = [
  { id: 'light', label: 'Light Mode', icon: Sun },
  { id: 'dark', label: 'Night Mode', icon: Moon },
  { id: 'system', label: 'System', icon: SunMoon },
];

export default function SettingsScreen() {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const { mode, setMode } = useTheme();
  const { removeAds, showVerses, setRemoveAds, toggleShowVerses } = useAdSettings();

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleToggleVerses = useCallback(() => {
    triggerHaptic();
    void toggleShowVerses();
  }, [toggleShowVerses, triggerHaptic]);

  const handleSelectMode = useCallback((next: ThemeMode) => {
    triggerHaptic();
    void setMode(next);
  }, [setMode, triggerHaptic]);

  const handlePurchase = useCallback(() => {
    triggerHaptic();
    if (removeAds) return;
    Alert.alert(
      'Remove Ads',
      'Unlock an ad-free God Math experience for a one-time purchase of $4.99.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy $4.99',
          style: 'default',
          onPress: () => {
            console.log('[Settings] Mock purchase completed');
            void setRemoveAds(true);
            if (Platform.OS !== 'web') {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            Alert.alert('Thank you!', 'Ads have been removed. Enjoy God Math.');
          },
        },
      ],
    );
  }, [removeAds, setRemoveAds, triggerHaptic]);

  const handleRestore = useCallback(() => {
    triggerHaptic();
    Alert.alert('Restore Purchases', 'No previous purchases were found on this device.');
  }, [triggerHaptic]);

  return (
    <>
      <Stack.Screen options={{ title: 'Settings', headerBackTitle: 'Back' }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="settings-screen"
      >
        <Text style={styles.sectionLabel}>PURCHASES</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.purchaseRow}
            onPress={handlePurchase}
            activeOpacity={0.7}
            disabled={removeAds}
            testID="remove-ads-button"
          >
            <View style={styles.iconBadge}>
              {removeAds ? (
                <Check size={20} color={Colors.success} />
              ) : (
                <ShieldCheck size={20} color={Colors.accent} />
              )}
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Remove Ads</Text>
              <Text style={styles.rowSubtitle}>
                {removeAds ? 'Purchased — thank you!' : 'One-time purchase, forever ad-free'}
              </Text>
            </View>
            {removeAds ? (
              <View style={styles.ownedBadge}>
                <Text style={styles.ownedText}>OWNED</Text>
              </View>
            ) : (
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>$4.99</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.simpleRow}
            onPress={handleRestore}
            activeOpacity={0.7}
            testID="restore-button"
          >
            <RotateCcw size={18} color={Colors.textSecondary} />
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>APPEARANCE</Text>
        <View style={styles.card}>
          {THEME_OPTIONS.map((opt, idx) => {
            const Icon = opt.icon;
            const selected = mode === opt.id;
            return (
              <React.Fragment key={opt.id}>
                {idx > 0 && <View style={styles.divider} />}
                <TouchableOpacity
                  style={styles.themeRow}
                  onPress={() => handleSelectMode(opt.id)}
                  activeOpacity={0.7}
                  testID={`theme-${opt.id}`}
                >
                  <View style={styles.iconBadge}>
                    <Icon size={20} color={Colors.accent} />
                  </View>
                  <Text style={styles.rowTitle}>{opt.label}</Text>
                  {selected && <Check size={20} color={Colors.accent} />}
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>READING</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.iconBadge}>
              <BookOpen size={20} color={Colors.accent} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Daily Bible Verses</Text>
              <Text style={styles.rowSubtitle}>
                Show inspirational verses above the calculator
              </Text>
            </View>
            <Switch
              value={showVerses}
              onValueChange={handleToggleVerses}
              trackColor={{ false: Colors.surfaceLight, true: Colors.accent }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor={Colors.surfaceLight}
              testID="toggle-verses"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>CREDITS</Text>
        <View style={styles.card}>
          <View style={styles.creditsRow}>
            <View style={styles.iconBadge}>
              <Info size={20} color={Colors.accent} />
            </View>
            <View style={styles.creditsText}>
              <Text style={styles.creditsTitle}>God Math — Calculator</Text>
              <Text style={styles.creditsLine}>Developed by</Text>
              <Text style={styles.creditsCompany}>Christian App Empire LLC</Text>
              <Text style={styles.creditsCopyright}>
                Copyright © 2026. All Rights Reserved.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Sparkles size={14} color={Colors.textSecondary} />
          <Text style={styles.footerText}>Proverbs 21:5</Text>
        </View>
      </ScrollView>
    </>
  );
}

const createStyles = (Colors: ColorSet) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    marginLeft: 4,
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  purchaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  simpleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
    flex: 1,
  },
  rowSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  priceBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  ownedBadge: {
    backgroundColor: 'rgba(48,209,88,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ownedText: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 64,
  },
  restoreText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  creditsText: {
    flex: 1,
  },
  creditsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  creditsLine: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  creditsCompany: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.accent,
    marginTop: 2,
    marginBottom: 8,
  },
  creditsCopyright: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
