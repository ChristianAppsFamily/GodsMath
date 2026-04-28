import { Stack } from 'expo-router';
import { useThemeColors } from '@/contexts/ThemeContext';

export default function CalculatorLayout() {
  const Colors = useThemeColors();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'God Math',
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
