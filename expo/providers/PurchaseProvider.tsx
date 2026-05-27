import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  finishTransaction,
  fetchProducts,
  getAvailablePurchases,
  initConnection,
  type Product,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  restorePurchases,
} from 'expo-iap';
import createContextHook from '@nkzw/create-context-hook';
import { useAdSettings } from '@/contexts/AdSettingsContext';

const REMOVE_ADS_PRODUCT_ID =
  process.env.EXPO_PUBLIC_REMOVE_ADS_PRODUCT_ID ?? 'com.christianappempire.godsmath.removeads';

function usePurchaseContext() {
  const { removeAds, setRemoveAds } = useAdSettings();
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const setup = async () => {
      try {
        await initConnection();
        setIsStoreReady(true);
        const fetched = await fetchProducts({
          skus: [REMOVE_ADS_PRODUCT_ID],
          type: 'in-app',
        });
        setProducts(fetched as Product[]);
      } catch (err) {
        console.warn('[IAP] initConnection error:', err);
      }
    };

    void setup();

    const purchaseUpdateSub = purchaseUpdatedListener(async (purchase) => {
      try {
        if (purchase.productId === REMOVE_ADS_PRODUCT_ID) {
          await finishTransaction({ purchase, isConsumable: false });
          await setRemoveAds(true);
          Alert.alert('Thank you!', 'Pro version unlocked. Ads removed and custom themes are now available.');
        }
      } catch (err) {
        console.warn('[IAP] finishTransaction error:', err);
      } finally {
        setIsPurchasing(false);
      }
    });

    const purchaseErrorSub = purchaseErrorListener((error) => {
      console.warn('[IAP] purchase error:', error);
      setIsPurchasing(false);
    });

    return () => {
      purchaseUpdateSub.remove();
      purchaseErrorSub.remove();
    };
  }, [setRemoveAds]);

  const verifyOwnership = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web' || !isStoreReady) return false;
    try {
      const purchases = await getAvailablePurchases();
      const owned = purchases.some((p) => p.productId === REMOVE_ADS_PRODUCT_ID);
      if (owned) await setRemoveAds(true);
      return owned;
    } catch {
      return false;
    }
  }, [isStoreReady, setRemoveAds]);

  useEffect(() => {
    if (isStoreReady && !removeAds) {
      void verifyOwnership();
    }
  }, [isStoreReady, removeAds, verifyOwnership]);

  const purchaseRemoveAds = useCallback(async () => {
    if (removeAds) return;
    if (Platform.OS === 'web') {
      Alert.alert('Unavailable', 'Purchases are only available on iOS and Android.');
      return;
    }
    if (!isStoreReady) {
      Alert.alert('Store Unavailable', 'Please try again in a moment.');
      return;
    }
    setIsPurchasing(true);
    try {
      await requestPurchase({
        request: {
          ios: { sku: REMOVE_ADS_PRODUCT_ID },
          android: { skus: [REMOVE_ADS_PRODUCT_ID] },
        },
        type: 'in-app',
      });
    } catch (err) {
      setIsPurchasing(false);
      console.warn('[IAP] requestPurchase error:', err);
      Alert.alert('Purchase Failed', 'Could not complete the purchase. Please try again.');
    }
  }, [isStoreReady, removeAds]);

  const restore = useCallback(async () => {
    if (Platform.OS === 'web') return;
    setIsRestoring(true);
    try {
      await restorePurchases();
      const owned = await verifyOwnership();
      if (owned) {
        Alert.alert('Restored', 'Your Pro purchase has been restored.');
      } else {
        Alert.alert('No Purchases Found', 'We could not find a previous Pro purchase on this device.');
      }
    } catch {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  }, [verifyOwnership]);

  const getPriceLabel = useCallback((): string => {
    const product = products[0];
    if (product && 'displayPrice' in product && product.displayPrice) {
      return String(product.displayPrice);
    }
    return '$4.99';
  }, [products]);

  return {
    removeAds,
    isStoreReady,
    isPurchasing,
    isRestoring,
    purchaseRemoveAds,
    restore,
    getPriceLabel,
  };
}

export const [PurchaseProvider, usePurchases] = createContextHook(usePurchaseContext);
