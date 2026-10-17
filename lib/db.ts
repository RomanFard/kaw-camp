import { Pool } from "pg";

// جلوگیری از ساخت مکرر Pool در حین توسعه (Next.js Hot Reload)
const globalForPg = global as unknown as { pool: Pool | undefined };

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // چون سرور ما گواهی SSL ندارد، این مقدار false است
  });

if (process.env.NODE_ENV !== "production") globalForPg.pool = pool;

// تابع کمکی برای کوئری زدن راحت‌تر
export async function query(text: string, params?: any[]) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}