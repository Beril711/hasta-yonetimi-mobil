import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { C, shadow } from '../../lib/theme';

const QUICK_TAGS = [
  'Baş ağrısı', 'Ateş', 'Öksürük', 'Karın ağrısı',
  'Mide bulantısı', 'Bel ağrısı', 'Göğüs ağrısı', 'Nefes darlığı',
  'Halsizlik', 'Baş dönmesi', 'Eklem ağrısı', 'Boğaz ağrısı',
];

export default function SymptomForm({ onSubmit, loading }) {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState([]);

  const toggleTag = (tag) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    const tagPart = selected.length ? `Belirtiler: ${selected.join(', ')}. ` : '';
    const payload = (tagPart + text).trim();
    if (payload.length < 5) return;
    onSubmit(payload);
  };

  const canSubmit = !loading && (text.trim().length >= 5 || selected.length > 0);

  return (
    <View style={styles.wrap}>
      {/* Textarea */}
      <View style={styles.card}>
        <Text style={styles.label}>ŞİKAYETİNİZİ ANLATIN</Text>
        <TextInput
          style={styles.textarea}
          multiline
          numberOfLines={5}
          maxLength={500}
          value={text}
          onChangeText={setText}
          placeholder="Örn: 3 gündür başım ağrıyor ve ateşim var..."
          placeholderTextColor={C.textMuted}
          textAlignVertical="top"
          editable={!loading}
        />
        <Text style={styles.charCount}>{text.length} / 500</Text>
      </View>

      {/* Quick tags */}
      <View style={styles.card}>
        <Text style={styles.label}>HIZLI BELİRTİ SEÇİMİ</Text>
        <View style={styles.tagsWrap}>
          {QUICK_TAGS.map((tag) => {
            const active = selected.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, active && styles.tagActive]}
                onPress={() => toggleTag(tag)}
                disabled={loading}
              >
                <Text style={[styles.tagText, active && styles.tagTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Analiz ediliyor...' : '✨  AI ile Analiz Et'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  card: {
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow(1),
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  textarea: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: C.text,
    minHeight: 110,
    backgroundColor: C.bg,
  },
  charCount: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'right',
    marginTop: 6,
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.bg,
  },
  tagActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  tagText: { fontSize: 12, color: C.textSec, fontWeight: '500' },
  tagTextActive: { color: '#fff' },
  button: {
    backgroundColor: C.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
