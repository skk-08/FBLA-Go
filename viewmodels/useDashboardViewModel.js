import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { fetchTodos } from '../models/todoModel';
import { fetchAnnouncements } from '../models/announcementModel';
import { fetchUserEvents, fetchNextCompetitionDate } from '../models/eventModel';
import { countUnread } from '../models/notificationModel';

export function useDashboardViewModel() {
  const { user, profile } = useAuthStore();
  const { setNotificationCount } = useUIStore();

  const [todos, setTodos] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [nextCompetition, setNextCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [t, u, nc, unread] = await Promise.all([
        fetchTodos(user.id),
        fetchUserEvents(user.id),
        fetchNextCompetitionDate(user.id),
        countUnread(user.id),
      ]);
      setTodos(t ?? []);
      setUserEvents(u ?? []);
      setNextCompetition(nc);
      setNotificationCount(unread);

      if (profile?.chapter_id) {
        const ann = await fetchAnnouncements(profile.chapter_id, 3);
        setAnnouncements(ann ?? []);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id, profile?.chapter_id]);

  useEffect(() => { load(); }, [load]);

  return { todos, setTodos, announcements, userEvents, nextCompetition, loading, error, refresh: load };
}
