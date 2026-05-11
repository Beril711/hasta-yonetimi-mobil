import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../lib/api';
import { C, shadow } from '../lib/theme';

const FALLBACK = [
  { id: 1, name: 'Acıbadem Kadıköy Hastanesi', address: 'Tekin Sok. No:8, Kadıköy', distance: 1200, rating: 4.8, departments: ['Kardiyoloji', 'Nöroloji', 'Ortopedi', 'Dahiliye'] },
  { id: 2, name: 'Marmara Üniversitesi Eğitim Araştırma Hastanesi', address: 'Fevzi Çakmak Mah., Pendik', distance: 3400, rating: 4.5, departments: ['Dahiliye', 'Göğüs Hastalıkları', 'Psikiyatri', 'Üroloji'] },
  { id: 3, name: 'Göztepe Prof. Dr. Süleyman Yalçın Şehir Hastanesi', address: 'Dr. Erkin Cad., Göztepe', distance: 2100, rating: 4.6, departments: ['Kardiyoloji', 'Göz Hastalıkları', 'KBB', 'Ortopedi'] },
  { id: 4, name: 'Kartal Eğitim ve Araştırma Hastanesi', address: 'E-5 Karayolu, Kartal', distance: 4800, rating: 4.3, departments: ['Dahiliye', 'Dermatoloji', 'Endokrinoloji', 'Kadın Hastalıkları'] },
  { id: 5, name: 'Florence Nightingale Hastanesi', address: 'Abide-i Hürriyet Cad., Şişli', distance: 5600, rating: 4.7, departments: ['Nöroloji', 'Kardiyoloji', 'Dahiliye', 'Psikiyatri'] },
];

function distanceLabel(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;
}

export default function HospitalsScreen() {
  const router = useRouter();
  const { department } = useLocalSearchParams();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/hospitals/search', {
      params: { latitude: 41.0430, longitude: 29.0043, radius: 5000 },
    })
      .then((r) => setHospitals(r.data?.length ? r.data : FALLBACK))
      .catch(() => setHospitals(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const filtered = hospitals.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Yakın Hastaneler</Text>
        <Text style={styles.subtitle}>
          {department ? `"${department}" için hastane seçin` : 'Konumunuza yakın hastaneler'}
        </Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Hastane ara..."
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={styles.loadingText}>Hastaneler yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {filtered.map((h) => (
            <View key={h.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>🏥</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{h.name}</Text>
                  <Text style={styles.address}>{h.address}</Text>
                </View>
                <View style={styles.distBadge}>
                  <Text style={styles.distText}>{distanceLabel(h.distance)}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.rating}>⭐ {h.rating}</Text>
                <Text style={styles.deptCount}>{(h.departments || []).length} bölüm</Text>
              </View>

              {(h.departments || []).length > 0 && (
                <View style={styles.deptWrap}>
                  {(h.departments || []).slice(0, 4).map((d) => (
                    <View key={d} style={styles.deptTag}>
                      <Text style={styles.deptTagText}>{d}</Text>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() =>
                  router.push(
                    `/appointments/new?hospital_name=${encodeURIComponent(h.name)}${department ? `&department=${encodeURIComponent(department)}` : ''}`
                  )
                }
              >
                <Text style={styles.bookBtnText}>Randevu Al →</Text>
              </TouchableOpacity>
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
  title: { fontSize: 26, fontWeight: '700', color: C.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: C.textMuted },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  searchInput: {
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: C.text,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: C.textMuted },
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
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 22 },
  name: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 3, flexShrink: 1 },
  address: { fontSize: 12, color: C.textMuted, lineHeight: 17 },
  distBadge: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distText: { fontSize: 11, color: C.primary, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  rating: { fontSize: 13, color: C.text, fontWeight: '500' },
  deptCount: { fontSize: 12, color: C.textMuted },
  deptWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  deptTag: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deptTagText: { fontSize: 11, color: C.textSec },
  bookBtn: {
    backgroundColor: C.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
