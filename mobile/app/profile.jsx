import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../lib/api';
import { removeToken } from '../lib/storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/auth/me')
      .then((r) => {
        setUser(r.data);
        setForm({ full_name: r.data.full_name || '', email: r.data.email || '' });
      })
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const r = await api.patch('/auth/me', { full_name: form.full_name });
      setUser(r.data);
      setEditing(false);
      setMessage('Profil güncellendi');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Güncelleme başarısız');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istediğinizden emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await removeToken();
          router.replace('/login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1F3555" />
      </View>
    );
  }

  const initials = (user?.full_name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profilim</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName}>{user?.full_name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Kişisel Bilgiler</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Text style={styles.editLink}>{editing ? 'İptal' : 'Düzenle'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>AD SOYAD</Text>
        <TextInput
          style={[styles.input, !editing && styles.inputDisabled]}
          value={form.full_name}
          onChangeText={(v) => setForm({ ...form, full_name: v })}
          editable={editing}
        />

        <Text style={styles.label}>E-POSTA</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={form.email}
          editable={false}
        />

        {message ? (
          <Text style={[styles.message, message.includes('güncellendi') ? styles.messageSuccess : styles.messageError]}>
            {message}
          </Text>
        ) : null}

        {editing && (
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.5 }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hesap Bilgileri</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hesap ID</Text>
          <Text style={styles.infoValue}>{user?.id?.slice(0, 8)}...</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Durum</Text>
          <Text style={[styles.infoValue, { color: '#0D9488' }]}>
            {user?.is_active ? 'Aktif' : 'Pasif'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Hesaptan Çıkış Yap</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F3F4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F3F4' },
  header: {
    backgroundColor: '#FFF', padding: 16, paddingTop: 50,
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backButton: { fontSize: 14, color: '#1F3555', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#1F3555' },
  avatarSection: {
    alignItems: 'center', paddingVertical: 24,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#1F3555',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { color: '#FFF', fontSize: 26, fontWeight: '700' },
  userName: { fontSize: 20, fontWeight: '700', color: '#1F3555', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#515561' },
  card: {
    backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 12,
    borderRadius: 12, padding: 18, borderWidth: 1, borderColor: '#E5E7EB',
  },
  cardHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F3555' },
  editLink: { fontSize: 13, color: '#1F3555', fontWeight: '600' },
  label: {
    fontSize: 11, fontWeight: '600', color: '#515561',
    letterSpacing: 0.5, marginBottom: 8, marginTop: 4,
  },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8,
    padding: 12, fontSize: 14, color: '#242740', backgroundColor: '#FFF', marginBottom: 12,
  },
  inputDisabled: { backgroundColor: '#F4F3F4', color: '#515561' },
  message: { fontSize: 13, padding: 10, borderRadius: 8, marginBottom: 12 },
  messageSuccess: { backgroundColor: '#F0FDF4', color: '#0D9488' },
  messageError: { backgroundColor: '#FEF2F2', color: '#C33C3C' },
  saveBtn: {
    backgroundColor: '#1F3555', borderRadius: 8, padding: 14, alignItems: 'center',
  },
  saveBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F4F3F4',
  },
  infoLabel: { fontSize: 13, color: '#515561' },
  infoValue: { fontSize: 13, fontWeight: '600', color: '#1F3555' },
  logoutBtn: {
    marginHorizontal: 16, marginTop: 12, backgroundColor: '#FEF2F2',
    borderRadius: 12, padding: 15, alignItems: 'center',
    borderWidth: 1, borderColor: '#FECACA',
  },
  logoutText: { color: '#C33C3C', fontSize: 15, fontWeight: '700' },
});