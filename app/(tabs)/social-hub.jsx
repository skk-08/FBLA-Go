import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, radius } from '../../constants/theme';
import { useSocialHubViewModel } from '../../viewmodels/useSocialHubViewModel';

const DESKTOP_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export default function SocialHubScreen() {
  const { webUrl, webViewLoading, setWebViewLoading, webViewError, setWebViewError, openInApp } =
    useSocialHubViewModel();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="logo-instagram" size={24} color={colors.accent} />
          <Text style={styles.headerTitle}>Social Hub</Text>
        </View>
        <TouchableOpacity style={styles.openBtn} onPress={openInApp}>
          <Text style={styles.openBtnText}>Open in App</Text>
          <Ionicons name="open-outline" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {webViewError ? (
        <View style={styles.errorView}>
          <Ionicons name="wifi-outline" size={48} color={colors.muted} />
          <Text style={styles.errorText}>Couldn't load Instagram</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => setWebViewError(false)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deepLinkBtn} onPress={openInApp}>
            <Text style={styles.deepLinkText}>Open Instagram App</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.webContainer}>
          {webViewLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Loading @fbla_pbl…</Text>
            </View>
          )}
          <WebView
            source={{ uri: webUrl }}
            userAgent={DESKTOP_UA}
            style={styles.webView}
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            onError={() => { setWebViewError(true); setWebViewLoading(false); }}
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.primary },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerLeft:     { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerTitle:    { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  openBtn:        { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.accent, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill },
  openBtnText:    { color: colors.primary, fontSize: fontSize.sm, fontWeight: '700' },
  webContainer:   { flex: 1 },
  webView:        { flex: 1, backgroundColor: colors.primary },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, zIndex: 10, gap: spacing.md },
  loadingText:    { color: colors.muted, fontSize: fontSize.sm },
  errorView:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg, padding: spacing.xxl },
  errorText:      { color: colors.white, fontSize: fontSize.lg, fontWeight: '600' },
  retryBtn:       { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  retryText:      { color: colors.muted, fontSize: fontSize.base },
  deepLinkBtn:    { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill, backgroundColor: colors.accent },
  deepLinkText:   { color: colors.primary, fontSize: fontSize.base, fontWeight: '700' },
});
