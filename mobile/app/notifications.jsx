import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../lib/api';
import { C, shadow } from '../lib/theme';

const TYPE_ICONS = {
  appointment: '📅',
  reminder: '⏰',
  system: '🔔',
  cancellation: '❌',
  info: 'ℹ️',
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications/')
      .then((r) => setNotifications(r.data || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Bildirimler</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>Sistem bildirimleri ve hatırlatmalar</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>Bildirim yok</Text>
          <Text style={styles.emptyDesc}>Şu an için yeni bir bildiriminiz bulunmuyor.</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.card, !n.is_read && styles.cardUnread]}
              onPress={() => !n.is_read && handleMarkRead(n.id)}
              activeOpacity={0.75}
            >
              <View style={styles.iconBox}>
                <Text style={styles.iconText}>
                  {TYPE_ICONS[n.type] || TYPE_ICONS.system}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.notifTop}>
                  <Text style={styles.notifTitle}>{n.title}</Text>
                  {!n.is_read && <View style={styles.dot} />}
                </View>
                <Text style={styles.notifMessage}>{n.message}</Text>
                {n.created_at && (
                  <Text style={styles.notifTime}>
                    {new Date(n.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '700', color: C.text },
  badge: {
    backgroundColor: C.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  subtitle: { fontSize: 13, color: C.textMuted },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: C.surface,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow(1),
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 19 },
  notifTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: C.text, flex: 1 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  notifMessage: { fontSize: 13, color: C.textSec, lineHeight: 19, marginBottom: 4 },
  notifTime: { fontSize: 11, color: C.textMuted },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  emptyDesc: { fontSize: 13, color: C.textMuted, textAlign: 'center', lineHeight: 20 },
});
