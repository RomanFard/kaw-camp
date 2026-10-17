#!/usr/bin/env node
// ═══════════════════════════════════════════
// Overlay لوگو (مقاوم در برابر قطعی دیتابیس)
// ═══════════════════════════════════════════
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const hasFlag = (f) => args.includes(f);
const getArg = (name, def) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split("=").slice(1).join("=") : def;
};

const LOGO_PATH = getArg("logo", "./public/images/logo2.png");
const LOGO_SIZE_PERCENT = parseInt(getArg("size", "20"));
const OFFSET_Y = parseInt(getArg("offset-y", "60"));
const OFFSET_X = parseInt(getArg("offset-x", "20"));
const LIMIT = parseInt(getArg("limit", "5"));
const START_OFFSET = parseInt(getArg("start", "0"));
const RUN = hasFlag("--run");

function progressBar(current, total, width = 20) {
  const percent = Math.round((current / total) * 100);
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return { bar: "█".repeat(filled) + "░".repeat(empty), percent };
}

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
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  // 🆕 مدیریت خطاهای Pool
  const pool = new Pool({ 
    connectionString: env.DATABASE_URL,
    max: 1, // فقط یک اتصال برای کاهش فشار
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
  
  pool.on('error', (err) => {
    console.error('⚠️ خطای اتصال دیتابیس:', err.message);
  });

  const logoBuf = await readFile(path.resolve(ROOT, LOGO_PATH));
  const trimmedLogoBuf = await sharp(logoBuf).trim({ threshold: 10 }).toBuffer();
  const trimmedMeta = await sharp(trimmedLogoBuf).metadata();

  console.log("═══════════════════════════════════════════");
  console.log("🎨 KAW CAMP — Overlay لوگو");
  console.log("═══════════════════════════════════════════");
  console.log("حالت:", RUN ? "🔴 اجرای واقعی" : "🟢 Dry-run");
  console.log("");

  const { data: folders } = await supabase.storage.from("products").list("rivancamp", { limit: 1000 });
  if (!folders) { console.log("❌ هیچ پوشه‌ای پیدا نشد"); return; }

  const sortedFolders = folders
    .filter(f => !f.name.includes("."))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const targetFolders = sortedFolders.slice(START_OFFSET, START_OFFSET + LIMIT);

  console.log(`📁 پردازش ${targetFolders.length} پوشه...\n`);

  let totalImages = 0;
  let processedImages = 0;
  let failedImages = 0;

  for (let i = 0; i < targetFolders.length; i++) {
    const folder = targetFolders[i];
    const folderPath = `rivancamp/${folder.name}`;
    const { data: files } = await supabase.storage.from("products").list(folderPath, { limit: 100 });
    const imageFiles = (files || []).filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name));

    if (imageFiles.length === 0) continue;

    // خواندن محصول از PostgreSQL
    let product;
    try {
      const { rows } = await pool.query("SELECT id, image, images FROM products WHERE id = $1", [folder.name]);
      if (rows.length === 0) {
        console.log(`[${i + 1}/${targetFolders.length}] ⏭  ${folder.name} (در دیتابیس نیست)`);
        continue;
      }
      product = rows[0];
    } catch (dbErr) {
      console.log(`[${i + 1}/${targetFolders.length}] ❌ خطای دیتابیس برای ${folder.name}: ${dbErr.message}`);
      continue;
    }

    const currentImages = product.images || [];
    const updatedImages = [...currentImages];
    let mainImage = product.image;

    console.log(`\n[${i + 1}/${targetFolders.length}] 📁 ${folder.name}`);

    for (let imgIdx = 0; imgIdx < imageFiles.length; imgIdx++) {
      const file = imageFiles[imgIdx];
      const oldFilePath = `${folderPath}/${file.name}`;
      const ext = file.name.split(".").pop() || "webp";
      const newFileName = `${imgIdx}-${Date.now()}.${ext}`;
      const newFilePath = `${folderPath}/${newFileName}`;

      const { bar, percent } = progressBar(imgIdx + 1, imageFiles.length);
      process.stdout.write(`\r   🎨 [${bar}] ${percent}% (${imgIdx + 1}/${imageFiles.length})`);

      totalImages++;

      try {
        const { data: urlData } = supabase.storage.from("products").getPublicUrl(oldFilePath);
        const res = await fetch(urlData.publicUrl);
        const imgBuf = Buffer.from(await res.arrayBuffer());
        const img = sharp(imgBuf);
        const meta = await img.metadata();

        const logoWidth = Math.round((meta.width * LOGO_SIZE_PERCENT) / 100);
        const logoHeight = Math.round(logoWidth * (trimmedMeta.height / trimmedMeta.width));
        const resizedLogo = await sharp(trimmedLogoBuf).resize(logoWidth, logoHeight).toBuffer();

        const top = Math.max(0, meta.height - logoHeight - OFFSET_Y);
        const left = Math.max(0, meta.width - logoWidth - OFFSET_X);

        const bgTop = Math.max(0, top - 45);
        const bgLeft = Math.max(0, left - 15);
        const whiteBg = await sharp({
          create: { width: logoWidth + 30, height: logoHeight + 55, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
        }).png().toBuffer();

        if (!RUN) { processedImages++; continue; }

        const output = await img.composite([
          { input: whiteBg, top: bgTop, left: bgLeft },
          { input: resizedLogo, top, left },
        ]).toBuffer();

        await supabase.storage.from("products").upload(newFilePath, output, { upsert: false, contentType: `image/${meta.format || ext}` });
        const { data: newUrlData } = supabase.storage.from("products").getPublicUrl(newFilePath);

        const oldUrl = urlData.publicUrl;
        const newUrl = newUrlData.publicUrl;
        for (let k = 0; k < updatedImages.length; k++) {
          if (updatedImages[k] === oldUrl) updatedImages[k] = newUrl;
        }
        if (mainImage === oldUrl) mainImage = newUrl;

        await supabase.storage.from("products").remove([oldFilePath]);
        processedImages++;
      } catch (err) {
        failedImages++;
      }
    }

    // 🆕 آپدیت دیتابیس PostgreSQL با try/catch
    if (RUN) {
      try {
        await pool.query(
          "UPDATE products SET image = $1, images = $2, updated_at = NOW() WHERE id = $3",
          [mainImage, JSON.stringify(updatedImages), folder.name]
        );
        process.stdout.write(`\r${" ".repeat(70)}\r`);
        console.log(`   ✅ ${imageFiles.length} عکس (دیتابیس آپدیت شد)`);
      } catch (dbErr) {
        process.stdout.write(`\r${" ".repeat(70)}\r`);
        console.log(`   ⚠️ عکس‌ها ذخیره شد ولی دیتابیس آپدیت نشد: ${dbErr.message}`);
      }
    }
  }

  try {
    await pool.end();
  } catch (e) { /* ignore */ }

  console.log("\n═══════════════════════════════════════════");
  console.log("📊 خلاصه نهایی");
  console.log("═══════════════════════════════════════════");
  console.log(`📷 کل عکس‌ها: ${totalImages}`);
  console.log(`✅ پردازش: ${processedImages}`);
  console.log(`❌ خطا: ${failedImages}`);
  console.log("");
}

main().catch(console.error);