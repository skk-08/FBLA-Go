import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { useUIStore } from '../../store/uiStore';
import { View, Text } from 'react-native';

function TabIcon({ name, color, focused }) {
  return <Ionicons name={name} size={24} color={color} />;
}

function TabIconWithBadge({ name, color }) {
  const count = useUIStore((s) => s.notificationCount);
  return (
    <View>
      <Ionicons name={name} size={24} color={color} />
      {count > 0 && (
        <View style={{
          position: 'absolute', top: -4, right: -8,
          backgroundColor: colors.error, borderRadius: 10,
          minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3,
        }}>
          <Text style={{ color: colors.white, fontSize: 10, fontWeight: 'bold' }}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor:   colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-event"
        options={{
          title: 'My Event',
          tabBarIcon: ({ color }) => <TabIcon name="trophy" color={color} />,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color }) => <TabIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="messaging"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <TabIconWithBadge name="chatbubbles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="social-hub"
        options={{
          title: 'Social Hub',
          tabBarIcon: ({ color }) => <TabIcon name="globe" color={color} />,
        }}
      />
    </Tabs>
  );
}
