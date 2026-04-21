import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, radius } from '../constants/theme';

const INSTAGRAM_URL = 'https://www.instagram.com/fbla_pbl/';
const DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export default function SocialHubScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  function openInApp() {
    Linking.openURL('instagram://user?username=fbla_pbl')
      .catch(() => Linking.openURL(INSTAGRAM_URL));
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={{ marginRight: spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={s.headerTitle}>FBLA Social Hub</Text>
      </View>

      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Text style={s.latestLabel}>Latest Updates</Text>

        <View style={{ flex: 1 }}>
          {error ? (
            <View style={s.errWrap}>
              <Ionicons name="wifi-outline" size={48} color="#ccc" />
              <Text style={s.errText}>Couldn't load content</Text>
              <Pressable onPress={() => setError(false)} style={s.retryBtn}>
                <Text style={s.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {loading && (
                <View style={s.loadingOverlay}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              )}
              <WebView
                source={{ uri: INSTAGRAM_URL }}
                userAgent={DESKTOP_UA}
                style={{ flex: 1 }}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={()  => setLoading(false)}
                onError={()    => { setError(true); setLoading(false); }}
                javaScriptEnabled
                domStorageEnabled
              />
            </>
          )}
        </View>

        <View style={s.footer}>
          <Pressable style={s.openBtn} onPress={openInApp}>
            <Text style={s.openBtnText}>Open in App</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.primary },
  header:       { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  headerTitle:  { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  latestLabel:  { fontSize: fontSize.base, fontWeight: '800', color: '#1A1A1A', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  loadingOverlay:{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0', zIndex: 10 },
  errWrap:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg },
  errText:      { color: '#888', fontSize: fontSize.base },
  retryBtn:     { paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: 1, borderColor: '#ccc' },
  retryText:    { color: '#555', fontSize: fontSize.sm },
  footer:       { padding: spacing.xl, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  openBtn:      { backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 48 },
  openBtnText:  { color: colors.white, fontSize: fontSize.base, fontWeight: '600' },
});
