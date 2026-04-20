import {
  View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity,
  TextInput, Switch, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { colors, fontSize, spacing, radius } from '../../constants/theme';
import { usePlannerViewModel } from '../../viewmodels/usePlannerViewModel';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function PlannerScreen() {
  const {
    selected, setSelected,
    markedDates, dayEvents,
    modalVisible, setModalVisible,
    newTitle, setNewTitle,
    newTime, setNewTime,
    isShared, setIsShared,
    addEvent, removeEvent,
    loading, saving,
  } = usePlannerViewModel();

  const calendarTheme = {
    backgroundColor: colors.primary,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.muted,
    selectedDayBackgroundColor: colors.accent,
    selectedDayTextColor: colors.primary,
    todayTextColor: colors.accent,
    dayTextColor: colors.white,
    dotColor: colors.accent,
    monthTextColor: colors.white,
    arrowColor: colors.accent,
    textDisabledColor: colors.border,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Planner</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? <LoadingSpinner /> : (
        <ScrollView>
          <Calendar
            current={selected}
            onDayPress={(day) => setSelected(day.dateString)}
            markedDates={{
              ...markedDates,
              [selected]: { ...(markedDates[selected] ?? {}), selected: true },
            }}
            theme={calendarTheme}
          />

          <View style={styles.eventsSection}>
            <Text style={styles.sectionTitle}>
              {format(new Date(selected + 'T12:00:00'), 'MMMM d, yyyy')}
            </Text>
            {dayEvents.length === 0 ? (
              <Text style={styles.empty}>No events on this day</Text>
            ) : (
              dayEvents.map((ev) => (
                <View key={ev.id} style={styles.eventRow}>
                  <View style={[styles.dot, ev.is_shared && styles.sharedDot]} />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{ev.title}</Text>
                    <Text style={styles.eventTime}>
                      {ev.start_time ? format(parseISO(ev.start_time), 'h:mm a') : ''}
                      {ev.is_shared ? ' · Shared' : ''}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeEvent(ev.id)}>
                    <Ionicons name="trash-outline" size={18} color={colors.muted} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Event title"
              placeholderTextColor={colors.muted}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (e.g. 14:30)"
              placeholderTextColor={colors.muted}
              value={newTime}
              onChangeText={setNewTime}
              keyboardType="numbers-and-punctuation"
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Share with chapter</Text>
              <Switch
                value={isShared}
                onValueChange={setIsShared}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setModalVisible(false); setNewTitle(''); setNewTime(''); }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addEvent} disabled={saving}>
                {saving ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <Text style={styles.saveText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.primary },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle:   { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  addBtn:        { backgroundColor: colors.accent, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  eventsSection: { padding: spacing.xl },
  sectionTitle:  { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: 1 },
  empty:         { color: colors.muted, fontSize: fontSize.sm },
  eventRow:      { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  dot:           { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  sharedDot:     { backgroundColor: colors.success },
  eventInfo:     { flex: 1 },
  eventTitle:    { color: colors.white, fontSize: fontSize.sm, fontWeight: '600' },
  eventTime:     { color: colors.muted, fontSize: fontSize.xs, marginTop: 2 },
  modalOverlay:  { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalCard:     { backgroundColor: colors.surface, borderTopLeftRadius: radius.modal, borderTopRightRadius: radius.modal, padding: spacing.xl, gap: spacing.md },
  modalTitle:    { color: colors.white, fontSize: fontSize.xl, fontWeight: '800', marginBottom: spacing.sm },
  input:         { backgroundColor: colors.primary, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, color: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSize.base },
  switchRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel:   { color: colors.white, fontSize: fontSize.base },
  modalButtons:  { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  cancelBtn:     { flex: 1, paddingVertical: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  cancelText:    { color: colors.muted, fontSize: fontSize.base },
  saveBtn:       { flex: 1, paddingVertical: spacing.md, borderRadius: radius.pill, backgroundColor: colors.accent, alignItems: 'center' },
  saveText:      { color: colors.primary, fontSize: fontSize.base, fontWeight: '700' },
});
