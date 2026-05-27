import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef } from 'react';
import { InteractionManager, Platform, View } from 'react-native';
import { initializeAds } from '@/lib/ads';
import { requestTrackingPermission } from '@/lib/att';
import { useAds } from '@/providers/AdsProvider';

type Props = {
  children: React.ReactNode;
};

/**
 * Hide splash → ATT prompt → AdMob init → ads on main screen.
 */
export function AppBootstrap({ children }: Props) {
  const { setPersonalizedAdsAllowed, openAdsGate } = useAds();
  const startupStarted = useRef(false);

  const runStartup = useCallback(async () => {
    if (startupStarted.current) return;
    startupStarted.current = true;

    if (Platform.OS === 'web') return;

    try {
      await SplashScreen.hideAsync();

      await new Promise<void>((resolve) => {
        InteractionManager.runAfterInteractions(() => {
          requestAnimationFrame(() => resolve());
        });
      });

      const trackingGranted = await requestTrackingPermission();
      setPersonalizedAdsAllowed(trackingGranted);
      await initializeAds();
      // Only after ATT finishes + AdMob initializes do we allow ads to render.
      openAdsGate();
    } catch (err) {
      console.warn('[Bootstrap] startup error:', err);
      await initializeAds().catch(() => undefined);
      openAdsGate();
    }
  }, [openAdsGate, setPersonalizedAdsAllowed]);

  const onRootLayout = useCallback(() => {
    void runStartup();
  }, [runStartup]);

  useEffect(() => {
    if (Platform.OS === 'web') void runStartup();
  }, [runStartup]);

  return (
    <View style={{ flex: 1 }} onLayout={onRootLayout}>
      {children}
    </View>
  );
}
