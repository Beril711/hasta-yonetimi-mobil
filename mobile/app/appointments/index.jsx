import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../lib/api';
import { C, shadow } from '../../lib/theme';

const STATUS_LABELS = {
  active: 'Aktif',
  pending: 'Bekliyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
};

const STATUS_COLORS = {
  active: { bg: C.primaryLight, text: C.primary },
  pending: { bg: '#FFF7ED', text: '#C2700A' },
  completed: { bg: '#F0FDF4', text: '#166534' },
  cancelled: { bg: '#FEF2F2', text: '#B91C1C' },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>
        {STATUS_LABELS[status] || status}
      </Text>
    </View>
  );
}

export default function AppointmentsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(() => {
    setLoading(true);
    api.get('/appointments/')
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
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
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Henüz randevunuz yok</Text>
          <Text style={styles.emptyDesc}>Yeni bir randevu oluşturmak için aşağıdaki butona tıklayın.</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/appointments/new')}
          >
            <Text style={styles.emptyBtnText}>Randevu Al</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {appointments.map((appt) => (
            <View key={appt.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>📅</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deptText}>{appt.department}</Text>
                  <Text style={styles.hospitalText}>{appt.hospital_name}</Text>
                </View>
                <StatusBadge status={appt.status} />
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tarih</Text>
                <Text style={styles.infoValue}>{appt.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Saat</Text>
                <Text style={styles.infoValue}>{appt.time}</Text>
              </View>
              {appt.doctor_name && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Doktor</Text>
                  <Text style={styles.infoValue}>{appt.doctor_name}</Text>
                </View>
              )}

              {(appt.status === 'active' || appt.status === 'pending') && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => handleCancel(appt.id)}
                >
                  <Text style={styles.cancelBtnText}>Randevuyu İptal Et</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    backgroundColor: C.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { marginBottom: 10 },
  backText: { fontSize: 14, color: C.primary, fontWeight: '500' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '700', color: C.text },
  newBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  newBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  subtitle: { fontSize: 13, color: C.textMuted },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  card: {
    backgroundColor: C.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow(1),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: C.accentLight || '#FDF6E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20 },
  deptText: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2 },
  hospitalText: { fontSize: 12, color: C.textMuted },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  divider: { height: 1, backgroundColor: C.border, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  infoLabel: { fontSize: 13, color: C.textMuted },
  infoValue: { fontSize: 13, color: C.text, fontWeight: '500' },
  cancelBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: C.danger,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  cancelBtnText: { color: C.danger, fontSize: 13, fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.text, textAlign: 'center' },
  emptyDesc: { fontSize: 13, color: C.textMuted, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 8,
  },
  emptyBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
