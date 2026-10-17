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
    const res = await query("SELECT * FROM attributes WHERE is_active = true ORDER BY order_index ASC");
    return res.rows as Attribute[];
  } catch (error) {
    return [];
  }
}

export async function createAttribute(input: any) {
  const sql = `
    INSERT INTO attributes (key, label, type, values, unit, category_scope, order_index, is_active) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `;
  const values = [input.key, input.label, input.type, JSON.stringify(input.values), input.unit, JSON.stringify(input.category_scope), input.order_index, input.is_active];
  try {
    const res = await query(sql, values);
    return { data: res.rows[0], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function updateAttribute(id: string, input: any) {
  const sql = `
    UPDATE attributes SET 
      key = $2, label = $3, type = $4, values = $5, unit = $6, category_scope = $7, order_index = $8, is_active = $9, updated_at = NOW()
    WHERE id = $1 RETURNING *
  `;
  const values = [id, input.key, input.label, input.type, JSON.stringify(input.values), input.unit, JSON.stringify(input.category_scope), input.order_index, input.is_active];
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