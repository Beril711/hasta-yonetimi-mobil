import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../lib/api';
import { C, shadow } from '../../lib/theme';

const DEPARTMENTS = [
  'Kardiyoloji', 'Nöroloji', 'Dahiliye', 'Ortopedi',
  'Göz Hastalıkları', 'Kulak Burun Boğaz', 'Dermatoloji',
  'Üroloji', 'Kadın Hastalıkları', 'Psikiyatri',
  'Göğüs Hastalıkları', 'Endokrinoloji', 'Aile Hekimliği',
];

const STEPS = ['Bilgiler', 'Tarih & Saat', 'Onay'];

function StepBar({ step }) {
  return (
    <View style={styles.stepBar}>
      {STEPS.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <View key={label} style={styles.stepItem}>
            <View style={[styles.stepCircle, done && styles.stepDone, active && styles.stepActive]}>
              <Text style={[styles.stepNum, (done || active) && { color: '#fff' }]}>
                {done ? '✓' : num}
              </Text>
            </View>
            <Text style={[styles.stepLabel, active && { color: C.primary }]}>{label}</Text>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, done && styles.stepLineDone]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

export default function NewAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [step, setStep] = useState(1);
  const [hospitalName, setHospitalName] = useState(params.hospital_name || '');
  const [department, setDepartment] = useState(params.department || '');
  const [doctorName, setDoctorName] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (step === 2 && department) {
      setLoadingSlots(true);
      api.get('/appointments/available-slots', { params: { department } })
        .then((r) => setSlots(r.data || []))
        .catch(() => setSlots(generateFallbackSlots()))
        .finally(() => setLoadingSlots(false));
    }
  }, [step, department]);

  const generateFallbackSlots = () => {
    const result = [];
    const today = new Date();
    for (let d = 1; d <= 5; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dayStr = date.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });
      const dateStr = date.toISOString().split('T')[0];
      ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].forEach((t) => {
        result.push({ date: dateStr, time: t, label: `${dayStr} – ${t}`, doctor: 'Dr. Genel Pratisyen' });
      });
    }
    return result;
  };

  const canGoNext = () => {
    if (step === 1) return hospitalName.trim().length > 0 && department.length > 0;
    if (step === 2) return selectedSlot !== null;
    return true;
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    try {
      await api.post('/appointments/', {
        hospital_name: hospitalName,
        department,
        doctor_name: selectedSlot.doctor || doctorName,
        date: selectedSlot.date,
        time: selectedSlot.time,
        notes,
      });
      Alert.alert('Randevu Alındı!', 'Randevunuz başarıyla oluşturuldu.', [
        { text: 'Tamam', onPress: () => router.replace('/appointments') },
      ]);
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.detail || 'Randevu oluşturulamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← {step > 1 ? 'Geri' : 'Vazgeç'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Randevu Al</Text>
      </View>

      <StepBar step={step} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Step 1: Bilgiler */}
        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hastane & Bölüm</Text>

            <Text style={styles.label}>HASTANE ADI</Text>
            <TextInput
              style={styles.input}
              value={hospitalName}
              onChangeText={setHospitalName}
              placeholder="Hastane adı"
              placeholderTextColor={C.textMuted}
            />

            <Text style={styles.label}>BÖLÜM</Text>
            <View style={styles.deptGrid}>
              {DEPARTMENTS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.deptChip, department === d && styles.deptChipActive]}
                  onPress={() => setDepartment(d)}
                >
                  <Text style={[styles.deptChipText, department === d && styles.deptChipTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Tarih & Saat */}
        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uygun Slot Seçin</Text>
            {loadingSlots ? (
              <View style={styles.center}>
                <ActivityIndicator color={C.primary} />
                <Text style={styles.loadingText}>Slotlar yükleniyor...</Text>
              </View>
            ) : (
              <View style={styles.slotGrid}>
                {slots.map((slot, i) => {
                  const key = `${slot.date}-${slot.time}`;
                  const active = selectedSlot && selectedSlot.date === slot.date && selectedSlot.time === slot.time;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.slotChip, active && styles.slotChipActive]}
                      onPress={() => setSelectedSlot(slot)}
                    >
                      <Text style={[styles.slotDate, active && { color: '#fff' }]}>
                        {new Date(slot.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </Text>
                      <Text style={[styles.slotTime, active && { color: 'rgba(255,255,255,0.9)' }]}>
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Step 3: Onay */}
        {step === 3 && selectedSlot && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Randevu Özeti</Text>
            <View style={styles.summaryCard}>
              <SummaryRow label="Hastane" value={hospitalName} />
              <SummaryRow label="Bölüm" value={department} />
              <SummaryRow
                label="Tarih"
                value={new Date(selectedSlot.date).toLocaleDateString('tr-TR', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              />
              <SummaryRow label="Saat" value={selectedSlot.time} />
              {selectedSlot.doctor && <SummaryRow label="Doktor" value={selectedSlot.doctor} />}
            </View>

            <Text style={styles.label}>NOTLAR (opsiyonel)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Ek bilgi veya notlarınız..."
              placeholderTextColor={C.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.footer}>
        {step < 3 ? (
          <TouchableOpacity
            style={[styles.nextBtn, !canGoNext() && styles.btnDisabled]}
            onPress={handleNext}
            disabled={!canGoNext()}
          >
            <Text style={styles.nextBtnText}>Devam Et →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, submitting && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.nextBtnText}>Randevuyu Onayla ✓</Text>}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    backgroundColor: C.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 14, color: C.primary, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', color: C.text },
  stepBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: C.surface,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 0,
  },
  stepItem: { alignItems: 'center', flex: 1, position: 'relative' },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: C.border,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepActive: { borderColor: C.primary, backgroundColor: C.primary },
  stepDone: { borderColor: C.primary, backgroundColor: C.primary },
  stepNum: { fontSize: 12, fontWeight: '700', color: C.textMuted },
  stepLabel: { fontSize: 10, color: C.textMuted, fontWeight: '600', textAlign: 'center' },
  stepLine: {
    position: 'absolute',
    top: 15,
    left: '60%',
    right: '-60%',
    height: 2,
    backgroundColor: C.border,
    zIndex: -1,
  },
  stepLineDone: { backgroundColor: C.primary },
  scroll: { flex: 1 },
  section: {
    backgroundColor: C.surface,
    margin: 16,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow(1),
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 18 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 10,
    padding: 13,
    marginBottom: 16,
    fontSize: 14,
    color: C.text,
    backgroundColor: C.bg,
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  deptGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  deptChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.bg,
  },
  deptChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  deptChipText: { fontSize: 12, color: C.textSec, fontWeight: '500' },
  deptChipTextActive: { color: '#fff' },
  center: { alignItems: 'center', paddingVertical: 32, gap: 10 },
  loadingText: { fontSize: 13, color: C.textMuted },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: {
    width: '30%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.bg,
    alignItems: 'center',
  },
  slotChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  slotDate: { fontSize: 11, color: C.text, fontWeight: '600', marginBottom: 2 },
  slotTime: { fontSize: 13, color: C.primary, fontWeight: '700' },
  summaryCard: {
    backgroundColor: C.bg,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
    gap: 10,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13, color: C.textMuted },
  summaryValue: { fontSize: 13, color: C.text, fontWeight: '500', flexShrink: 1, textAlign: 'right', maxWidth: '65%' },
  footer: {
    backgroundColor: C.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  nextBtn: {
    backgroundColor: C.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.45 },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
