import {
  View, Text, Image, StyleSheet, Modal, Pressable,
  TextInput, Switch, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';

const LOGO = require('../../assets/fblago-logo.png');
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CalendarList } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import { colors, fontSize, spacing, radius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { usePlannerViewModel } from '../../viewmodels/usePlannerViewModel';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function PlannerScreen() {
  const { colors: t, isDark } = useTheme();
  const dark = isDark;
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

  return (
    <SafeAreaView style={[s.safe, dark && { backgroundColor: t.bg }]} edges={['top']}>
      {/* Dark blue header */}
      <View style={s.header}>
        <View style={s.headerLogoClip}><Image source={LOGO} style={s.headerLogo} resizeMode="contain" /></View>
        <Text style={s.headerTitle}>Planner</Text>
      </View>

      {loading ? <LoadingSpinner /> : (
        <View style={{ flex: 1, backgroundColor: t.bg }}>
          <CalendarList
            key={dark ? 'dark' : 'light'}
            current={selected}
            onDayPress={(day) => setSelected(day.dateString)}
            markedDates={{
              ...markedDates,
              [selected]: { ...(markedDates[selected] ?? {}), selected: true, selectedColor: colors.primary },
            }}
            pastScrollRange={3}
            futureScrollRange={12}
            showScrollIndicator
            horizontal={false}
            theme={{
              backgroundColor: t.bg,
              calendarBackground: t.bg,
              textSectionTitleColor: t.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#fff',
              todayTextColor: colors.primary,
              dayTextColor: t.text,
              dotColor: colors.accent,
              monthTextColor: t.text,
              arrowColor: colors.primary,
              textDisabledColor: dark ? t.hairline : '#ccc',
              textDayFontWeight: '500',
              textMonthFontWeight: '700',
              textMonthFontSize: fontSize.lg,
            }}
          />

          {/* Add Entry button */}
          <Pressable style={s.addEntryBtn} onPress={() => setModalVisible(true)}>
            <Text style={s.addEntryText}>Add Entry</Text>
          </Pressable>
        </View>
      )}

      {/* Day events panel */}
      {dayEvents.length > 0 && !modalVisible && (
        <View style={[s.dayPanel, dark && { backgroundColor: t.card }]}>
          <Text style={[s.dayPanelTitle, dark && { color: t.text }]}>
            {format(new Date(selected + 'T12:00:00'), 'MMMM d')}
          </Text>
          {dayEvents.map((ev) => (
            <View key={ev.id} style={s.eventRow}>
              <View style={[s.eventDot, ev.is_shared && { backgroundColor: colors.success }]} />
              <Text style={[s.eventTitle, dark && { color: t.text }]} numberOfLines={1}>{ev.title}</Text>
              <Text style={s.eventTime}>
                {ev.start_time ? format(parseISO(ev.start_time), 'h:mm a') : ''}
              </Text>
              <Pressable onPress={() => removeEvent(ev.id)} style={{ padding: 4 }}>
                <Ionicons name="close" size={16} color="#999" />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Add Entry Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={s.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView style={[s.modalCard, dark && { backgroundColor: t.card }]} contentContainerStyle={{ gap: spacing.md }}>
            <Text style={[s.modalTitle, dark && { color: t.text }]}>Planner</Text>

            {/* Activity Date */}
            <Text style={[s.fieldLabel, dark && { color: t.text }]}>Activity Date</Text>
            <View style={[s.fieldRow, dark && { backgroundColor: t.inputBg }]}>
              <Ionicons name="calendar-outline" size={20} color={dark ? t.textSecondary : '#555'} />
              <TextInput
                style={[s.fieldInput, dark && { color: t.text }]}
                placeholder="(month, day, year)"
                placeholderTextColor="#888"
                value={newTime}
                onChangeText={setNewTime}
              />
            </View>

            {/* Activity Description */}
            <Text style={[s.fieldLabel, dark && { color: t.text }]}>Activity Description</Text>
            <TextInput
              style={[s.fieldBox, { height: 100, textAlignVertical: 'top' }, dark && { backgroundColor: t.inputBg, color: t.text }]}
              placeholder="type here..."
              placeholderTextColor="#888"
              value={newTitle}
              onChangeText={setNewTitle}
              multiline
            />

            {/* Share */}
            <Text style={[s.fieldLabel, dark && { color: t.text }]}>Share to Members/Groups</Text>
            <Text style={s.fieldSub}>Share this entry to multiple people!</Text>
            <View style={[s.fieldRow, dark && { backgroundColor: t.inputBg }]}>
              <Ionicons name="people-outline" size={20} color={dark ? t.textSecondary : '#555'} />
              <TextInput
                style={[s.fieldInput, dark && { color: t.text }]}
                placeholder="search people"
                placeholderTextColor="#888"
                editable={false}
              />
            </View>

            {/* Show in To-Do */}
            <View style={s.switchRow}>
              <Text style={[s.switchLabel, dark && { color: t.text }]}>Show in To-Do on Dashboard</Text>
              <Switch
                value={isShared}
                onValueChange={setIsShared}
                trackColor={{ false: '#ccc', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>

            {/* Buttons */}
            <View style={s.modalBtns}>
              <Pressable style={s.saveBtn} onPress={addEvent} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={s.saveBtnText}>Save & Close</Text>}
              </Pressable>
              <Pressable
                style={[s.cancelBtn, dark && { backgroundColor: t.inputBg }]}
                onPress={() => { setModalVisible(false); setNewTitle(''); setNewTime(''); }}
              >
                <Text style={[s.cancelBtnText, dark && { color: t.text }]}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.primary },
  header:       { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerLogoClip: { width: 32, height: 32 },
  headerLogo:     { width: 32, height: 32 },
  headerTitle:  { color: colors.white, fontSize: fontSize.xxl, fontWeight: '800' },
  addEntryBtn:  { position: 'absolute', bottom: spacing.xl, right: spacing.xl, backgroundColor: colors.primary, borderRadius: 24, paddingVertical: 12, paddingHorizontal: spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  addEntryText: { color: colors.white, fontSize: fontSize.base, fontWeight: '600' },
  dayPanel:     { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 6 },
  dayPanelTitle:{ fontSize: fontSize.lg, fontWeight: '700', color: '#1A1A1A', marginBottom: spacing.md },
  eventRow:     { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 4 },
  eventDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  eventTitle:   { flex: 1, fontSize: fontSize.sm, color: '#1A1A1A' },
  eventTime:    { fontSize: fontSize.xs, color: '#888' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalCard:    { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.xl, maxHeight: '90%' },
  modalTitle:   { fontSize: fontSize.xl, fontWeight: '800', color: '#1A1A1A', marginBottom: spacing.xs },
  fieldLabel:   { fontSize: fontSize.sm, fontWeight: '700', color: '#1A1A1A' },
  fieldSub:     { fontSize: fontSize.xs, color: '#888', marginTop: -spacing.xs },
  fieldRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EBEBEB', borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.sm },
  fieldInput:   { flex: 1, fontSize: fontSize.sm, color: '#1A1A1A' },
  fieldBox:     { backgroundColor: '#EBEBEB', borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSize.sm, color: '#1A1A1A' },
  switchRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel:  { fontSize: fontSize.base, color: '#1A1A1A' },
  modalBtns:    { flexDirection: 'row', gap: spacing.md },
  saveBtn:      { flex: 1, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: spacing.md, alignItems: 'center' },
  saveBtnText:  { color: '#fff', fontSize: fontSize.base, fontWeight: '700' },
  cancelBtn:    { flex: 1, backgroundColor: '#D0D0D0', borderRadius: 10, paddingVertical: spacing.md, alignItems: 'center' },
  cancelBtnText:{ color: '#1A1A1A', fontSize: fontSize.base, fontWeight: '600' },
});
