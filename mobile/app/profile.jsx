import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../lib/api';
import { removeToken } from '../lib/storage';
import { C, shadow } from '../lib/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);

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
    try {
      const r = await api.put('/auth/profile', { full_name: form.full_name });
      setUser(r.data);
      setEditing(false);
      Alert.alert('Kaydedildi', 'Profiliniz güncellendi.');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.detail || 'Güncelleme başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/auth/change-password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setPasswordForm({ current_password: '', new_password: '', confirm: '' });
      setShowPassword(false);
      Alert.alert('Başarılı', 'Şifreniz güncellendi.');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.detail || 'Şifre değiştirilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
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
        <ActivityIndicator size="large" color={C.primary} />
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profilim</Text>
        <Text style={styles.subtitle}>Hesap bilgilerinizi yönetin</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.full_name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Profil Bilgileri */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Profil Bilgileri</Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editLink}>Düzenle</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>AD SOYAD</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={form.full_name}
            onChangeText={(v) => setForm({ ...form, full_name: v })}
            editable={editing}
            placeholderTextColor={C.textMuted}
          />

          <Text style={styles.label}>E-POSTA</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={form.email}
            editable={false}
            placeholderTextColor={C.textMuted}
          />

          {editing && (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setEditing(false);
                  setForm({ full_name: user.full_name, email: user.email });
                }}
              >
                <Text style={styles.cancelBtnText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.5 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.saveBtnText}>Kaydet</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Şifre Değiştir */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeaderRow}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.cardTitle}>Şifre Değiştir</Text>
            <Text style={styles.editLink}>{showPassword ? 'Kapat' : 'Aç'}</Text>
          </TouchableOpacity>

          {showPassword && (
            <>
              <Text style={styles.label}>MEVCUT ŞİFRE</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.current_password}
                onChangeText={(v) => setPasswordForm({ ...passwordForm, current_password: v })}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={C.textMuted}
              />
              <Text style={styles.label}>YENİ ŞİFRE</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.new_password}
                onChangeText={(v) => setPasswordForm({ ...passwordForm, new_password: v })}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={C.textMuted}
              />
              <Text style={styles.label}>YENİ ŞİFRE (TEKRAR)</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.confirm}
                onChangeText={(v) => setPasswordForm({ ...passwordForm, confirm: v })}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={C.textMuted}
              />
              <TouchableOpacity
                style={[styles.saveBtn, { marginTop: 4 }, saving && { opacity: 0.5 }]}
                onPress={handleChangePassword}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.saveBtnText}>Şifreyi Güncelle</Text>}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Çıkış */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Hesaptan Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg },
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  userName: { fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 4 },
  userEmail: { fontSize: 13, color: C.textMuted },
  card: {
    backgroundColor: C.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow(1),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  editLink: { fontSize: 13, color: C.primary, fontWeight: '600' },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 10,
    padding: 13,
    marginBottom: 12,
    fontSize: 14,
    color: C.text,
    backgroundColor: C.bg,
  },
  inputDisabled: { color: C.textSec, backgroundColor: C.bg },
  editActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, color: C.textSec, fontWeight: '600' },
  saveBtn: {
    flex: 1,
    backgroundColor: C.primary,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: C.dangerLight,
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: { color: C.danger, fontSize: 15, fontWeight: '700' },
});
