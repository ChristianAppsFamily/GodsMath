import { useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

const REMOVE_ADS_KEY = 'fastcalc_remove_ads';
const SHOW_VERSES_KEY = 'fastcalc_show_verses';

export const [AdSettingsProvider, useAdSettings] = createContextHook(() => {
  const [removeAds, setRemoveAdsState] = useState<boolean>(false);
  const [showVerses, setShowVersesState] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    void loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const [storedAds, storedVerses] = await Promise.all([
        AsyncStorage.getItem(REMOVE_ADS_KEY),
        AsyncStorage.getItem(SHOW_VERSES_KEY),
      ]);
      setRemoveAdsState(storedAds === 'true');
      setShowVersesState(storedVerses === null ? true : storedVerses === 'true');
      console.log('[AdSettingsContext] Loaded settings:', { removeAds: storedAds, showVerses: storedVerses });
    } catch (error) {
      console.log('[AdSettingsContext] Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setRemoveAds = useCallback(async (value: boolean): Promise<void> => {
    try {
      setRemoveAdsState(value);
      await AsyncStorage.setItem(REMOVE_ADS_KEY, value ? 'true' : 'false');
      console.log('[AdSettingsContext] Saved removeAds:', value);
    } catch (error) {
      console.log('[AdSettingsContext] Error saving removeAds:', error);
    }
  }, []);

  const toggleRemoveAds = useCallback(async (): Promise<void> => {
    const nextValue = !removeAds;
    await setRemoveAds(nextValue);
  }, [removeAds, setRemoveAds]);

  const setShowVerses = useCallback(async (value: boolean): Promise<void> => {
    try {
      setShowVersesState(value);
      await AsyncStorage.setItem(SHOW_VERSES_KEY, value ? 'true' : 'false');
      console.log('[AdSettingsContext] Saved showVerses:', value);
    } catch (error) {
      console.log('[AdSettingsContext] Error saving showVerses:', error);
    }
  }, []);

  const toggleShowVerses = useCallback(async (): Promise<void> => {
    const nextValue = !showVerses;
    await setShowVerses(nextValue);
  }, [showVerses, setShowVerses]);

  return useMemo(() => ({
    removeAds,
    showVerses,
    isLoading,
    setRemoveAds,
    toggleRemoveAds,
    setShowVerses,
    toggleShowVerses,
  }), [removeAds, showVerses, isLoading, setRemoveAds, toggleRemoveAds, setShowVerses, toggleShowVerses]);
});
