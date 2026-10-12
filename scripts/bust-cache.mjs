#!/usr/bin/env node
// ═══════════════════════════════════════════
// Cache buster — اضافه کردن ?v=timestamp به URLهای rivancamp
// ═══════════════════════════════════════════
// استفاده:
//   node scripts/bust-cache.mjs           → dry-run
//   node scripts/bust-cache.mjs --run     → اجرای واقعی

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const RUN = args.includes("--run");
const TIMESTAMP = Date.now();

console.log("═══════════════════════════════════════════");
console.log("🔄 KAW CAMP — Cache Buster");
console.log("═══════════════════════════════════════════");
console.log("حالت:", RUN ? "🔴 اجرای واقعی" : "🟢 Dry-run");
console.log("Timestamp:", TIMESTAMP);
console.log("");

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

// 🆕 اضافه/جایگزینی ?v= در URL
function addVersion(url, version) {
  if (!url) return url;
  // حذف ?v= قدیمی
  const clean = url.replace(/([?&])v=\d+/g, "$1").replace(/[?&]$/, "");
  // اضافه کردن نسخهٔ جدید
  const sep = clean.includes("?") ? "&" : "?";
  return `${clean}${sep}v=${version}`;
}

async function main() {
  const env = await loadEnv();
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // ─── ۱. لیست محصولات با URL سوپابیس ───
  console.log("📥 خواندن محصولات...");
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image, images")
    .gt("id", "30000")
    .order("id", { ascending: true });

  if (error) throw error;
  console.log(`   ${products.length} محصول پیدا شد\n`);

  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    const shortName = p.name.length > 40 ? p.name.slice(0, 40) + "…" : p.name;

    const newImage = addVersion(p.image, TIMESTAMP);
    const newImages = Array.isArray(p.images)
      ? p.images.map((url) => addVersion(url, TIMESTAMP))
      : null;

    // چک: آیا تغییری هست؟
    const imageChanged = newImage !== p.image;
    const imagesChanged =
      JSON.stringify(newImages) !== JSON.stringify(p.images);

    if (!imageChanged && !imagesChanged) {
      skipped++;
      continue;
    }

    console.log(`  [${p.id}] ${shortName}`);
    if (imageChanged) {
      console.log(`    image: ${p.image?.slice(-40)} → ...v=${TIMESTAMP}`);
    }
    if (imagesChanged && newImages) {
      console.log(`    images: ${newImages.length} URL آپدیت`);
    }

    if (RUN) {
      const { error: upErr } = await supabase
        .from("products")
        .update({
          image: newImage,
          images: newImages,
        })
        .eq("id", p.id);

      if (upErr) {
        console.log(`    ❌ ${upErr.message}`);
      } else {
        updated++;
      }
    } else {
      updated++;
    }
  }

  console.log("\n═══════════════════════════════════════════");
  console.log("📊 خلاصه");
  console.log("═══════════════════════════════════════════");
  console.log(`✅ ${RUN ? "آپدیت شد" : "آپدیت می‌شه"}: ${updated}`);
  console.log(`⏭  رد شده: ${skipped}`);
  console.log("");
  if (!RUN) {
    console.log("⚠️  dry-run بود. برای اجرای واقعی: --run اضافه کن");
  } else {
    console.log("💡 حالا برو توی مرورگر: Ctrl+Shift+R (hard refresh)");
  }
}

main().catch((e) => {
  console.error("\n❌ خطا:", e);
  process.exit(1);
});