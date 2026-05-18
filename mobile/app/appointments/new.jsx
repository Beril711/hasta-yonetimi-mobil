import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../lib/api';
import TimeSlotPicker from '../../components/appointment/TimeSlotPicker';
import AppointmentSummary from '../../components/appointment/AppointmentSummary';

const STEPS = ['Bilgiler', 'Tarih & Saat', 'Onay'];

export default function NewAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [data, setData] = useState({
    hospital_name: params.hospital_name || '',
    department: params.department || '',
    doctor_name: '',
    appointment_date: '',
  });

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      api.get(`/appointments/available-slots?date=${selectedDate}`)
        .then((r) => setSlots(r.data || []))
        .catch(() => setSlots([]))
        .finally(() => setLoading(false));
    }
  }, [selectedDate]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/appointments', data);
      Alert.alert('Başarılı!', 'Randevunuz oluşturuldu.', [
        { text: 'Tamam', onPress: () => router.replace('/appointments') },
      ]);
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.detail || 'Randevu oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        value: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' }),
      });
    }
    return dates;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (step > 1 ? setStep(step - 1) : router.back())}>
          <Text style={styles.backButton}>← {step > 1 ? 'Önceki Adım' : 'Geri'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Randevu Al</Text>
      </View>

      <View style={styles.stepBar}>
        {STEPS.map((s, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.stepCircle, active && styles.stepActive, done && styles.stepDone]}>
                <Text style={[styles.stepNum, (active || done) && { color: '#FFF' }]}>
                  {done ? '✓' : num}
                </Text>
              </View>
              <Text style={[styles.stepLabel, active && { color: '#1F3555' }]}>{s}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.content}>
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.label}>HASTANE ADI</Text>
            <TextInput
              style={styles.input}
              value={data.hospital_name}
              onChangeText={(v) => updateField('hospital_name', v)}
              placeholder="Örn: Acıbadem Taksim"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.label}>BÖLÜM</Text>
            <TextInput
              style={styles.input}
              value={data.department}
              onChangeText={(v) => updateField('department', v)}
              placeholder="Örn: Dahiliye"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.label}>DOKTOR ADI</Text>
            <TextInput
              style={styles.input}
              value={data.doctor_name}
              onChangeText={(v) => updateField('doctor_name', v)}
              placeholder="Örn: Dr. Ahmet Yılmaz"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={[styles.button, (!data.hospital_name || !data.department || !data.doctor_name) && styles.buttonDisabled]}
              onPress={() => setStep(2)}
              disabled={!data.hospital_name || !data.department || !data.doctor_name}
            >
              <Text style={styles.buttonText}>Devam Et →</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.label}>TARİH SEÇİN</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {getDateOptions().map((d) => (
                <TouchableOpacity
                  key={d.value}
                  style={[styles.dateChip, selectedDate === d.value && styles.dateChipSelected]}
                  onPress={() => setSelectedDate(d.value)}
                >
                  <Text style={[styles.dateChipText, selectedDate === d.value && { color: '#FFF' }]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>MÜSAİT SAATLER</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#1F3555" />
            ) : (
              <TimeSlotPicker
                slots={slots}
                selectedSlot={data.appointment_date}
                onSelect={(slot) => updateField('appointment_date', slot)}
              />
            )}

            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }, !data.appointment_date && styles.buttonDisabled]}
              onPress={() => setStep(3)}
              disabled={!data.appointment_date}
            >
              <Text style={styles.buttonText}>Devam Et →</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View>
            <AppointmentSummary data={data} />
            <TouchableOpacity
              style={[styles.button, { marginTop: 16 }, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Oluşturuluyor...' : 'Randevuyu Onayla'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F3F4' },
  header: {
    backgroundColor: '#FFF', padding: 16, paddingTop: 50,
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backButton: { fontSize: 14, color: '#1F3555', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#1F3555' },
  stepBar: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 16, paddingVertical: 20, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
  },
  stepActive: { backgroundColor: '#1F3555' },
  stepDone: { backgroundColor: '#0D9488' },
  stepNum: { fontSize: 14, fontWeight: '600', color: '#515561' },
  stepLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  content: { padding: 16 },
  card: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 20,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 11, fontWeight: '600', color: '#515561',
    letterSpacing: 0.5, marginBottom: 8, marginTop: 4,
  },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8,
    padding: 12, fontSize: 14, color: '#242740', backgroundColor: '#FFF',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1F3555', padding: 14, borderRadius: 8, alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  dateChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', marginRight: 8,
  },
  dateChipSelected: { backgroundColor: '#1F3555', borderColor: '#1F3555' },
  dateChipText: { fontSize: 13, color: '#242740', fontWeight: '500' },
});