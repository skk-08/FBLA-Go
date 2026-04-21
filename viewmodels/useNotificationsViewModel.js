import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { fetchNotifications, markAllNotificationsRead } from '../models/notificationModel';

export function useNotificationsViewModel() {
  const { user } = useAuthStore();
  const { clearNotifications } = useUIStore();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    fetchNotifications(user.id)
      .then((data) => {
        setNotifications(data ?? []);
        markAllNotificationsRead(user.id).catch(() => {});
        clearNotifications();
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  function markAllRead() {
    if (!user?.id) return;
    markAllNotificationsRead(user.id).catch(() => {});
    clearNotifications();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  return { notifications, loading, markAllRead };
}
