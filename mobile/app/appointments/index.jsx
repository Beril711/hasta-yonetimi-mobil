import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '../../lib/api';
import AppointmentCard from '../../components/appointment/AppointmentCard';

export default function AppointmentsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(() => {
    setLoading(true);
    api.get('/appointments')
      .then((r) => setAppointments(r.data || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(fetchAppointments);

  const handleCancel = (id) => {
    Alert.alert(
      'Randevuyu İptal Et',
      'Bu randevuyu iptal etmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.patch(`/appointments/${id}/cancel`);
              fetchAppointments();
            } catch {
              Alert.alert('Hata', 'Randevu iptal edilemedi.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Geri</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Randevularım</Text>
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => router.push('/appointments/new')}
          >
            <Text style={styles.newBtnText}>+ Yeni</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Aktif ve geçmiş randevularınız</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1F3555" />
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Henüz randevunuz yok</Text>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/appointments/new')}
          >
            <Text style={styles.createBtnText}>İlk Randevunuzu Oluşturun</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onCancel={handleCancel}
            />
          ))}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F3F4' },
  header: {
    backgroundColor: '#FFF', padding: 16, paddingTop: 50,
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backButton: { fontSize: 14, color: '#1F3555', marginBottom: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#1F3555' },
  newBtn: {
    backgroundColor: '#1F3555', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
  },
  newBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  subtitle: { fontSize: 13, color: '#515561', marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#515561' },
  createBtn: {
    backgroundColor: '#1F3555', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8,
  },
  createBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
});