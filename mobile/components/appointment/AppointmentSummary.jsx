import { View, Text, StyleSheet } from 'react-native';

export default function AppointmentSummary({ data }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>RANDEVU ÖZETİ</Text>
      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Hastane</Text>
        <Text style={styles.fieldValue}>{data.hospital_name || '—'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Bölüm</Text>
        <Text style={styles.fieldValue}>{data.department || '—'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Doktor</Text>
        <Text style={styles.fieldValue}>{data.doctor_name || '—'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Tarih ve Saat</Text>
        <Text style={styles.fieldValue}>{formatDate(data.appointment_date)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#515561',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  row: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: '#515561', marginBottom: 2 },
  fieldValue: { fontSize: 15, fontWeight: '600', color: '#1F3555' },
});