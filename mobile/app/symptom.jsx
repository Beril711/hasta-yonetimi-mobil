import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../lib/api';
import { fallbackAnalyze } from '../lib/symptomFallback';
import SymptomForm from '../components/symptom/SymptomForm';
import ResultCard from '../components/symptom/ResultCard';
import Skeleton from '../components/ui/Skeleton';
import { C } from '../lib/theme';

export default function SymptomScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (symptoms) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/symptoms/analyze', { symptoms });
      const data = response.data;
      const aiResponse = data?.ai_response || '';
      const hasError =
        aiResponse.includes("'message'") ||
        aiResponse.toLowerCase().includes('error') ||
        aiResponse.length < 20;
      setResult(hasError ? fallbackAnalyze(symptoms) : data);
    } catch {
      setResult(fallbackAnalyze(symptoms));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Belirti Analizi</Text>
        <Text style={styles.subtitle}>Şikayetlerinizi yazın, AI uygun bölümü önersin</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <SymptomForm onSubmit={handleAnalyze} loading={loading} />

        {loading && (
          <View style={styles.skeletonWrap}>
            <Skeleton height={20} width="50%" />
            <Skeleton height={16} />
            <Skeleton height={16} />
            <Skeleton height={16} width="70%" />
          </View>
        )}

        {result && !loading && <ResultCard result={result} />}
        <View style={{ height: 32 }} />
      </ScrollView>
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
  scroll: { flex: 1 },
  skeletonWrap: {
    backgroundColor: C.surface,
    margin: 16,
    padding: 20,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
});
