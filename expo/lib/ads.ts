import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

let initialized = false;
let adsReady = false;
let initPromise: Promise<void> | null = null;
const readyListeners = new Set<() => void>();

function notifyReady() {
  adsReady = true;
  readyListeners.forEach((listener) => listener());
  readyListeners.clear();
}

/** Initialize Google Mobile Ads SDK (call after ATT on iOS). */
export async function initializeAds(): Promise<void> {
  if (Platform.OS === 'web') {
    notifyReady();
    return;
  }

  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (initialized) {
      if (!adsReady) notifyReady();
      return;
    }

    try {
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      });
      await mobileAds().initialize();
      initialized = true;
      notifyReady();
      if (__DEV__) {
        console.log('[AdMob] SDK initialized (test units when USE_TEST_ADS / __DEV__)');
      }
    } catch (err) {
      console.warn('[AdMob] Initialize failed:', err);
      initialized = true;
      notifyReady();
    }
  })();

  return initPromise;
}

export function isAdsReady(): boolean {
  return adsReady;
}

export function whenAdsReady(listener: () => void): () => void {
  if (adsReady) {
    listener();
    return () => undefined;
  }
  readyListeners.add(listener);
  return () => readyListeners.delete(listener);
}
