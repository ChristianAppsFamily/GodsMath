import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import {
  AdEventType,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import createContextHook from '@nkzw/create-context-hook';
import { BANNER_AD_UNIT_ID, INTERSTITIAL_AD_UNIT_ID } from '@/constants/ads';
import { initializeAds, isAdsReady, whenAdsReady } from '@/lib/ads';
import { useAdSettings } from '@/contexts/AdSettingsContext';

const MAX_INTERSTITIALS_PER_SESSION = 3;

function useAdsContext() {
  const { removeAds } = useAdSettings();
  const [sdkReady, setSdkReady] = useState(isAdsReady());
  const [canRequestPersonalizedAds, setCanRequestPersonalizedAds] = useState(false);
  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const interstitialsShownRef = useRef(0);
  const tabSwitchCountRef = useRef(0);

  const isSupportedPlatform = Platform.OS === 'ios' || Platform.OS === 'android';

  useEffect(() => {
    if (Platform.OS === 'web') return;
    void initializeAds().then(() => {
      if (isAdsReady()) setSdkReady(true);
    });
    if (sdkReady) return;
    return whenAdsReady(() => setSdkReady(true));
  }, [sdkReady]);

  const loadInterstitial = useCallback(() => {
    if (!sdkReady || !isSupportedPlatform || removeAds || !INTERSTITIAL_AD_UNIT_ID) return;

    const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: !canRequestPersonalizedAds,
    });

    interstitial.addAdEventListener(AdEventType.LOADED, () => setIsInterstitialLoaded(true));
    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setIsInterstitialLoaded(false);
      loadInterstitial();
    });
    interstitial.addAdEventListener(AdEventType.ERROR, () => setIsInterstitialLoaded(false));
    interstitial.load();
    interstitialRef.current = interstitial;
  }, [canRequestPersonalizedAds, isSupportedPlatform, removeAds, sdkReady]);

  useEffect(() => {
    if (sdkReady) loadInterstitial();
  }, [sdkReady, loadInterstitial]);

  const showInterstitialIfLoaded = useCallback(async () => {
    if (!sdkReady || removeAds) return;
    if (interstitialsShownRef.current >= MAX_INTERSTITIALS_PER_SESSION) return;

    const interstitial = interstitialRef.current;
    if (!interstitial || !isInterstitialLoaded) return;

    interstitialsShownRef.current += 1;
    await interstitial.show();
    setIsInterstitialLoaded(false);
  }, [isInterstitialLoaded, removeAds, sdkReady]);

  const onTabSwitch = useCallback(() => {
    if (!sdkReady || removeAds) return;
    tabSwitchCountRef.current += 1;
    if (tabSwitchCountRef.current % 4 === 0) {
      void showInterstitialIfLoaded();
    }
  }, [removeAds, sdkReady, showInterstitialIfLoaded]);

  const setPersonalizedAdsAllowed = useCallback((allowed: boolean) => {
    setCanRequestPersonalizedAds(allowed);
  }, []);

  return useMemo(
    () => ({
      sdkReady,
      adsEnabled: isSupportedPlatform && !removeAds,
      sdkReady,
      bannerAdUnitId: BANNER_AD_UNIT_ID,
      canRequestPersonalizedAds,
      setPersonalizedAdsAllowed,
      onTabSwitch,
      showInterstitialIfLoaded,
    }),
    [
      sdkReady,
      isSupportedPlatform,
      removeAds,
      canRequestPersonalizedAds,
      setPersonalizedAdsAllowed,
      onTabSwitch,
      showInterstitialIfLoaded,
      bannerAdUnitId,
    ],
  );
}

export const [AdsProvider, useAds] = createContextHook(useAdsContext);
