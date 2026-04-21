import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/colors';

interface AdBannerProps {
  testId?: string;
}

export default function AdBanner({ testId = 'ca-app-pub-3940256099942544/6300978111' }: AdBannerProps) {
  console.log('[AdBanner] Rendering with test ID:', testId);
  
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.text}>Ad Space</Text>
        <Text style={styles.subtext}>Banner Ad ({Platform.OS})</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 4,
  },
  banner: {
    width: 320,
    height: 50,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  subtext: {
    color: Colors.textSecondary,
    fontSize: 10,
    opacity: 0.6,
  },
});
