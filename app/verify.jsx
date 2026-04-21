import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';
import { colors, fontSize, spacing, radius } from '../constants/theme';

export default function VerifyScreen() {
  const router = useRouter();
  const { email, phone, method } = useLocalSearchParams();

  const [code, setCode] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(method ?? null);
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(!!method);

  async function sendEmailCode() {
    setLoading(true);
    const { error } = await supabase.auth.resend({ type: 'signup', email: email ?? '' });
    setLoading(false);
    if (error) { Alert.alert('Error', error.message); return; }
    setSelectedMethod('email');
    setCodeSent(true);
  }

  async function sendPhoneCode() {
    if (!phoneInput.trim()) { Alert.alert('Enter phone number', 'Please enter your phone number.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: phoneInput.trim() });
    setLoading(false);
    if (error) { Alert.alert('Error', error.message); return; }
    setSelectedMethod('phone');
    setCodeSent(true);
  }

  async function verifyCode() {
    if (code.trim().length < 6) { Alert.alert('Invalid code', 'Please enter the 6-digit code.'); return; }
    setLoading(true);
    let error;
    if (selectedMethod === 'email') {
      ({ error } = await supabase.auth.verifyOtp({ email: email ?? '', token: code.trim(), type: 'signup' }));
    } else {
      ({ error } = await supabase.auth.verifyOtp({ phone: phoneInput.trim(), token: code.trim(), type: 'sms' }));
    }
    setLoading(false);
    if (error) { Alert.alert('Invalid code', 'The code you entered is incorrect. Please try again.'); return; }
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={s.body}>
          <Text style={s.title}>Two-Factor{'\n'}Verification</Text>
          <Text style={s.subtitle}>
            Verify your identity to keep your account secure.
          </Text>

          {!codeSent ? (
            <>
              <Text style={s.label}>Choose a verification method:</Text>

              {/* Email option */}
              <Pressable style={s.methodCard} onPress={sendEmailCode} disabled={loading}>
                <View style={s.methodIcon}>
                  <Text style={{ fontSize: 24 }}>✉️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.methodTitle}>Email Verification</Text>
                  <Text style={s.methodSub}>Send a 6-digit code to {email ?? 'your email'}</Text>
                </View>
              </Pressable>

              {/* Phone option */}
              <View style={s.methodCard}>
                <View style={s.methodIcon}>
                  <Text style={{ fontSize: 24 }}>📱</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.methodTitle}>Phone Verification</Text>
                  <TextInput
                    style={s.phoneInput}
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor="#888"
                    value={phoneInput}
                    onChangeText={setPhoneInput}
                    keyboardType="phone-pad"
                  />
                  <Pressable style={s.sendCodeBtn} onPress={sendPhoneCode} disabled={loading}>
                    <Text style={s.sendCodeText}>Send code via SMS</Text>
                  </Pressable>
                </View>
              </View>

              {loading && <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.lg }} />}
            </>
          ) : (
            <>
              <Text style={s.label}>
                Enter the 6-digit code sent to your{' '}
                {selectedMethod === 'email' ? 'email' : 'phone'}.
              </Text>

              <TextInput
                style={s.codeInput}
                placeholder="000000"
                placeholderTextColor="#888"
                value={code}
                onChangeText={(t) => setCode(t.replace(/[^0-9]/g, '').slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />

              <Pressable
                style={[s.verifyBtn, loading && { opacity: 0.7 }]}
                onPress={verifyCode}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#1A1A1A" />
                  : <Text style={s.verifyBtnText}>Verify & Continue</Text>
                }
              </Pressable>

              <Pressable onPress={() => setCodeSent(false)} style={{ marginTop: spacing.lg, alignItems: 'center' }}>
                <Text style={{ color: colors.white, fontSize: fontSize.sm, textDecorationLine: 'underline' }}>
                  Use a different method
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.primary },
  body:        { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl },
  title:       { color: '#fff', fontSize: 34, fontWeight: '900', marginBottom: spacing.md, lineHeight: 40 },
  subtitle:    { color: 'rgba(255,255,255,0.7)', fontSize: fontSize.sm, marginBottom: spacing.xxl, lineHeight: 22 },
  label:       { color: '#fff', fontSize: fontSize.base, fontWeight: '700', marginBottom: spacing.lg },
  methodCard:  { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, flexDirection: 'row', alignItems: 'flex-start', padding: spacing.lg, marginBottom: spacing.md, gap: spacing.md },
  methodIcon:  { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  methodTitle: { color: '#fff', fontSize: fontSize.base, fontWeight: '700', marginBottom: 4 },
  methodSub:   { color: 'rgba(255,255,255,0.6)', fontSize: fontSize.xs },
  phoneInput:  { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: spacing.md, paddingVertical: 8, color: '#fff', fontSize: fontSize.sm, marginTop: 6, marginBottom: 8 },
  sendCodeBtn: { backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 8, paddingHorizontal: spacing.md, alignSelf: 'flex-start' },
  sendCodeText:{ color: '#1A1A1A', fontSize: fontSize.xs, fontWeight: '700' },
  codeInput:   { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: spacing.xl, fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 12, marginBottom: spacing.xxl },
  verifyBtn:   { backgroundColor: colors.accent, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center' },
  verifyBtnText:{ color: '#1A1A1A', fontSize: fontSize.base, fontWeight: '700' },
});
