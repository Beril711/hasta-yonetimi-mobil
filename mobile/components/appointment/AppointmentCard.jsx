import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C, shadow } from '../../lib/theme';

const STATUS_MAP = {
  active:    { label: 'Aktif',         bg: C.primaryLight, color: C.primary },
  pending:   { label: 'Bekliyor',      bg: '#FFF7ED',      color: '#C2700A' },
  completed: { label: 'Tamamlandı',    bg: '#F0FDF4',      color: '#166534' },
  cancelled: { label: 'İptal Edildi',  bg: '#FEF2F2',      color: '#B91C1C' },
};

export default function AppointmentCard({ appointment, onCancel }) {
  const st = STATUS_MAP[appointment.status] || STATUS_MAP.pending;
  const canCancel = appointment.status === 'active' || appointment.status === 'pending';

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>📅</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.dept}>{appointment.department}</Text>
          <Text style={styles.hospital}>{appointment.hospital_name}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: st.bg }]}>
          <Text style={[styles.badgeText, { color: st.color }]}>{st.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Tarih</Text>
        <Text style={styles.rowValue}>{appointment.date}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Saat</Text>
        <Text style={styles.rowValue}>{appointment.time}</Text>
      </View>
      {appointment.doctor_name && (
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Doktor</Text>
          <Text style={styles.rowValue}>{appointment.doctor_name}</Text>
        </View>
      )}

      {canCancel && onCancel && (
        <TouchableOpacity style={styles.cancelBtn} onPress={() => onCancel(appointment.id)}>
          <Text style={styles.cancelText}>Randevuyu İptal Et</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow(1),
  },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FDF6E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20 },
  dept: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2 },
  hospital: { fontSize: 12, color: C.textMuted },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  divider: { height: 1, backgroundColor: C.border, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rowLabel: { fontSize: 13, color: C.textMuted },
  rowValue: { fontSize: 13, color: C.text, fontWeight: '500' },
  cancelBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: C.danger,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  cancelText: { color: C.danger, fontSize: 13, fontWeight: '600' },
});
