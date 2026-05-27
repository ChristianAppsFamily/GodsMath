import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppBootstrap } from '@/components/AppBootstrap';
import { AppEngagement } from '@/components/AppEngagement';
import { HistoryProvider } from '@/contexts/HistoryContext';
import { AdSettingsProvider } from '@/contexts/AdSettingsContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { AdsProvider } from '@/providers/AdsProvider';
import { PurchaseProvider } from '@/providers/PurchaseProvider';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors, effectiveScheme } = useTheme();
  return (
    <>
      <StatusBar style={effectiveScheme === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AdSettingsProvider>
            <HistoryProvider>
              <AdsProvider>
                <PurchaseProvider>
                  <AppBootstrap>
                    <AppEngagement />
                    <RootLayoutNav />
                  </AppBootstrap>
                </PurchaseProvider>
              </AdsProvider>
            </HistoryProvider>
          </AdSettingsProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
