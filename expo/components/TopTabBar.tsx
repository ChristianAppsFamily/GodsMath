import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Calculator, Briefcase, Clock, Settings as SettingsIcon } from 'lucide-react-native';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';
import { useAds } from '@/providers/AdsProvider';

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

const ROUTE_ICONS: Record<string, { icon: IconComponent; testID: string; label: string }> = {
  '(calculator)': { icon: Calculator, testID: 'tab-calculator', label: 'Calculator' },
  tools: { icon: Briefcase, testID: 'tab-tools', label: 'Tools' },
  history: { icon: Clock, testID: 'tab-history', label: 'History' },
  settings: { icon: SettingsIcon, testID: 'tab-settings', label: 'Settings' },
};

export default function TopTabBar({ state, navigation }: BottomTabBarProps) {
  const Colors = useThemeColors();
  const { onTabSwitch } = useAds();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        <Text style={styles.title} numberOfLines={1} testID="top-bar-title">
          God Math
        </Text>
        <View style={styles.icons}>
        {state.routes.map((route, index) => {
          const config = ROUTE_ICONS[route.name];
          if (!config) return null;
          const Icon = config.icon;
          const isFocused = state.index === index;

          const onPress = () => {
            if (Platform.OS !== 'web') {
              void Haptics.selectionAsync();
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              onTabSwitch();
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={config.label}
              onPress={onPress}
              style={styles.button}
              activeOpacity={0.7}
              testID={config.testID}
              hitSlop={8}
            >
              <View
                style={[
                  styles.iconWrap,
                  isFocused && { backgroundColor: Colors.surfaceLight },
                ]}
              >
                <Icon
                  size={24}
                  color={isFocused ? Colors.accent : Colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          );
        })}
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: ColorSet) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: Colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: Colors.text,
      letterSpacing: 0.2,
      marginRight: 8,
      flexShrink: 1,
    },
    icons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
    },
    iconWrap: {
      width: 38,
      height: 38,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
