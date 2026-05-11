import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../lib/api";
import { setToken } from "../lib/storage";
import { C, shadow } from "../lib/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", form);
      await setToken(response.data.access_token);
      router.replace("/dashboard");
    } catch {
      setError("E-posta veya şifre hatalı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Text style={styles.logo}>Med<Text style={styles.logoAccent}>Hub</Text></Text>
          <Text style={styles.logoSub}>Akıllı Sağlık Platformu</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Giriş Yap</Text>

          {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

          <Text style={styles.label}>E-POSTA</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(v) => setForm({ ...form, email: v })}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="ornek@email.com"
            placeholderTextColor={C.textMuted}
          />

          <Text style={styles.label}>ŞİFRE</Text>
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={(v) => setForm({ ...form, password: v })}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={C.textMuted}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Giriş Yap</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.link}>Hesabın yok mu? <Text style={styles.linkBold}>Kayıt ol</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.bg },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logoWrap: { alignItems: "center", marginBottom: 32 },
  logo: { fontSize: 36, fontWeight: "800", color: C.primary },
  logoAccent: { color: C.accent },
  logoSub: { fontSize: 13, color: C.textMuted, marginTop: 4 },
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 28,
    width: "100%",
    maxWidth: 420,
    ...shadow(2),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: C.text,
    marginBottom: 20,
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: C.dangerLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { fontSize: 13, color: C.danger },
  label: {
    fontSize: 10,
    fontWeight: "700",
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
    marginBottom: 16,
    fontSize: 14,
    color: C.text,
    backgroundColor: C.bg,
  },
  button: {
    backgroundColor: C.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  link: { textAlign: "center", color: C.textSec, fontSize: 13 },
  linkBold: { color: C.primary, fontWeight: "600" },
});
