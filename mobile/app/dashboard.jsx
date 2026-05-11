import { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../lib/api";
import { removeToken } from "../lib/storage";
import { C, shadow } from "../lib/theme";

const { width } = Dimensions.get("window");
const CARD_W = (width - 48 - 12) / 2;

const SERVICES = [
  { icon: "🧠", bg: C.primaryLight, title: "Belirti Analizi",   desc: "AI ile belirtilerinizi analiz edin", href: "/symptom" },
  { icon: "🏥", bg: "#EFF6FF",       title: "Yakın Hastaneler", desc: "Konumunuza göre hastane bulun",     href: "/hospitals" },
  { icon: "📅", bg: C.accentLight,   title: "Randevu Al",       desc: "Yeni randevu oluşturun",           href: "/appointments/new" },
  { icon: "📋", bg: "#F5F3FF",       title: "Randevularım",     desc: "Aktif ve geçmiş randevularınız",   href: "/appointments" },
  { icon: "🔔", bg: "#FFF7ED",       title: "Bildirimler",      desc: "Sistem bildirimleri",              href: "/notifications" },
  { icon: "👤", bg: "#F0FDF4",       title: "Profilim",         desc: "Bilgilerinizi düzenleyin",         href: "/profile" },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await removeToken();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  const firstName = user?.full_name?.split(" ")[0] || "…";

  return (
    <SafeAreaView style={styles.safe}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navLogo}>Med<Text style={{ color: C.accent }}>Hub</Text></Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.wCircle1} />
          <View style={styles.wCircle2} />
          <Text style={styles.welcomeGreeting}>Hoş geldin, {firstName} 👋</Text>
          <Text style={styles.welcomeMsg}>
            Sağlığınla ilgili her adımda yanındayız.
          </Text>
        </View>

        {/* Services Grid */}
        <View style={styles.grid}>
          {SERVICES.map((s) => (
            <TouchableOpacity
              key={s.href}
              style={styles.serviceCard}
              onPress={() => router.push(s.href)}
              activeOpacity={0.85}
            >
              <View style={[styles.serviceIconBox, { backgroundColor: s.bg }]}>
                <Text style={styles.serviceIconText}>{s.icon}</Text>
              </View>
              <Text style={styles.serviceName}>{s.title}</Text>
              <Text style={styles.serviceDesc}>{s.desc}</Text>
              <Text style={styles.serviceArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.bg },
  navbar: {
    backgroundColor: C.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  navLogo: { fontSize: 22, fontWeight: "800", color: C.primary },
  logoutBtn: {
    backgroundColor: C.dangerLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  logoutText: { color: C.danger, fontWeight: "600", fontSize: 13 },
  scroll: { flex: 1 },

  /* Welcome card */
  welcomeCard: {
    backgroundColor: C.primary,
    margin: 16,
    borderRadius: 16,
    padding: 28,
    overflow: "hidden",
    position: "relative",
  },
  wCircle1: {
    position: "absolute", top: -50, right: -30,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  wCircle2: {
    position: "absolute", bottom: -40, right: 30,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  welcomeGreeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
    zIndex: 1,
  },
  welcomeMsg: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    zIndex: 1,
  },

  /* Services grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  serviceCard: {
    width: CARD_W,
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow(1),
  },
  serviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  serviceIconText: { fontSize: 20 },
  serviceName: { fontSize: 13, fontWeight: "700", color: C.text, marginBottom: 4 },
  serviceDesc: { fontSize: 11, color: C.textMuted, lineHeight: 16 },
  serviceArrow: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: 14,
    color: C.primary,
  },
});
