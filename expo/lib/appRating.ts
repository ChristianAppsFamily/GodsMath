import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking, Platform } from 'react-native';

const VISIT_COUNT_KEY = 'godmath_visit_count';
const HAS_RATED_KEY = 'godmath_has_rated';

const FIRST_PROMPT_VISIT = 3;
const PROMPT_INTERVAL = 3;

const APP_STORE_DEVELOPER_URL =
  'https://apps.apple.com/us/developer/christian-app-empire-llc/id787763898';

type StoreReviewModule = {
  isAvailableAsync: () => Promise<boolean>;
  requestReview: () => Promise<void>;
};

let storeReviewModule: StoreReviewModule | null | undefined;

function getStoreReviewModule(): StoreReviewModule | null {
  if (storeReviewModule !== undefined) return storeReviewModule;
  if (Platform.OS === 'web') {
    storeReviewModule = null;
    return null;
  }
  try {
    storeReviewModule = require('expo-store-review') as StoreReviewModule;
  } catch {
    storeReviewModule = null;
  }
  return storeReviewModule;
}

async function requestNativeReview(): Promise<boolean> {
  const StoreReview = getStoreReviewModule();
  if (!StoreReview) return false;
  try {
    if (!(await StoreReview.isAvailableAsync())) return false;
    await StoreReview.requestReview();
    return true;
  } catch {
    return false;
  }
}

export async function recordAppVisit(): Promise<number> {
  if (Platform.OS === 'web') return 0;
  const countRaw = await AsyncStorage.getItem(VISIT_COUNT_KEY);
  const next = (countRaw ? parseInt(countRaw, 10) : 0) + 1;
  await AsyncStorage.setItem(VISIT_COUNT_KEY, String(next));
  return next;
}

export async function maybeRequestAppReview(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const hasRated = await AsyncStorage.getItem(HAS_RATED_KEY);
    if (hasRated === 'true') return;

    const countRaw = await AsyncStorage.getItem(VISIT_COUNT_KEY);
    const visitCount = countRaw ? parseInt(countRaw, 10) : 0;

    if (visitCount < FIRST_PROMPT_VISIT) return;
    if (visitCount % PROMPT_INTERVAL !== 0) return;

    Alert.alert(
      "Enjoying God's Math?",
      'Your review helps other believers discover this calculator. Would you mind rating us on the App Store?',
      [
        { text: 'Not Now', style: 'cancel' },
        {
          text: 'Rate Now',
          onPress: () => {
            void (async () => {
              const usedNative = await requestNativeReview();
              if (!usedNative) {
                const canOpen = await Linking.canOpenURL(APP_STORE_DEVELOPER_URL);
                if (canOpen) await Linking.openURL(APP_STORE_DEVELOPER_URL);
              }
              await AsyncStorage.setItem(HAS_RATED_KEY, 'true');
            })();
          },
        },
      ],
    );
  } catch (err) {
    console.warn('[StoreReview] maybeRequestAppReview failed:', err);
  }
}
