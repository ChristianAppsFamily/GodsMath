import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';
import { useAdSettings } from '@/contexts/AdSettingsContext';
import TopTabBar from '@/components/TopTabBar';
import AdBanner from '@/components/AdBanner';

export default function TabLayout() {
  const Colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { removeAds } = useAdSettings();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  return (
    <View style={styles.container}>
      <Tabs
        tabBar={(props) => <TopTabBar {...props} />}
        style={styles.tabs}
        screenOptions={{
          headerShown: false,
          tabBarPosition: 'top',
        }}
      >
        <Tabs.Screen name="(calculator)" />
        <Tabs.Screen name="tools" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="settings" />
      </Tabs>
      {!removeAds && (
        <View
          style={[
            styles.adBar,
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 },
          ]}
          testID="bottom-ad-bar"
        >
          <AdBanner />
        </View>
      )}
    </View>
  );
}

const createStyles = (Colors: ColorSet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    tabs: {
      flex: 1,
    },
    adBar: {
      backgroundColor: Colors.background,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
      paddingTop: 4,
    },
  });
