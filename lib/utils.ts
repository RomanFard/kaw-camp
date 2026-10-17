export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

export function generateAttributeKey(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return "";
  const map: Record<string, string> = {
    ظ: "z", ر: "r", ف: "f", ی: "y", ت: "t", ج: "j", ن: "n", س: "s", و: "v",
    ز: "z", ق: "q", ک: "k", گ: "g", ل: "l", م: "m", ه: "h", ع: "a", ب: "b",
    پ: "p", د: "d", خ: "kh", ش: "sh", چ: "ch", ژ: "zh", ث: "s", ح: "h",
    ذ: "z", ص: "s", ض: "z", ط: "t", غ: "gh", a: "a",
  };
  const romanized = trimmed.split("").map((ch) => map[ch] ?? ch).join("");
  return romanized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}