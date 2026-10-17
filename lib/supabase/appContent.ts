"use server";

import { query } from "@/lib/db";

export async function getAppContent<T = any>(key: string): Promise<T | null> {
  try {
    const res = await query("SELECT value FROM app_content WHERE key = $1", [key]);
    if (res.rows.length === 0) return null;
    return res.rows[0].value as T;
  } catch (error) {
    console.error(`Error loading app_content for ${key}:`, error);
    return null;
  }
}

export async function setAppContent(key: string, value: any) {
  try {
    const sql = `
      INSERT INTO app_content (key, value, updated_at) 
      VALUES ($1, $2, NOW()) 
      ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
    `;
    await query(sql, [key, JSON.stringify(value)]);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
}