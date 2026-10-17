"use server";

import { query } from "@/lib/db";
import type { Product, Category } from "@/data/products";

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : undefined,
    costPrice: row.cost_price ? Number(row.cost_price) : undefined,
    category: row.category as Category,
    image: row.image,
    images: row.images ?? undefined,
    rating: Number(row.rating),
    reviews: row.reviews,
    inStock: row.in_stock,
    shortDesc: row.short_desc,
    description: row.description,
    features: row.features ?? [],
    brand: row.brand ?? undefined,
    englishName: row.english_name ?? undefined,
    colors: row.colors ?? undefined,
    sizes: row.sizes ?? undefined,
    capacities: row.capacities ?? undefined,
    specs: row.specs ?? undefined,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await query("SELECT * FROM products ORDER BY id ASC");
    return res.rows.map(rowToProduct);
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await query("SELECT * FROM products WHERE id = $1 LIMIT 1", [id]);
    if (res.rows.length === 0) return null;
    return rowToProduct(res.rows[0]);
  } catch (error) {
    return null;
  }
}

export async function createProduct(p: Product) {
  const sql = `
    INSERT INTO products (
      id, name, slug, price, old_price, cost_price, category, image, images, 
      rating, reviews, in_stock, short_desc, description, features, brand, 
      english_name, colors, sizes, capacities, specs
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
    RETURNING *
  `;
  const values = [
    p.id, p.name, p.slug, p.price, p.oldPrice ?? null, p.costPrice ?? 0,
    p.category, p.image, p.images ? JSON.stringify(p.images) : null,
    p.rating, p.reviews, p.inStock, p.shortDesc, p.description,
    p.features ? JSON.stringify(p.features) : null, p.brand ?? null,
    p.englishName ?? null, p.colors ? JSON.stringify(p.colors) : null,
    p.sizes ? JSON.stringify(p.sizes) : null, p.capacities ? JSON.stringify(p.capacities) : null,
    p.specs ? JSON.stringify(p.specs) : null
  ];
  try {
    const res = await query(sql, values);
    return { data: res.rows[0], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function updateProduct(id: string, p: Product) {
  const sql = `
    UPDATE products SET 
      name = $2, slug = $3, price = $4, old_price = $5, cost_price = $6, 
      category = $7, image = $8, images = $9, rating = $10, reviews = $11, 
      in_stock = $12, short_desc = $13, description = $14, features = $15, 
      brand = $16, english_name = $17, colors = $18, sizes = $19, 
      capacities = $20, specs = $21, updated_at = NOW()
    WHERE id = $1
  `;
  const values = [
    id, p.name, p.slug, p.price, p.oldPrice ?? null, p.costPrice ?? 0,
    p.category, p.image, p.images ? JSON.stringify(p.images) : null,
    p.rating, p.reviews, p.inStock, p.shortDesc, p.description,
    p.features ? JSON.stringify(p.features) : null, p.brand ?? null,
    p.englishName ?? null, p.colors ? JSON.stringify(p.colors) : null,
    p.sizes ? JSON.stringify(p.sizes) : null, p.capacities ? JSON.stringify(p.capacities) : null,
    p.specs ? JSON.stringify(p.specs) : null
  ];
  try {
    const res = await query(sql, values);
    return { data: res.rows[0], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function deleteProduct(id: string) {
  try {
    await query("DELETE FROM products WHERE id = $1", [id]);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
}

export async function generateNextProductId(): Promise<string> {
  try {
    const res = await query("SELECT id FROM products ORDER BY CAST(id AS INTEGER) DESC LIMIT 1");
    if (res.rows.length === 0) return "1";
    const lastId = Number(res.rows[0].id);
    if (Number.isNaN(lastId)) return "1";
    return String(lastId + 1);
  } catch (error) {
    return "1";
  }
}