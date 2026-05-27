import { useEffect, useState, useCallback, useMemo } from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { darkColors, lightColors, type ColorSet } from '@/constants/colors';
import { applyCustomTheme, type CustomThemeId } from '@/constants/customThemes';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_MODE_KEY = 'godmath_theme_mode';
const CUSTOM_THEME_KEY = 'godmath_custom_theme';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [customThemeId, setCustomThemeIdState] = useState<CustomThemeId>('default');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    void (async () => {
      try {
        const [storedMode, storedTheme] = await Promise.all([
          AsyncStorage.getItem(THEME_MODE_KEY),
          AsyncStorage.getItem(CUSTOM_THEME_KEY),
        ]);
        if (storedMode === 'light' || storedMode === 'dark' || storedMode === 'system') {
          setModeState(storedMode);
        }
        if (
          storedTheme === 'default' ||
          storedTheme === 'royal' ||
          storedTheme === 'olive' ||
          storedTheme === 'crimson' ||
          storedTheme === 'navy'
        ) {
          setCustomThemeIdState(storedTheme);
        }
      } catch (error) {
        console.warn('[ThemeContext] Error loading mode:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setMode = useCallback(async (next: ThemeMode): Promise<void> => {
    setModeState(next);
    await AsyncStorage.setItem(THEME_MODE_KEY, next);
  }, []);

  const setCustomThemeId = useCallback(async (next: CustomThemeId): Promise<void> => {
    setCustomThemeIdState(next);
    await AsyncStorage.setItem(CUSTOM_THEME_KEY, next);
  }, []);

  const effectiveScheme: 'light' | 'dark' = useMemo(() => {
    if (mode === 'system') {
      return systemScheme === 'light' ? 'light' : 'dark';
    }
    return mode;
  }, [mode, systemScheme]);

  const colors: ColorSet = useMemo(() => {
    const base = effectiveScheme === 'light' ? lightColors : darkColors;
    return applyCustomTheme(base, customThemeId);
  }, [effectiveScheme, customThemeId]);

  return useMemo(
    () => ({
      mode,
      setMode,
      customThemeId,
      setCustomThemeId,
      effectiveScheme,
      colors,
      isLoading,
    }),
    [mode, setMode, customThemeId, setCustomThemeId, effectiveScheme, colors, isLoading],
  );
});

export function useThemeColors(): ColorSet {
  const { colors } = useTheme();
  return colors;
}
