import { createClient } from "./client";
import type { Product, Category } from "@/data/products";

// ═══════════════════════════════════════════
// تایپ ردیف Supabase (snake_case)
// ═══════════════════════════════════════════
export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  old_price: number | null;
  category: string;
  image: string;
  images: string[] | null;
  rating: number;
  reviews: number;
  in_stock: boolean;
  short_desc: string;
  description: string;
  features: string[] | null;
  brand: string | null;
  english_name: string | null;
  colors: { label: string; value: string }[] | null;
  created_at?: string;
  updated_at?: string;
};

// ═══════════════════════════════════════════
// تبدیل Supabase → Product
// ═══════════════════════════════════════════
export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    category: row.category as Category,
    image: row.image,
    images: row.images ?? undefined,
    rating: row.rating,
    reviews: row.reviews,
    inStock: row.in_stock,
    shortDesc: row.short_desc,
    description: row.description,
    features: row.features ?? [],
    brand: row.brand ?? undefined,
    englishName: row.english_name ?? undefined,
    colors: row.colors ?? undefined,
  };
}

// ═══════════════════════════════════════════
// تبدیل Product → Supabase row
// ═══════════════════════════════════════════
export function productToRow(
  p: Product
): Omit<ProductRow, "created_at" | "updated_at"> {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    old_price: p.oldPrice ?? null,
    category: p.category,
    image: p.image,
    images: p.images ?? null,
    rating: p.rating,
    reviews: p.reviews,
    in_stock: p.inStock,
    short_desc: p.shortDesc,
    description: p.description,
    features: p.features ?? [],
    brand: p.brand ?? null,
    english_name: p.englishName ?? null,
    colors: p.colors ?? null,
  };
}

// ═══════════════════════════════════════════
// خواندن
// ═══════════════════════════════════════════
export async function getAllProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error loading products:", error);
    return [];
  }
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToProduct(data as ProductRow);
}

// ═══════════════════════════════════════════
// نوشتن
// ═══════════════════════════════════════════
export async function createProduct(p: Product) {
  const supabase = createClient();
  return supabase.from("products").insert(productToRow(p));
}

export async function updateProduct(id: string, p: Product) {
  const supabase = createClient();
  const row = productToRow(p);
  // id رو از آپدیت حذف میکنیم (چون کلیدن)
  const { id: _, ...rest } = row;
  return supabase.from("products").update(rest).eq("id", id);
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  return supabase.from("products").delete().eq("id", id);
}

// ═══════════════════════════════════════════
// تولید id جدید (عددی، بالاترین + ۱)
// ═══════════════════════════════════════════
export async function generateNextProductId(): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (!data || data.length === 0) return "1";
  const lastId = Number(data[0].id);
  if (Number.isNaN(lastId)) return "1";
  return String(lastId + 1);
}