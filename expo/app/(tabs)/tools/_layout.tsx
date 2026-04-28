import { Stack } from 'expo-router';
import { useThemeColors } from '@/contexts/ThemeContext';

export default function ToolsLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="loan" options={{ title: 'Loan Calculator' }} />
      <Stack.Screen name="tip" options={{ title: 'Tip Calculator' }} />
      <Stack.Screen name="interest" options={{ title: 'Interest Calculator' }} />
      <Stack.Screen name="mortgage" options={{ title: 'Mortgage Calculator' }} />
      <Stack.Screen name="salary" options={{ title: 'Hourly ↔ Salary' }} />
      <Stack.Screen name="fuel" options={{ title: 'Fuel Cost Calculator' }} />
    </Stack>
  );
}
