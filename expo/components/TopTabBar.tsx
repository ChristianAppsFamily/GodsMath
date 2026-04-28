import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Calculator, Briefcase, Clock, Settings as SettingsIcon } from 'lucide-react-native';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { ColorSet } from '@/constants/colors';

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

const ROUTE_ICONS: Record<string, { icon: IconComponent; testID: string; label: string }> = {
  '(calculator)': { icon: Calculator, testID: 'tab-calculator', label: 'Calculator' },
  tools: { icon: Briefcase, testID: 'tab-tools', label: 'Tools' },
  history: { icon: Clock, testID: 'tab-history', label: 'History' },
  settings: { icon: SettingsIcon, testID: 'tab-settings', label: 'Settings' },
};

export default function TopTabBar({ state, navigation }: BottomTabBarProps) {
  const Colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
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
      justifyContent: 'space-around',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
