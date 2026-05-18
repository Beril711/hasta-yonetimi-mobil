const ISTANBUL_HOSPITALS = [
  { place_id: "1", name: "Acıbadem Kadıköy Hastanesi", address: "Tekin Sok. No:8, Kadıköy", latitude: 40.9906, longitude: 29.0290, rating: 4.8 },
  { place_id: "2", name: "Memorial Şişli Hastanesi", address: "Piyalepaşa Bulvarı, Şişli", latitude: 41.0553, longitude: 28.9769, rating: 4.7 },
  { place_id: "3", name: "Florence Nightingale Hastanesi", address: "Abide-i Hürriyet Cad., Şişli", latitude: 41.0607, longitude: 28.9873, rating: 4.7 },
  { place_id: "4", name: "Şişli Etfal Hastanesi", address: "Halaskargazi Cad., Şişli", latitude: 41.0569, longitude: 28.9872, rating: 4.4 },
  { place_id: "5", name: "Marmara Üniversitesi Hastanesi", address: "Fevzi Çakmak Mah., Pendik", latitude: 40.8930, longitude: 29.2717, rating: 4.5 },
  { place_id: "6", name: "Kartal Eğitim Araştırma Hastanesi", address: "E-5 Karayolu, Kartal", latitude: 40.8893, longitude: 29.1850, rating: 4.3 },
  { place_id: "7", name: "Cerrahpaşa Tıp Fakültesi", address: "Kocamustafapaşa, Fatih", latitude: 41.0037, longitude: 28.9494, rating: 4.5 },
  { place_id: "8", name: "İstanbul Tıp Fakültesi", address: "Çapa, Fatih", latitude: 41.0096, longitude: 28.9413, rating: 4.6 },
  { place_id: "9", name: "Bakırköy Devlet Hastanesi", address: "İstanbul Cad., Bakırköy", latitude: 40.9808, longitude: 28.8522, rating: 4.2 },
  { place_id: "10", name: "Haydarpaşa Numune Hastanesi", address: "Tıbbiye Cad., Üsküdar", latitude: 41.0046, longitude: 29.0192, rating: 4.4 },
  { place_id: "11", name: "Alman Hastanesi", address: "Sıraselviler Cad., Beyoğlu", latitude: 41.0364, longitude: 28.9832, rating: 4.6 },
  { place_id: "12", name: "Göztepe Eğitim Araştırma Hastanesi", address: "Fahrettin Kerim Gökay Cad., Kadıköy", latitude: 40.9812, longitude: 29.0517, rating: 4.5 }
];

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getFallbackHospitals(userLat = 41.0430, userLng = 29.0043) {
  return ISTANBUL_HOSPITALS
    .map((h) => ({
      ...h,
      distance: Math.round(haversine(userLat, userLng, h.latitude, h.longitude))
    }))
    .sort((a, b) => a.distance - b.distance);
}