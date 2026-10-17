"use server";

import { query } from "@/lib/db";

export type Brand = {
  id: string;
  name: string;
  logo: string;
  href: string;
  order_index: number;
  is_active: boolean;
};

export async function getAllBrands(): Promise<Brand[]> {
  try {
    const res = await query("SELECT * FROM brands ORDER BY order_index ASC");
    return res.rows as Brand[];
  } catch (error) {
    return [];
  }
}

export async function getActiveBrands(): Promise<Brand[]> {
  try {
    const res = await query("SELECT * FROM brands WHERE is_active = true ORDER BY order_index ASC");
    return res.rows as Brand[];
  } catch (error) {
    return [];
  }
}

export async function createBrand(brand: Omit<Brand, "id">) {
  const sql = `INSERT INTO brands (name, logo, href, order_index, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [brand.name, brand.logo, brand.href, brand.order_index, brand.is_active];
  try {
    const res = await query(sql, values);
    return { data: res.rows[0], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function updateBrand(id: string, brand: Omit<Brand, "id">) {
  const sql = `UPDATE brands SET name = $2, logo = $3, href = $4, order_index = $5, is_active = $6 WHERE id = $1 RETURNING *`;
  const values = [id, brand.name, brand.logo, brand.href, brand.order_index, brand.is_active];
  try {
    const res = await query(sql, values);
    return { data: res.rows[0], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function deleteBrand(id: string) {
  try {
    await query("DELETE FROM brands WHERE id = $1", [id]);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
}