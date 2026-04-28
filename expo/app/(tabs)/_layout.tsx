import { Tabs } from 'expo-router';
import { Calculator, Briefcase, Clock } from 'lucide-react-native';
import { useThemeColors } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const Colors = useThemeColors();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 0.5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(calculator)"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color, size }) => <Calculator size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
