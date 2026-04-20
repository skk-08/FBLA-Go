import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { fetchMessages, sendMessage, softDeleteMessage, subscribeToMessages } from '../models/messageModel';
import { supabase } from '../lib/supabase';

export function useMessagingViewModel() {
  const { user, profile } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [role, setRole] = useState('member');
  const channelRef = useRef(null);
  const chapterId = profile?.chapter_id ?? '';

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('users').select('role').eq('id', user.id).single()
      .then(({ data }) => { if (data?.role) setRole(data.role); });
  }, [user?.id]);

  const load = useCallback(async () => {
    if (!chapterId) return;
    setLoading(true);
    try {
      const data = await fetchMessages(chapterId);
      setMessages(data ?? []);
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    if (!chapterId) { setLoading(false); return; }
    load();
    channelRef.current = subscribeToMessages(chapterId, (payload) => {
      setMessages((prev) => [...prev, payload.new]);
    });
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [chapterId, load]);

  async function send() {
    if (!draft.trim() || !chapterId) return;
    setSending(true);
    try {
      await sendMessage(chapterId, user.id, draft.trim());
      setDraft('');
    } finally {
      setSending(false);
    }
  }

  async function deleteMessage(id) {
    await softDeleteMessage(id, user.id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await supabase.from('admin_actions').insert({
      admin_id: user.id,
      action_type: 'delete_message',
      target_id: id,
    });
  }

  const isAdmin = role === 'adviser' || role === 'admin';

  return { messages, draft, setDraft, send, deleteMessage, loading, sending, isAdmin, userId: user?.id };
}
