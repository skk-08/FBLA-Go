import { useState } from 'react';
import {
  View, Text, Image, Pressable, Alert, KeyboardAvoidingView,
  Platform, ScrollView, Modal, TextInput, StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLoginViewModel } from '../../viewmodels/useAuthViewModel';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { colors, spacing, radius, fontSize } from '../../constants/theme';

const LOGO = require('../../assets/fblago-logo.png');

function Watermark() {
  return (
    <View style={s.watermark}>
      <Image source={LOGO} style={s.watermarkIcon} resizeMode="contain" />
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const {
    email, setEmail, password, setPassword,
    errors, serverError, isLoading,
    handleLogin, handleForgotPassword,
  } = useLoginViewModel();

  async function onForgotPassword() {
    const sent = await handleForgotPassword();
    if (sent) {
      setShowForgot(false);
      Alert.alert('Email sent', 'Check your inbox for a password reset link.');
    }
  }

  // ── WELCOME SCREEN ──────────────────────────────────────────────────────────
  if (!showForm) {
    return (
      <SafeAreaView style={s.safe}>
        <Pressable onPress={() => router.replace('/onboarding')} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
        <View style={s.welcomeContent}>
          {/* Logo */}
          <View style={s.logoContainer}>
            <Image source={LOGO} style={s.logoImg} resizeMode="cover" />
          </View>

          <Text style={s.welcomeHeading}>Login</Text>

          <Pressable style={s.primaryBtn} onPress={() => setShowForm(true)}>
            <Text style={s.primaryBtnText}>Login with school email</Text>
          </Pressable>
        </View>

        <View style={s.welcomeFooter}>
          <Text style={s.footerText}>
            {"Didn't have an account? "}
            <Text
              style={s.footerLink}
              onPress={() => router.push('/(auth)/signup')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── LOGIN FORM ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <Pressable onPress={() => setShowForm(false)} style={s.backBtn}>
        <Ionicons name="chevron-back" size={24} color={colors.white} />
      </Pressable>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={s.formScroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={s.formTitle}>Login</Text>

          <ErrorBanner message={serverError} />

          <View style={s.fieldsGroup}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Your School Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={s.input}
            />
            {errors.email ? (
              <Text style={s.fieldError}>{errors.email}</Text>
            ) : null}

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter Your Password"
              placeholderTextColor="#888"
              secureTextEntry
              autoComplete="password"
              style={s.input}
            />
            {errors.password ? (
              <Text style={s.fieldError}>{errors.password}</Text>
            ) : null}

            <Pressable onPress={() => setShowForgot(true)} style={s.forgotWrap}>
              <Text style={s.forgotText}>Forgot Password?</Text>
            </Pressable>
          </View>

          {/* Pushes Sign In button toward bottom */}
          <View style={{ flex: 1, minHeight: 80 }} />

          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            style={[s.primaryBtn, isLoading && { backgroundColor: '#C4A000' }]}
          >
            <Text style={s.primaryBtnText}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </Text>
          </Pressable>

          <View style={{ height: spacing.xxl * 2 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Watermark />

      {/* Forgot Password Modal */}
      <Modal visible={showForgot} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Reset Password</Text>
            <Text style={s.modalSub}>
              Enter your email and we'll send you a reset link.
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Your school email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[s.input, { marginBottom: spacing.md }]}
            />
            <Pressable
              onPress={onForgotPassword}
              style={[s.primaryBtn, { marginBottom: spacing.sm }]}
            >
              <Text style={s.primaryBtnText}>Send Reset Link</Text>
            </Pressable>
            <Pressable onPress={() => setShowForgot(false)} style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
              <Text style={{ color: colors.muted }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: colors.primary },

  // Welcome
  backBtn:         { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xs, alignSelf: 'flex-start' },
  welcomeContent:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  logoContainer:   { width: 130, height: 130, alignSelf: 'center', marginBottom: spacing.xxl * 2 },
  logoImg:         { width: '100%', height: '100%' },
  welcomeHeading:  { color: colors.white, fontSize: 34, fontWeight: '900', marginBottom: spacing.xxl, textAlign: 'center' },
  welcomeFooter:   { paddingBottom: spacing.xxl * 2, alignItems: 'center' },
  footerText:      { color: colors.white, fontSize: fontSize.sm },
  footerLink:      { color: colors.accent, textDecorationLine: 'underline', fontWeight: '600' },

  // Shared button
  primaryBtn:      { backgroundColor: colors.accent, borderRadius: radius.pill, paddingVertical: 16, width: '100%', alignItems: 'center' },
  primaryBtnText:  { color: '#1A1A1A', fontSize: fontSize.base, fontWeight: '600' },

  // Form
  formScroll:      { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl },
  formTitle:       { color: colors.white, fontSize: 36, fontWeight: '800', textAlign: 'center', marginBottom: spacing.xxl },
  fieldsGroup:     { gap: 0 },
  input:           { backgroundColor: '#D9D9D9', borderRadius: 12, paddingHorizontal: spacing.lg, paddingVertical: 18, fontSize: fontSize.base, color: '#1A1A1A', marginBottom: spacing.md },
  fieldError:      { color: colors.error, fontSize: fontSize.xs, marginTop: -spacing.sm, marginBottom: spacing.sm },
  forgotWrap:      { alignSelf: 'center', marginTop: spacing.xs },
  forgotText:      { color: colors.accent, fontSize: fontSize.sm, textDecorationLine: 'underline' },

  // Watermark
  watermark:       { position: 'absolute', bottom: spacing.xl, right: spacing.xl, alignItems: 'center' },
  watermarkIcon:   { width: 48, height: 48 },

  // Modal
  modalOverlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: spacing.xl },
  modalCard:       { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.xl },
  modalTitle:      { color: colors.white, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.md },
  modalSub:        { color: colors.muted, fontSize: fontSize.sm, marginBottom: spacing.lg },
});
