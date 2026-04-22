import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { useUIStore } from '../../store/uiStore';
import { useTheme } from '../../hooks/useTheme';

function HomeIcon({ focused }) {
  const { isDark } = useTheme();
  return (
    <View style={{
      width: 58, height: 58, borderRadius: 29,
      backgroundColor: isDark ? '#0F1419' : '#fff',
      borderWidth: 2, borderColor: isDark ? '#fff' : colors.primary,
      justifyContent: 'center', alignItems: 'center',
      marginBottom: 26,
      shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2, shadowRadius: 5, elevation: 8,
    }}>
      <Ionicons name="home" size={26} color={isDark ? '#fff' : colors.primary} />
    </View>
  );
}

function MsgIcon({ color }) {
  const count = useUIStore((s) => s.notificationCount);
  return (
    <View>
      <Ionicons name="chatbubble-outline" size={24} color={color} />
      {count > 0 && (
        <View style={{
          position: 'absolute', top: -3, right: -7,
          backgroundColor: colors.error, borderRadius: 8,
          minWidth: 15, height: 15, justifyContent: 'center', alignItems: 'center',
        }}>
          <Text style={{ color: '#fff', fontSize: 8, fontWeight: '700' }}>
            {count > 9 ? '9+' : count}
          </Text>
        </View>
      )}
    </View>
  );
}

function PlannerIcon({ color }) {
  return (
    <View style={{ position: 'relative' }}>
      <Ionicons name="calendar-outline" size={24} color={color} />
      <View style={{
        position: 'absolute', bottom: -1, right: -3,
        width: 11, height: 11, borderRadius: 5.5,
        backgroundColor: color, justifyContent: 'center', alignItems: 'center',
      }}>
        <Text style={{ color: colors.primary, fontSize: 8, fontWeight: '900', lineHeight: 11 }}>+</Text>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 8,
        },
        tabBarActiveTintColor:   '#fff',
        tabBarInactiveTintColor: '#7A9BB5',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
      }}
    >
      {/* ── Visible tabs ─────────────────────────────────────────────── */}
      <Tabs.Screen
        name="messaging"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <MsgIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color }) => <PlannerIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="my-event"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <Ionicons name="menu-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={26} color={color} />,
        }}
      />

      {/* ── Hidden navigable screens (show tab bar but not in tab strip) ── */}
      <Tabs.Screen name="settings"              options={{ href: null }} />
      <Tabs.Screen name="social-hub"            options={{ href: null }} />
      <Tabs.Screen name="notifications"         options={{ href: null }} />
      <Tabs.Screen name="chapter-announcements" options={{ href: null }} />
      <Tabs.Screen name="id-upload"             options={{ href: null }} />
      <Tabs.Screen name="event-detail"          options={{ href: null }} />
      <Tabs.Screen name="achievement"           options={{ href: null }} />
    </Tabs>
  );
}
