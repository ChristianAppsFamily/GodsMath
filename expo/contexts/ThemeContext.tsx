import { useEffect, useState, useCallback, useMemo } from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { darkColors, lightColors, type ColorSet } from '@/constants/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_MODE_KEY = 'godmath_theme_mode';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      } catch (error) {
        console.log('[ThemeContext] Error loading mode:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('[ThemeContext] System scheme changed:', colorScheme);
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setMode = useCallback(async (next: ThemeMode): Promise<void> => {
    try {
      setModeState(next);
      await AsyncStorage.setItem(THEME_MODE_KEY, next);
      console.log('[ThemeContext] Saved mode:', next);
    } catch (error) {
      console.log('[ThemeContext] Error saving mode:', error);
    }
  }, []);

  const effectiveScheme: 'light' | 'dark' = useMemo(() => {
    if (mode === 'system') {
      return systemScheme === 'light' ? 'light' : 'dark';
    }
    return mode;
  }, [mode, systemScheme]);

  const colors: ColorSet = useMemo(
    () => (effectiveScheme === 'light' ? lightColors : darkColors),
    [effectiveScheme],
  );

  return useMemo(
    () => ({ mode, setMode, effectiveScheme, colors, isLoading }),
    [mode, setMode, effectiveScheme, colors, isLoading],
  );
});

export function useThemeColors(): ColorSet {
  const { colors } = useTheme();
  return colors;
}
