import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { C, shadow } from '../../lib/theme';

const DEPT_ICONS = {
  'Nöroloji': '🧠', 'Kardiyoloji': '❤️', 'Dahiliye': '🩺',
  'Ortopedi': '🦴', 'Göz Hastalıkları': '👁️', 'Kulak Burun Boğaz': '👂',
  'Dermatoloji': '🧴', 'Üroloji': '💧', 'Kadın Hastalıkları': '🌸',
  'Psikiyatri': '🧘', 'Göğüs Hastalıkları': '🫁', 'Endokrinoloji': '⚗️',
  'Aile Hekimliği': '👨‍⚕️',
};

export default function ResultCard({ result }) {
  const router = useRouter();
  const icon = DEPT_ICONS[result.suggested_department] || '🏥';

  return (
    <View style={styles.card}>
      {/* Bölüm başlığı */}
      <View style={styles.deptRow}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>ÖNERİLEN BÖLÜM</Text>
          <Text style={styles.department}>{result.suggested_department}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.label}>AI AÇIKLAMASI</Text>
      <Text style={styles.description}>{result.ai_response}</Text>

      {/* Uyarı */}
      <View style={styles.warning}>
        <Text style={styles.warningText}>
          ⚠️ Bu öneri kesin teşhis değildir. Mutlaka bir hekime danışın.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/hospitals?department=${result.suggested_department}`)}
      >
        <Text style={styles.buttonText}>Yakın Hastane Bul →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow(1),
  },
  deptRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 28 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  department: { fontSize: 20, fontWeight: '700', color: C.primary },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 14 },
  description: { fontSize: 14, color: C.text, lineHeight: 22, marginBottom: 16 },
  warning: {
    backgroundColor: C.warningLight,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: C.warning,
    marginBottom: 16,
  },
  warningText: { fontSize: 12, color: '#92400E', lineHeight: 18 },
  button: {
    backgroundColor: C.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
