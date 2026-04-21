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
import { usePlannerViewModel } from '../../viewmodels/usePlannerViewModel';
import { useUIStore } from '../../store/uiStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function PlannerScreen() {
  const { isDarkMode } = useUIStore();
  const dark = isDarkMode;
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
    <SafeAreaView style={[s.safe, dark && { backgroundColor: '#0A1A3A' }]} edges={['top']}>
      {/* Dark blue header */}
      <View style={s.header}>
        <View style={s.headerLogoClip}><Image source={LOGO} style={s.headerLogo} resizeMode="contain" /></View>
        <Text style={s.headerTitle}>Planner</Text>
      </View>

      {loading ? <LoadingSpinner /> : (
        <View style={{ flex: 1, backgroundColor: dark ? '#121212' : '#fff' }}>
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
              backgroundColor: dark ? '#121212' : '#fff',
              calendarBackground: dark ? '#121212' : '#fff',
              textSectionTitleColor: dark ? '#aaa' : '#555',
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#fff',
              todayTextColor: colors.primary,
              dayTextColor: dark ? '#eee' : '#1A1A1A',
              dotColor: colors.accent,
              monthTextColor: dark ? '#eee' : '#1A1A1A',
              arrowColor: colors.primary,
              textDisabledColor: dark ? '#444' : '#ccc',
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
        <View style={[s.dayPanel, dark && { backgroundColor: '#1E1E1E' }]}>
          <Text style={[s.dayPanelTitle, dark && { color: '#eee' }]}>
            {format(new Date(selected + 'T12:00:00'), 'MMMM d')}
          </Text>
          {dayEvents.map((ev) => (
            <View key={ev.id} style={s.eventRow}>
              <View style={[s.eventDot, ev.is_shared && { backgroundColor: colors.success }]} />
              <Text style={[s.eventTitle, dark && { color: '#eee' }]} numberOfLines={1}>{ev.title}</Text>
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
          <ScrollView style={[s.modalCard, dark && { backgroundColor: '#1E1E1E' }]} contentContainerStyle={{ gap: spacing.md }}>
            <Text style={[s.modalTitle, dark && { color: '#eee' }]}>Planner</Text>

            {/* Activity Date */}
            <Text style={[s.fieldLabel, dark && { color: '#eee' }]}>Activity Date</Text>
            <View style={[s.fieldRow, dark && { backgroundColor: '#2A2A2A' }]}>
              <Ionicons name="calendar-outline" size={20} color={dark ? '#aaa' : '#555'} />
              <TextInput
                style={[s.fieldInput, dark && { color: '#eee' }]}
                placeholder="(month, day, year)"
                placeholderTextColor="#888"
                value={newTime}
                onChangeText={setNewTime}
              />
            </View>

            {/* Activity Description */}
            <Text style={[s.fieldLabel, dark && { color: '#eee' }]}>Activity Description</Text>
            <TextInput
              style={[s.fieldBox, { height: 100, textAlignVertical: 'top' }, dark && { backgroundColor: '#2A2A2A', color: '#eee' }]}
              placeholder="type here..."
              placeholderTextColor="#888"
              value={newTitle}
              onChangeText={setNewTitle}
              multiline
            />

            {/* Share */}
            <Text style={[s.fieldLabel, dark && { color: '#eee' }]}>Share to Members/Groups</Text>
            <Text style={s.fieldSub}>Share this entry to multiple people!</Text>
            <View style={[s.fieldRow, dark && { backgroundColor: '#2A2A2A' }]}>
              <Ionicons name="people-outline" size={20} color={dark ? '#aaa' : '#555'} />
              <TextInput
                style={[s.fieldInput, dark && { color: '#eee' }]}
                placeholder="search people"
                placeholderTextColor="#888"
                editable={false}
              />
            </View>

            {/* Show in To-Do */}
            <View style={s.switchRow}>
              <Text style={[s.switchLabel, dark && { color: '#eee' }]}>Show in To-Do on Dashboard</Text>
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
                style={[s.cancelBtn, dark && { backgroundColor: '#333' }]}
                onPress={() => { setModalVisible(false); setNewTitle(''); setNewTime(''); }}
              >
                <Text style={[s.cancelBtnText, dark && { color: '#eee' }]}>Cancel</Text>
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
