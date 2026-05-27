import React from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useAds } from '@/providers/AdsProvider';

interface AdBannerProps {
  containerStyle?: ViewStyle;
}

export default function AdBanner({ containerStyle }: AdBannerProps) {
  const { adsEnabled, sdkReady, bannerAdUnitId, canRequestPersonalizedAds } = useAds();

  if (!adsEnabled || Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]} testID="ad-banner-container">
      {sdkReady ? (
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: !canRequestPersonalizedAds }}
          onAdLoaded={() => {
            console.log('[AdBanner] Loaded', bannerAdUnitId);
          }}
          onAdFailedToLoad={(error) => {
            console.warn('[AdBanner] Failed to load:', error.message, bannerAdUnitId);
          }}
        />
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  placeholder: {
    width: 320,
    height: 50,
    backgroundColor: 'rgba(128,128,128,0.12)',
    borderRadius: 4,
  },
});
