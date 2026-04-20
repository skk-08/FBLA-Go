import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Modal, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginViewModel } from '../../viewmodels/useAuthViewModel';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { colors, spacing, fontSize, radius } from '../../constants/theme';

export default function LoginScreen() {
  const {
    email, setEmail, password, setPassword,
    errors, serverError, isLoading,
    handleLogin, handleForgotPassword,
  } = useLoginViewModel();

  const [showForgot, setShowForgot] = useState(false);

  async function onForgotPassword() {
    const sent = await handleForgotPassword();
    if (sent) {
      setShowForgot(false);
      Alert.alert('Email sent', 'Check your inbox for a password reset link.');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.xl }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: spacing.xxl }}>
            <Text style={{
              color: colors.accent, fontSize: 40, fontWeight: '800', letterSpacing: 1,
            }}>
              FBLAgo
            </Text>
            <Text style={{
              color: colors.white, fontSize: fontSize.base, marginTop: spacing.xs, opacity: 0.8,
            }}>
              Your FBLA. All in one place.
            </Text>
          </View>

          {/* Form */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: radius.modal,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{
              color: colors.white, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.lg,
            }}>
              Welcome back
            </Text>

            <ErrorBanner message={serverError} />

            <AppInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@school.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <AppInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              error={errors.password}
            />

            <Pressable
              onPress={() => setShowForgot(true)}
              style={{ alignSelf: 'flex-end', marginBottom: spacing.lg, marginTop: -spacing.xs }}
            >
              <Text style={{ color: colors.accent, fontSize: fontSize.sm }}>Forgot password?</Text>
            </Pressable>

            <AppButton title="Log In" onPress={handleLogin} isLoading={isLoading} />
          </View>

          {/* Sign up link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl }}>
            <Text style={{ color: colors.muted, fontSize: fontSize.sm }}>New to FBLAgo? </Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text style={{ color: colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
                  Create account
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal visible={showForgot} transparent animationType="fade">
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: spacing.xl,
        }}>
          <View style={{
            backgroundColor: colors.surface, borderRadius: radius.modal,
            padding: spacing.xl, borderWidth: 1, borderColor: colors.border,
          }}>
            <Text style={{ color: colors.white, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.md }}>
              Reset Password
            </Text>
            <Text style={{ color: colors.muted, fontSize: fontSize.sm, marginBottom: spacing.lg }}>
              Enter your email and we'll send you a reset link.
            </Text>
            <AppInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@school.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <AppButton title="Send Reset Link" onPress={onForgotPassword} />
            <AppButton title="Cancel" onPress={() => setShowForgot(false)} variant="outline" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
