const RULES = {
  "Nöroloji": {
    strong: ["baş ağrısı", "migren", "baş dönmesi", "uyuşma", "felç"],
    medium: ["unutkanlık", "konsantrasyon", "titreme"],
    weak: ["yorgunluk", "halsizlik"]
  },
  "Kardiyoloji": {
    strong: ["göğüs ağrısı", "çarpıntı", "kalp", "nefes darlığı"],
    medium: ["yüksek tansiyon", "bayılma"],
    weak: ["yorgunluk", "halsizlik"]
  },
  "Dahiliye": {
    strong: ["ateş", "karın ağrısı", "ishal", "kusma", "mide bulantısı"],
    medium: ["iştahsızlık", "kilo kaybı"],
    weak: ["halsizlik", "yorgunluk"]
  },
  "Ortopedi": {
    strong: ["bel ağrısı", "diz ağrısı", "kemik", "eklem", "kırık"],
    medium: ["sırt ağrısı", "boyun ağrısı"],
    weak: ["ağrı"]
  },
  "Göz Hastalıkları": {
    strong: ["göz ağrısı", "görme bozukluğu", "kızarık göz", "sulanma"],
    medium: ["bulanık görme"],
    weak: []
  },
  "Kulak Burun Boğaz": {
    strong: ["boğaz ağrısı", "kulak ağrısı", "burun tıkanıklığı", "öksürük"],
    medium: ["geniz akıntısı", "ses kısıklığı"],
    weak: ["soğuk algınlığı"]
  },
  "Dermatoloji": {
    strong: ["kaşıntı", "döküntü", "egzama", "akne", "sivilce"],
    medium: ["kızarıklık", "leke"],
    weak: []
  },
  "Üroloji": {
    strong: ["idrar yolu", "böbrek ağrısı", "sık idrar"],
    medium: ["yanma"],
    weak: []
  },
  "Kadın Hastalıkları": {
    strong: ["adet düzensizliği", "regl", "menopoz"],
    medium: ["karın ağrısı"],
    weak: []
  },
  "Psikiyatri": {
    strong: ["depresyon", "anksiyete", "panik atak", "uykusuzluk"],
    medium: ["stres", "kaygı"],
    weak: []
  },
  "Göğüs Hastalıkları": {
    strong: ["nefes darlığı", "öksürük", "balgam", "astım"],
    medium: ["hırıltı"],
    weak: []
  },
  "Endokrinoloji": {
    strong: ["şeker", "tiroid", "kilo", "diyabet"],
    medium: ["susuzluk"],
    weak: []
  },
  "Aile Hekimliği": {
    strong: [],
    medium: ["genel kontrol"],
    weak: ["yorgunluk", "halsizlik"]
  }
};

export function fallbackAnalyze(symptomText) {
  const text = symptomText.toLowerCase();
  let bestDept = "Aile Hekimliği";
  let bestScore = 0;

  for (const [dept, keywords] of Object.entries(RULES)) {
    let score = 0;
    keywords.strong.forEach(k => { if (text.includes(k)) score += 5; });
    keywords.medium.forEach(k => { if (text.includes(k)) score += 3; });
    keywords.weak.forEach(k => { if (text.includes(k)) score += 1; });

    if (score > bestScore) {
      bestScore = score;
      bestDept = dept;
    }
  }

  if (bestScore < 3) {
    bestDept = "Aile Hekimliği";
  }

  return {
    suggested_department: bestDept,
    ai_response: `Belirtileriniz değerlendirildiğinde ${bestDept} bölümüne yönlendirilmeniz önerilir. Kesin teşhis için lütfen bir hekime danışın.`
  };
}