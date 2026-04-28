import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { AdSettingsProvider } from "@/contexts/AdSettingsContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors, effectiveScheme } = useTheme();
  return (
    <>
      <StatusBar style={effectiveScheme === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
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
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AdSettingsProvider>
            <HistoryProvider>
              <RootLayoutNav />
            </HistoryProvider>
          </AdSettingsProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
