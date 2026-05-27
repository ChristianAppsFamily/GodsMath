import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * Google test units for Xcode / TestFlight builds (including Release where __DEV__ is false).
 * Set to `false` only for the final App Store submission build.
 */
export const USE_TEST_ADS = true;

export const ADMOB_APP_IDS = {
  ios: 'ca-app-pub-3002325591150738~4085524787',
  android: 'ca-app-pub-3002325591150738~2534343773',
} as const;

const PRODUCTION_BANNER = {
  ios: 'ca-app-pub-3002325591150738/1459361449',
  android: 'ca-app-pub-3002325591150738/1749087168',
} as const;

const PRODUCTION_INTERSTITIAL = {
  ios: 'ca-app-pub-3002325591150738/5646243807',
  android: 'ca-app-pub-3002325591150738/8688688589',
} as const;

export const BANNER_AD_UNIT_ID = USE_TEST_ADS
  ? TestIds.BANNER
  : Platform.OS === 'ios'
    ? PRODUCTION_BANNER.ios
    : PRODUCTION_BANNER.android;

export const INTERSTITIAL_AD_UNIT_ID = USE_TEST_ADS
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
    ? PRODUCTION_INTERSTITIAL.ios
    : PRODUCTION_INTERSTITIAL.android;

/** Reserve space above the bottom ad bar so the keypad is not flush against it. */
export const BOTTOM_AD_BAR_HEIGHT = 60;
