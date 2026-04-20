import { create } from 'zustand';

export const useUIStore = create((set) => ({
  notificationCount: 0,
  globalToast:       null,

  setNotificationCount: (n)     => set({ notificationCount: n }),
  incrementNotifications: ()    => set((s) => ({ notificationCount: s.notificationCount + 1 })),
  clearNotifications: ()        => set({ notificationCount: 0 }),
  showToast: (msg)              => set({ globalToast: msg }),
  clearToast: ()                => set({ globalToast: null }),
}));
