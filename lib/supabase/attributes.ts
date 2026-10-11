import { createClient } from "./client";

// ═══════════════════════════════════════════
// تایپ‌ها
// ═══════════════════════════════════════════
export type AttributeType = "select" | "text" | "number";

export type Attribute = {
  id: string;
  key: string;
  label: string;
  type: AttributeType;
  values: string[];
  unit: string;
  category_scope: string[];
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AttributeInput = Omit<
  Attribute,
  "id" | "created_at" | "updated_at"
>;

// ═══════════════════════════════════════════
// خواندن
// ═══════════════════════════════════════════
export async function getAllAttributes(): Promise<Attribute[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attributes")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error loading attributes:", error);
    return [];
  }
  return (data ?? []) as Attribute[];
}

export async function getActiveAttributes(): Promise<Attribute[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attributes")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) return [];
  return (data ?? []) as Attribute[];
}

// 🆕 attributeها برای یک دسته‌بندی خاص
// (اگه category_scope خالی باشه → همه دسته‌ها)
export async function getAttributesForCategory(
  categoryKey: string
): Promise<Attribute[]> {
  const all = await getActiveAttributes();
  return all.filter(
    (a) =>
      a.category_scope.length === 0 ||
      a.category_scope.includes(categoryKey)
  );
}

// ═══════════════════════════════════════════
// نوشتن
// ═══════════════════════════════════════════
export async function createAttribute(input: AttributeInput) {
  const supabase = createClient();
  return supabase.from("attributes").insert(input);
}

export async function updateAttribute(
  id: string,
  input: Partial<AttributeInput>
) {
  const supabase = createClient();
  return supabase
    .from("attributes")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function deleteAttribute(id: string) {
  const supabase = createClient();
  return supabase.from("attributes").delete().eq("id", id);
}

// ═══════════════════════════════════════════
// تولید key از label (فارسی → انگلیسی)
// ═══════════════════════════════════════════
export function generateAttributeKey(label: string): string {
  // اگه کاربر key انگلیسی داد، همون رو نگه دار
  const trimmed = label.trim();
  if (!trimmed) return "";

  // نگاشت حروف پرکاربرد فارسی → انگلیسی
  const map: Record<string, string> = {
    ظ: "z",
    ر: "r",
    ف: "f",
    ی: "y",
    ت: "t",
    ج: "j",
    ن: "n",
    س: "s",
    و: "v",
    ز: "z",
    ق: "q",
    ک: "k",
    گ: "g",
    ل: "l",
    م: "m",
    ه: "h",
    ع: "a",
    ب: "b",
    پ: "p",
    د: "d",
    خ: "kh",
    ش: "sh",
    چ: "ch",
    ژ: "zh",
    ث: "s",
    ح: "h",
    ذ: "z",
    ص: "s",
    ض: "z",
    ط: "t",
    غ: "gh",
    a: "a",
  };

  const romanized = trimmed
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("");

  return romanized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}