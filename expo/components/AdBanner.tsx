import React from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useAds } from '@/providers/AdsProvider';

interface AdBannerProps {
  containerStyle?: ViewStyle;
}

export default function AdBanner({ containerStyle }: AdBannerProps) {
  const { adsEnabled, bannerAdUnitId, canRequestPersonalizedAds } = useAds();

  if (!adsEnabled || Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: !canRequestPersonalizedAds }}
        onAdFailedToLoad={(error) => {
          if (__DEV__) {
            console.warn('[AdBanner] Failed to load:', error.message);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
  },
});
