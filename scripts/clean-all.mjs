import pg from "pg";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

async function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) throw new Error(".env.local پیدا نشد.");
  const text = await readFile(envPath, "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

async function main() {
  const env = await loadEnv();
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  
  console.log("📥 در حال پاک کردن دیتابیس PostgreSQL...");
  try {
    await pool.query("DELETE FROM products;");
    await pool.query("DELETE FROM brands;");
    console.log("   ✅ دیتابیس پستگرس با موفقیت خالی شد.");
  } catch (e) {
    console.error("   ❌ خطا در پاک کردن دیتابیس:", e.message);
  }
  await pool.end();
}

main().catch(console.error);