import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  BookOpen,
  ShieldCheck,
  Check,
  RotateCcw,
  Sun,
  Moon,
  SunMoon,
  FileText,
  Mail,
  Facebook,
  Instagram,
  Users,
  Grid,
  Star,
  Bell,
  ChevronRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors, useTheme, type ThemeMode } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import { usePurchases } from '@/providers/PurchaseProvider';
import { CUSTOM_THEMES, type CustomThemeId } from '@/constants/customThemes';
import {
  COMMUNITY_URL,
  CONTACT_EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  MORE_APPS_URL,
  PRIVACY_POLICY_URL,
} from '@/constants/links';
import {
  disableDailyNotifications,
  enableDailyNotifications,
  getNotificationsPreference,
} from '@/lib/notifications';
import { maybeRequestAppReview } from '@/lib/appRating';

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
  const { mode, setMode, customThemeId, setCustomThemeId } = useTheme();
  const { removeAds, showVerses, toggleShowVerses } = useAdSettings();
  const {
    purchaseRemoveAds,
    restore,
    getPriceLabel,
    isPurchasing,
    isRestoring,
  } = usePurchases();
  const [notificationsOn, setNotificationsOn] = useState(false);

  React.useEffect(() => {
    void getNotificationsPreference().then(setNotificationsOn);
  }, []);

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const openUrl = useCallback(async (url: string) => {
    triggerHaptic();
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) await Linking.openURL(url);
    }
  }, [triggerHaptic]);

  const handleContact = useCallback(async () => {
    triggerHaptic();
    const subject = "God's Math Support";
    const body = "Hello Christian App Empire,\n\n";
    const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) await Linking.openURL(url);
      else Alert.alert('Contact Us', CONTACT_EMAIL);
    } catch {
      Alert.alert('Contact Us', CONTACT_EMAIL);
    }
  }, [triggerHaptic]);

  const handlePurchase = useCallback(() => {
    triggerHaptic();
    if (removeAds) return;
    Alert.alert(
      'Buy Pro Version Now!',
      `Unlock ad-free experience and custom themes for ${getPriceLabel()}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: `Buy ${getPriceLabel()}`, onPress: () => void purchaseRemoveAds() },
      ],
    );
  }, [getPriceLabel, purchaseRemoveAds, removeAds, triggerHaptic]);

  const handleNotificationsToggle = useCallback(
    async (value: boolean) => {
      triggerHaptic();
      if (value) {
        const ok = await enableDailyNotifications();
        setNotificationsOn(ok);
      } else {
        await disableDailyNotifications();
        setNotificationsOn(false);
      }
    },
    [triggerHaptic],
  );

  const handleCustomTheme = useCallback(
    (id: CustomThemeId) => {
      if (!removeAds) {
        Alert.alert('Pro Feature', 'Custom themes are included with the Pro version. Tap Remove Ads to unlock.');
        return;
      }
      triggerHaptic();
      void setCustomThemeId(id);
    },
    [removeAds, setCustomThemeId, triggerHaptic],
  );

  const renderLinkRow = (
    label: string,
    subtitle: string,
    icon: React.ReactNode,
    onPress: () => void,
    testID: string,
  ) => (
    <>
      <TouchableOpacity style={styles.simpleRow} onPress={onPress} activeOpacity={0.7} testID={testID}>
        <View style={styles.iconBadge}>{icon}</View>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{label}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
        <ChevronRight size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
      <View style={styles.divider} />
    </>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Settings', headerBackTitle: 'Back' }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="settings-screen"
      >
        <Text style={styles.sectionLabel}>PRO — REMOVE ADS</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.purchaseRow}
            onPress={handlePurchase}
            activeOpacity={0.7}
            disabled={removeAds || isPurchasing}
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
              <Text style={styles.rowTitle}>Remove Ads — Pro Version</Text>
              <Text style={styles.rowSubtitle}>
                {removeAds
                  ? 'Pro unlocked — thank you!'
                  : `One-time ${getPriceLabel()} · Ad-free + custom themes`}
              </Text>
            </View>
            {isPurchasing ? (
              <ActivityIndicator color={Colors.accent} />
            ) : removeAds ? (
              <View style={styles.ownedBadge}>
                <Text style={styles.ownedText}>PRO</Text>
              </View>
            ) : (
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{getPriceLabel()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.simpleRow}
            onPress={() => {
              triggerHaptic();
              void restore();
            }}
            activeOpacity={0.7}
            disabled={isRestoring}
            testID="restore-button"
          >
            <RotateCcw size={18} color={Colors.textSecondary} />
            <Text style={styles.restoreText}>Restore Purchases</Text>
            {isRestoring && <ActivityIndicator color={Colors.accent} style={{ marginLeft: 8 }} />}
          </TouchableOpacity>
        </View>

        {removeAds && (
          <>
            <Text style={styles.sectionLabel}>PRO — CUSTOM THEMES</Text>
            <View style={styles.card}>
              {CUSTOM_THEMES.map((theme, idx) => (
                <React.Fragment key={theme.id}>
                  {idx > 0 && <View style={styles.divider} />}
                  <TouchableOpacity
                    style={styles.themeRow}
                    onPress={() => handleCustomTheme(theme.id)}
                    activeOpacity={0.7}
                    testID={`custom-theme-${theme.id}`}
                  >
                    <View style={[styles.themeSwatch, { backgroundColor: theme.preview }]} />
                    <View style={styles.rowText}>
                      <Text style={styles.rowTitle}>{theme.name}</Text>
                      <Text style={styles.rowSubtitle}>{theme.description}</Text>
                    </View>
                    {customThemeId === theme.id && <Check size={20} color={Colors.accent} />}
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </>
        )}

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
                  onPress={() => {
                    triggerHaptic();
                    void setMode(opt.id);
                  }}
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

        <Text style={styles.sectionLabel}>READING & REMINDERS</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.iconBadge}>
              <BookOpen size={20} color={Colors.accent} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Daily Bible Verses</Text>
              <Text style={styles.rowSubtitle}>God&apos;s provision & faithful math</Text>
            </View>
            <Switch
              value={showVerses}
              onValueChange={() => {
                triggerHaptic();
                void toggleShowVerses();
              }}
              trackColor={{ false: Colors.surfaceLight, true: Colors.accent }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={Colors.surfaceLight}
              testID="toggle-verses"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={styles.iconBadge}>
              <Bell size={20} color={Colors.accent} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Daily Verse Notifications</Text>
              <Text style={styles.rowSubtitle}>Morning reminder at 8:00 AM</Text>
            </View>
            <Switch
              value={notificationsOn}
              onValueChange={(v) => void handleNotificationsToggle(v)}
              trackColor={{ false: Colors.surfaceLight, true: Colors.accent }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={Colors.surfaceLight}
              testID="toggle-notifications"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>CONNECT</Text>
        <View style={styles.card}>
          {renderLinkRow(
            'Facebook',
            'Proverbs 31 Ways',
            <Facebook size={20} color={Colors.accent} />,
            () => void openUrl(FACEBOOK_URL),
            'link-facebook',
          )}
          {renderLinkRow(
            'Follow Us on Instagram',
            '@Proverbs31Devotionals',
            <Instagram size={20} color={Colors.accent} />,
            () => void openUrl(INSTAGRAM_URL),
            'link-instagram',
          )}
          {renderLinkRow(
            'Join Our Community',
            'proverbs31way.com (women only)',
            <Users size={20} color={Colors.accent} />,
            () => void openUrl(COMMUNITY_URL),
            'link-community',
          )}
          {renderLinkRow(
            'Contact Us',
            CONTACT_EMAIL,
            <Mail size={20} color={Colors.accent} />,
            () => void handleContact(),
            'link-contact',
          )}
          {renderLinkRow(
            'More Apps',
            'Christian App Empire on the App Store',
            <Grid size={20} color={Colors.accent} />,
            () => void openUrl(MORE_APPS_URL),
            'link-more-apps',
          )}
          <TouchableOpacity
            style={styles.simpleRow}
            onPress={() => void openUrl(PRIVACY_POLICY_URL)}
            activeOpacity={0.7}
            testID="privacy-policy"
          >
            <View style={styles.iconBadge}>
              <FileText size={20} color={Colors.accent} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Privacy Policy</Text>
              <Text style={styles.rowSubtitle}>How we handle your data</Text>
            </View>
            <ChevronRight size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.simpleRow}
            onPress={() => {
              triggerHaptic();
              void maybeRequestAppReview();
            }}
            activeOpacity={0.7}
            testID="rate-app"
          >
            <View style={styles.iconBadge}>
              <Star size={20} color={Colors.accent} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Rate This App</Text>
              <Text style={styles.rowSubtitle}>Share your experience on the App Store</Text>
            </View>
            <ChevronRight size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>God&apos;s Math</Text>
          <Text style={styles.footerLine}>Developed By</Text>
          <Text style={styles.footerCompany}>Christian App Empire LLC</Text>
          <Text style={styles.footerCopyright}>
            Copyright © 2026 Christian App Empire LLC{'\n'}All Rights Reserved.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const createStyles = (Colors: ColorSet) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16, paddingBottom: 48 },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
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
    themeSwatch: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: Colors.border,
    },
    rowText: { flex: 1 },
    rowTitle: {
      fontSize: 16,
      fontWeight: '600',
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
    priceText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    ownedBadge: {
      backgroundColor: 'rgba(48,209,88,0.15)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
    },
    ownedText: {
      color: Colors.success,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: 64,
    },
    restoreText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500', flex: 1 },
    footer: { alignItems: 'center', marginTop: 32, paddingTop: 24 },
    footerTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 8 },
    footerLine: { fontSize: 13, color: Colors.textSecondary },
    footerCompany: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.accent,
      marginTop: 4,
      marginBottom: 12,
    },
    footerCopyright: {
      fontSize: 12,
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
