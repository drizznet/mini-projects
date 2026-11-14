import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function tabIcon(
  name: { ios: string; android: string; web: string },
  color: string,
) {
  return (
    <SymbolView
      name={name as never}
      tintColor={color}
      size={24}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#161616' : '#f4f4f5',
          borderTopColor: colorScheme === 'dark' ? '#2a2a2a' : '#e6e6e6',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) =>
            tabIcon({ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }, String(color)),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color }) =>
            tabIcon({ ios: 'timer', android: 'timer', web: 'timer' }, String(color)),
        }}
      />
      <Tabs.Screen
        name="commitments"
        options={{
          title: 'Commitments',
          tabBarIcon: ({ color }) =>
            tabIcon({ ios: 'checkmark.seal', android: 'verified', web: 'verified' }, String(color)),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) =>
            tabIcon({ ios: 'ellipsis.circle', android: 'more_horiz', web: 'more_horiz' }, String(color)),
        }}
      />
    </Tabs>
  );
}
