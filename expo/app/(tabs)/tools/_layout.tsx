import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function ToolsLayout() {
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
        options={{ title: 'Financial Tools' }} 
      />
      <Stack.Screen 
        name="loan" 
        options={{ title: 'Loan Calculator' }} 
      />
      <Stack.Screen 
        name="tip" 
        options={{ title: 'Tip Calculator' }} 
      />
      <Stack.Screen 
        name="interest" 
        options={{ title: 'Interest Calculator' }} 
      />
    </Stack>
  );
}
