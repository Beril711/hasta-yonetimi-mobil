import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../lib/api';
import { getFallbackHospitals } from '../lib/hospitalFallback';
import HospitalCard from '../components/hospital/HospitalCard';

export default function HospitalsScreen() {
  const router = useRouter();
  const { department } = useLocalSearchParams();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await api.get('/hospitals/search', {
          params: { latitude: 41.0430, longitude: 29.0043, radius: 5000 },
        });
        if (res.data && res.data.length > 0) {
          setHospitals(res.data);
        } else {
          setHospitals(getFallbackHospitals());
        }
      } catch (err) {
        setHospitals(getFallbackHospitals());
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const filtered = hospitals.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Yakın Hastaneler</Text>
        {department && (
          <Text style={styles.subtitle}>Bölüm: {department}</Text>
        )}
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Hastane ara..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1F3555" />
          <Text style={styles.loadingText}>Hastaneler aranıyor...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🏥</Text>
          <Text style={styles.emptyText}>Hastane bulunamadı</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.map((h) => (
            <HospitalCard
              key={h.place_id || h.id}
              hospital={h}
              onPress={() =>
                router.push({
                  pathname: '/appointments/new',
                  params: { hospital_name: h.name, department: department || '' },
                })
              }
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
  title: { fontSize: 24, fontWeight: '700', color: '#1F3555' },
  subtitle: { fontSize: 13, color: '#515561', marginTop: 4 },
  searchBox: { padding: 16 },
  searchInput: {
    backgroundColor: '#FFF', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#E5E7EB', fontSize: 14, color: '#242740',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 13, color: '#515561', marginTop: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#515561' },
  list: { flex: 1, paddingHorizontal: 16 },
});