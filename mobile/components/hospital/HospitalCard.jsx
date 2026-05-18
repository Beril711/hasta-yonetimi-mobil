import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HospitalCard({ hospital, onPress }) {
  const distanceLabel = (m) => {
    if (!m) return '';
    return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.row}>
        <Text style={styles.icon}>🏥</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{hospital.name}</Text>
          <Text style={styles.address}>{hospital.address || 'Adres bilgisi yok'}</Text>
        </View>
        {hospital.distance > 0 && (
          <View style={styles.distBadge}>
            <Text style={styles.distText}>{distanceLabel(hospital.distance)}</Text>
          </View>
        )}
      </View>
      {hospital.rating && (
        <Text style={styles.rating}>⭐ {hospital.rating}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { fontSize: 28 },
  name: { fontSize: 15, fontWeight: '600', color: '#1F3555', marginBottom: 2 },
  address: { fontSize: 12, color: '#515561' },
  distBadge: {
    backgroundColor: '#F0F7FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distText: { fontSize: 11, fontWeight: '600', color: '#1C7293' },
  rating: { fontSize: 12, color: '#B07D1A', marginTop: 6 },
});