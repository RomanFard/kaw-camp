#!/usr/bin/env node
// ═══════════════════════════════════════════
// Overlay لوگو با نام فایل یونیک (ضد کش CDN)
// ═══════════════════════════════════════════
// استفاده:
//   node scripts/overlay-unique.mjs --logo=./public/images/logo.png --product=31716 --run

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const hasFlag = (f) => args.includes(f);
const getArg = (name, def) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split("=").slice(1).join("=") : def;
};

const LOGO_PATH = getArg("logo", "./public/images/logo.png");
const LOGO_SIZE_PERCENT = parseInt(getArg("size", "22"));   // کوچیک‌تر
const LOGO_PADDING = parseInt(getArg("padding", "20"));     // فاصله بیشتر از لبه
const BG_MODE = getArg("bg", "white");
const SHAPE = getArg("shape", "circle");
const CIRCLE_SIZE_PERCENT = parseInt(getArg("circle-size", "33")); // کوچیک‌تر
const CIRCLE_OFFSET = parseInt(getArg("circle-offset", "8")); // فاصله از لبه
const RUN = hasFlag("--run");
const ONLY_PRODUCT = getArg("product", "");
const KEEP_OLD = hasFlag("--keep-old");

console.log("═══════════════════════════════════════════");
console.log("🎨 KAW CAMP — Overlay (Unique)");
console.log("═══════════════════════════════════════════");
console.log("حالت:", RUN ? "🔴 اجرای واقعی" : "🟢 Dry-run");
console.log("شکل:", SHAPE);
console.log("اندازه دایره:", CIRCLE_SIZE_PERCENT, "%");
console.log("اندازه لوگو:", LOGO_SIZE_PERCENT, "%");
console.log("پدینگ لوگو:", LOGO_PADDING, "px");
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

function getBgColor(mode) {
  if (mode === "black") return { r: 0, g: 0, b: 0, alpha: 1 };
  return { r: 255, g: 255, b: 255, alpha: 1 };
}

async function createCircle(size, color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" 
              fill="rgb(${color.r},${color.g},${color.b})" />
    </svg>
  `;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  const logoFullPath = path.resolve(ROOT, LOGO_PATH);
  if (!existsSync(logoFullPath)) {
    throw new Error(`لوگو پیدا نشد: ${logoFullPath}`);
  }
  const logoBuf = await readFile(logoFullPath);
  const trimmedLogoBuf = await sharp(logoBuf)
    .trim({ threshold: 10 })
    .toBuffer();
  const trimmedMeta = await sharp(trimmedLogoBuf).metadata();
  console.log(`📷 لوگو: ${trimmedMeta.width}×${trimmedMeta.height}`);

  const env = await loadEnv();
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log("\n📥 لیست محصولات...");
  const { data: folders, error: folderErr } = await supabase.storage
    .from("products")
    .list("rivancamp", { limit: 1000 });

  if (folderErr) throw folderErr;
  if (!folders || folders.length === 0) {
    console.log("❌ هیچ محصولی پیدا نشد");
    return;
  }

  let targetFolders = folders;
  if (ONLY_PRODUCT) {
    targetFolders = folders.filter((f) => f.name === ONLY_PRODUCT);
    if (targetFolders.length === 0) {
      throw new Error(`محصول «${ONLY_PRODUCT}» پیدا نشد`);
    }
  }

  console.log(`   ${targetFolders.length} محصول\n`);

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < targetFolders.length; i++) {
    const folder = targetFolders[i];
    const productId = folder.name;
    const folderPath = `rivancamp/${productId}`;
    process.stdout.write(
      `[${i + 1}/${targetFolders.length}] 📁 ${productId}`
    );

    const { data: files, error: filesErr } = await supabase.storage
      .from("products")
      .list(folderPath, { limit: 100 });

    if (filesErr) {
      console.log(` ❌ ${filesErr.message}`);
      failedCount++;
      continue;
    }

    const imageFiles = (files || [])
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (imageFiles.length === 0) {
      console.log(` ⏭  بدون عکس`);
      continue;
    }

    const newUrls = [];
    const oldFilePaths = [];
    let failed = false;

    for (let idx = 0; idx < imageFiles.length; idx++) {
      const file = imageFiles[idx];
      const oldFilePath = `${folderPath}/${file.name}`;
      const ext = file.name.split(".").pop() || "webp";
      const timestamp = Date.now() + idx;
      const newFileName = `${idx}-${timestamp}.${ext}`;
      const newFilePath = `${folderPath}/${newFileName}`;

      try {
        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(oldFilePath);

        const res = await fetch(urlData.publicUrl);
        if (!res.ok) throw new Error(`Download ${res.status}`);
        const imgBuf = Buffer.from(await res.arrayBuffer());

        const img = sharp(imgBuf);
        const meta = await img.metadata();
        const imgWidth = meta.width || 0;
        const imgHeight = meta.height || 0;

        if (!RUN) {
          newUrls.push(`[DRY] ${newFilePath}`);
          continue;
        }

        const composites = [];

        // ═══ دایره (پایین-راست دقیق) ═══
        if (BG_MODE !== "none" && SHAPE === "circle") {
          const bgColor = getBgColor(BG_MODE);
          const circleSize = Math.round(
            (imgWidth * CIRCLE_SIZE_PERCENT) / 100
          );
          const circleBuf = await createCircle(circleSize, bgColor);

          // 🆕 دایره چسبیده به گوشه پایین-راست
          const circleLeft = imgWidth - circleSize - CIRCLE_OFFSET;
          const circleTop = imgHeight - circleSize - CIRCLE_OFFSET;

          composites.push({
            input: circleBuf,
            top: Math.max(0, circleTop),
            left: Math.max(0, circleLeft),
          });
        }

        // ═══ KAW logo — وسط دایره ═══
        const logoWidth = Math.round((imgWidth * LOGO_SIZE_PERCENT) / 100);
        const logoAspect = trimmedMeta.height / trimmedMeta.width;
        const logoHeight = Math.round(logoWidth * logoAspect);

        const resizedLogo = await sharp(trimmedLogoBuf)
          .resize(logoWidth, logoHeight, { fit: "fill" })
          .toBuffer();

        // موقعیت: لوگو توی مرکز دایره
        const circleSize = Math.round(
          (imgWidth * CIRCLE_SIZE_PERCENT) / 100
        );
        const circleLeft = imgWidth - circleSize - CIRCLE_OFFSET;
        const circleTop = imgHeight - circleSize - CIRCLE_OFFSET;

        const logoLeft = Math.max(
          0,
          circleLeft + (circleSize - logoWidth) / 2
        );
        const logoTop = Math.max(
          0,
          circleTop + (circleSize - logoHeight) / 2
        );

        composites.push({
          input: resizedLogo,
          top: logoTop,
          left: logoLeft,
        });

        const output = await img.composite(composites).toBuffer();

        const { error: upErr } = await supabase.storage
          .from("products")
          .upload(newFilePath, output, {
            upsert: false,
            contentType: `image/${meta.format || "webp"}`,
          });

        if (upErr) throw upErr;

        const { data: newUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(newFilePath);

        newUrls.push(newUrlData.publicUrl);
        oldFilePaths.push(oldFilePath);
      } catch (e) {
        console.log(`\n   ❌ ${file.name}: ${e.message}`);
        failed = true;
        break;
      }
    }

    if (failed) {
      console.log(` ❌`);
      failedCount++;
      continue;
    }

    if (!RUN) {
      console.log(` → ${imageFiles.length} عکس (dry-run)`);
      successCount++;
      continue;
    }

    const { error: dbErr } = await supabase
      .from("products")
      .update({
        image: newUrls[0],
        images: newUrls,
      })
      .eq("id", productId);

    if (dbErr) {
      console.log(` ❌ DB: ${dbErr.message}`);
      failedCount++;
      continue;
    }

    if (!KEEP_OLD && oldFilePaths.length > 0) {
      await supabase.storage.from("products").remove(oldFilePaths);
    }

    console.log(` ✅`);
    successCount++;
  }

  console.log("\n═══════════════════════════════════════════");
  console.log("📊 خلاصه");
  console.log("═══════════════════════════════════════════");
  console.log(`✅ موفق: ${successCount}`);
  console.log(`❌ خطا: ${failedCount}`);
  console.log("");
  if (!RUN) console.log("⚠️  dry-run. برای اجرای واقعی: --run");
  else console.log("💡 Ctrl+Shift+R توی مرورگر بزن");
}

main().catch((e) => {
  console.error("\n❌ خطا:", e);
  process.exit(1);
});