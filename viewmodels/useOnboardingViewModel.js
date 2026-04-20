import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { updateProfile } from '../models/userModel';

const TOTAL_STEPS = 3;

export function useOnboardingViewModel(onComplete) {
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setProfile, profile } = useAuthStore();

  const canAdvance = step !== 0 || agreed;

  async function next() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    try {
      const updated = await updateProfile(user.id, { onboarding_complete: true });
      setProfile({ ...profile, ...updated });
      onComplete?.();
    } catch (_) {
      onComplete?.();
    } finally {
      setLoading(false);
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  return { step, agreed, setAgreed, canAdvance, next, back, loading, totalSteps: TOTAL_STEPS };
}
