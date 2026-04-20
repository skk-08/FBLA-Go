import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  session:        null,
  user:           null,
  profile:        null,
  sessionLoading: true,

  setSession: (session) => set({
    session,
    user:    session?.user ?? null,
  }),
  setProfile:  (profile)  => set({ profile }),
  setLoading:  (sessionLoading) => set({ sessionLoading }),
  signOut:     () => set({ session: null, user: null, profile: null }),
}));
