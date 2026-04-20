import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { fetchUserEvents, fetchEvents } from '../models/eventModel';

export function useMyEventViewModel() {
  const { user } = useAuthStore();
  const [userEvents, setUserEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    Promise.all([fetchUserEvents(user.id), fetchEvents()])
      .then(([ue, ae]) => {
        setUserEvents(ue ?? []);
        setAllEvents(ae ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filteredEvents = allEvents.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return { userEvents, filteredEvents, search, setSearch, loading, error };
}
