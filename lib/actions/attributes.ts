"use server";

import { query } from "@/lib/db";

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

// 🆕 تایپ ورودی برای ساخت/ویرایش ویژگی
export type AttributeInput = {
  key: string;
  label: string;
  type: AttributeType;
  values: string[];
  unit: string;
  category_scope: string[];
  order_index: number;
  is_active: boolean;
};

export async function getAllAttributes(): Promise<Attribute[]> {
  try {
    const res = await query("SELECT * FROM attributes ORDER BY order_index ASC");
    return res.rows as Attribute[];
  } catch (error) {
    console.error("Error loading attributes:", error);
    return [];
  }
}

export async function getActiveAttributes(): Promise<Attribute[]> {
  try {
    const res = await query(
      "SELECT * FROM attributes WHERE is_active = true ORDER BY order_index ASC"
    );
    return res.rows as Attribute[];
  } catch (error) {
    return [];
  }
}

export async function createAttribute(input: AttributeInput) {
  const sql = `
    INSERT INTO attributes (key, label, type, values, unit, category_scope, order_index, is_active) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `;
  const values = [
    input.key,
    input.label,
    input.type,
    JSON.stringify(input.values),
    input.unit,
    JSON.stringify(input.category_scope),
    input.order_index,
    input.is_active,
  ];
  try {
    const res = await query(sql, values);
    return { data: res.rows[0], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function updateAttribute(id: string, input: Partial<AttributeInput>) {
  const sql = `
    UPDATE attributes SET 
      key = COALESCE($2, key), 
      label = COALESCE($3, label), 
      type = COALESCE($4, type), 
      values = COALESCE($5, values), 
      unit = COALESCE($6, unit), 
      category_scope = COALESCE($7, category_scope), 
      order_index = COALESCE($8, order_index), 
      is_active = COALESCE($9, is_active), 
      updated_at = NOW()
    WHERE id = $1 RETURNING *
  `;
  const values = [
    id,
    input.key ?? null,
    input.label ?? null,
    input.type ?? null,
    input.values ? JSON.stringify(input.values) : null,
    input.unit ?? null,
    input.category_scope ? JSON.stringify(input.category_scope) : null,
    input.order_index ?? null,
    input.is_active ?? null,
  ];
  try {
    const res = await query(sql, values);
    return { data: res.rows[0], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function deleteAttribute(id: string) {
  try {
    await query("DELETE FROM attributes WHERE id = $1", [id]);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
}