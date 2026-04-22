import { View, Text, Pressable, StyleSheet, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, radius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

export default function AchievementScreen() {
  const router = useRouter();
  const { colors: t, isDark } = useTheme();
  const dark = isDark;
  const { event, placement } = useLocalSearchParams();

  const eventName     = event     ?? 'Mobile App Development';
  const placementText = placement ?? 'Top 10';
  const shareText     = `🏆 I placed ${placementText} in ${eventName} at the 2026 FBLA State Leadership Conference! #FBLA #FBLAgo #FutureBusinessLeaders`;

  async function shareToInstagram() {
    const opened = await Linking.openURL('instagram://app').catch(() => false);
    if (!opened) await Share.share({ message: shareText });
  }

  async function shareToX() {
    const opened = await Linking.openURL(`twitter://post?message=${encodeURIComponent(shareText)}`).catch(() => false);
    if (!opened) await Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`).catch(() => Share.share({ message: shareText }));
  }

  async function shareToSnapchat() {
    const opened = await Linking.openURL('snapchat://').catch(() => false);
    if (!opened) await Share.share({ message: shareText });
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={{ marginRight: spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={s.headerTitle}>Congratulations!</Text>
      </View>

      <View style={[s.body, dark && { backgroundColor: t.bg }]}>
        <Text style={[s.placementText, dark && { color: colors.accent }]}>
          You Placed {placementText}{'\n'}in {eventName}!
        </Text>

        <View style={[s.trophyWrap, dark && { backgroundColor: t.card }]}>
          <Ionicons name="trophy" size={100} color="#C8A000" />
        </View>

        <Text style={[s.shareHeading, dark && { color: t.text }]}>Share Your Achievement!</Text>

        <Pressable style={s.igBtn} onPress={shareToInstagram}>
          <Ionicons name="logo-instagram" size={24} color="#fff" />
          <Text style={s.btnText}>Share to Instagram</Text>
        </Pressable>

        <Pressable style={s.xBtn} onPress={shareToX}>
          <Ionicons name="logo-twitter" size={24} color="#fff" />
          <Text style={s.btnText}>Share to X</Text>
        </Pressable>

        <Pressable style={s.snapBtn} onPress={shareToSnapchat}>
          <Ionicons name="logo-snapchat" size={24} color="#1A1A1A" />
          <Text style={[s.btnText, { color: '#1A1A1A' }]}>Share to Snapchat</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.primary },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  headerTitle:   { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  body:          { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: spacing.xl },
  placementText: { color: colors.primary, fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: spacing.xl, marginBottom: spacing.xl },
  trophyWrap:    { backgroundColor: '#F0F0F0', borderRadius: 12, width: 180, height: 160, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xxl },
  shareHeading:  { color: '#1A1A1A', fontSize: fontSize.lg, fontWeight: '800', marginBottom: spacing.xl },
  igBtn:         { width: '100%', backgroundColor: '#E04060', borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: 16, marginBottom: spacing.md },
  xBtn:          { width: '100%', backgroundColor: '#1A1A1A', borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: 16, marginBottom: spacing.md },
  snapBtn:       { width: '100%', backgroundColor: '#FFFC00', borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: 16, marginBottom: spacing.md },
  btnText:       { color: '#fff', fontSize: fontSize.base, fontWeight: '700' },
});
