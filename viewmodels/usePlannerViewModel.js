import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { fetchCalendarEvents, createCalendarEvent, deleteCalendarEvent } from '../models/calendarModel';
import { createTodo } from '../models/todoModel';

export function usePlannerViewModel() {
  const { user, profile } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await fetchCalendarEvents(user.id, profile?.chapter_id || null);
      setEvents(data ?? []);
    } catch (_) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, profile?.chapter_id]);

  useEffect(() => { load(); }, [load]);

  const markedDates = events.reduce((acc, e) => {
    const day = e.start_time?.split('T')[0];
    if (day) acc[day] = { marked: true, dotColor: '#FFD100' };
    return acc;
  }, {});

  const dayEvents = events.filter((e) => e.start_time?.startsWith(selected));

  async function addEvent() {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const startTime = `${selected}T${newTime || '09:00'}:00`;
      const ev = await createCalendarEvent(user.id, {
        title: newTitle.trim(),
        start_time: startTime,
        is_shared: isShared,
        chapter_id: profile?.chapter_id,
      });
      setEvents((prev) => [...prev, ev]);
      if (isShared) await createTodo(user.id, newTitle.trim(), selected);
      setModalVisible(false);
      setNewTitle('');
      setNewTime('');
      setIsShared(false);
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(id) {
    await deleteCalendarEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return {
    selected, setSelected,
    markedDates, dayEvents,
    modalVisible, setModalVisible,
    newTitle, setNewTitle,
    newTime, setNewTime,
    isShared, setIsShared,
    addEvent, removeEvent,
    loading, saving,
  };
}
