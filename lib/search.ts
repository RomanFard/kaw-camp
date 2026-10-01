import { Product } from "@/data/products";

// نرمال‌سازی متن فارسی (ی/ي، ک/ك، حذف نیم‌فاصله، اعداد)
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[يﻯﻰ]/g, "ی")
    .replace(/[كﻙ]/g, "ک")
    .replace(/[ۀﻩهٔ]/g, "ه")
    .replace(/[أإآا]/g, "ا")
    .replace(/[ؤو]/g, "و")
    .replace(/\u200c/g, " ")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[^\w\sآ-ی]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// محاسبه امتیاز تطابق
type MatchResult = {
  product: Product;
  score: number;
  matchReason: string;
};

export function searchProducts(
  query: string,
  products: Product[]
): MatchResult[] {
  const q = normalizeText(query);
  if (!q) return [];

  const qWords = q.split(" ").filter((w) => w.length > 0);

  const results: MatchResult[] = products.map((product) => {
    let score = 0;
    let matchReason = "";

    // 1. تطابق کد محصول
    if (product.id === query.trim() || product.id === q) {
      score += 1000;
      matchReason = "کد محصول";
    }

    // 2. تطابق مدل در نام انگلیسی
    const englishName = (product.englishName || "").toLowerCase();
    const slug = (product.slug || "").toLowerCase();
    const englishQuery = query.toLowerCase().trim();

    if (
      englishQuery.length >= 3 &&
      (englishName.includes(englishQuery) || slug.includes(englishQuery))
    ) {
      score += 800;
      matchReason = matchReason || "مدل محصول";
    }

    // 3. تطابق نام
    const name = normalizeText(product.name);
    for (const word of qWords) {
      if (name.includes(word)) {
        if (name.split(" ").includes(word)) {
          score += 100;
        } else {
          score += 50;
        }
        matchReason = matchReason || "نام محصول";
      }
    }

    if (name.includes(q)) {
      score += 200;
      matchReason = "نام محصول";
    }

    // 4. تطابق برند
    const brand = normalizeText(product.brand || "");
    if (brand && qWords.some((w) => brand.includes(w))) {
      score += 80;
      matchReason = matchReason || "برند";
    }

    // 5. تطابق دسته‌بندی
    const categoryLabels: Record<string, string> = {
      tent: "چادر",
      sleep: "کیسه خواب",
      mattress: "زیرانداز",
      backpack: "کوله پشتی",
      clothing: "لباس کوهنوردی",
      shoes: "کفش کوهنوردی",
      socks: "جوراب",
      gaiters: "گتر",
      tools: "ابزار فنی",
      lighting: "لامپ و چراغ",
      bottle: "لیوان و قمقمه",
      cooking: "لوازم پخت و پز",
      sunglasses: "عینک",
      watch: "ساعت ورزشی",
      bicycle: "دوچرخه",
      accessories: "اکسسوری",
    };

    const catLabel = normalizeText(categoryLabels[product.category] || "");
    if (catLabel && qWords.some((w) => catLabel.includes(w))) {
      score += 60;
      matchReason = matchReason || "دسته‌بندی";
    }

    // 6. تطابق ویژگی‌ها
    const featuresText = normalizeText(product.features.join(" "));
    for (const word of qWords) {
      if (word.length >= 3 && featuresText.includes(word)) {
        score += 30;
        matchReason = matchReason || "ویژگی‌ها";
      }
    }

    // 7. تطابق توضیحات کوتاه
    const shortDesc = normalizeText(product.shortDesc);
    for (const word of qWords) {
      if (word.length >= 3 && shortDesc.includes(word)) {
        score += 20;
        matchReason = matchReason || "توضیحات";
      }
    }

    // 8. تطابق توضیحات کامل
    const desc = normalizeText(product.description);
    for (const word of qWords) {
      if (word.length >= 3 && desc.includes(word)) {
        score += 10;
        matchReason = matchReason || "توضیحات";
      }
    }

    // 9. تطابق رنگ‌ها
    const colorsText = normalizeText(
      (product.colors || []).map((c) => c.label).join(" ")
    );
    if (colorsText && qWords.some((w) => colorsText.includes(w))) {
      score += 40;
      matchReason = matchReason || "رنگ";
    }

    // امتیاز ویژه برای تطابق همه کلمات
    if (qWords.length > 1) {
      const allText = [name, brand, featuresText, shortDesc, desc].join(" ");
      if (qWords.every((w) => allText.includes(w))) {
        score += 150;
      }
    }

    return { product, score, matchReason };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

// پیشنهادات جستجو
export const popularSearches = [
  "چادر",
  "کوله پشتی",
  "کیسه خواب",
  "Naturehike",
  "اجاق گاز",
  "عینک",
  "ساعت",
];

// دسته‌های پیشنهادی
export const suggestedCategories = [
  { key: "tent", label: "چادر", emoji: "⛺" },
  { key: "backpack", label: "کوله پشتی", emoji: "🎒" },
  { key: "sleep", label: "کیسه خواب", emoji: "🛏️" },
  { key: "lighting", label: "لامپ و چراغ", emoji: "🔦" },
  { key: "cooking", label: "لوازم پخت و پز", emoji: "🍳" },
  { key: "clothing", label: "لباس کوهنوردی", emoji: "🧥" },
];