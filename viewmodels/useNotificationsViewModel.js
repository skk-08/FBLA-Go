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
    if (!user?.id) return;
    setLoading(true);
    fetchNotifications(user.id)
      .then((data) => {
        setNotifications(data ?? []);
        markAllNotificationsRead(user.id).catch(() => {});
        clearNotifications();
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  return { notifications, loading };
}
