#!/usr/bin/env node
// ═══════════════════════════════════════════
// پوشاندن لوگوی ریوان با لوگوی KAW
// ═══════════════════════════════════════════
// استفاده:
//   node scripts/overlay-logo.mjs --logo=./public/images/logo.png --run
//   node scripts/overlay-logo.mjs --logo=./public/images/logo.png --bg=auto --run
//   node scripts/overlay-logo.mjs --logo=./public/images/logo.png --shape=circle --run
//   node scripts/overlay-logo.mjs --logo=./public/images/logo.png --product=31716 --run

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ═══ CLI ═══
const args = process.argv.slice(2);
const hasFlag = (f) => args.includes(f);
const getArg = (name, def) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split("=").slice(1).join("=") : def;
};

const LOGO_PATH = getArg("logo", "./public/images/logo.png");
const LOGO_SIZE_PERCENT = parseInt(getArg("size", "30")); // اندازه لوگو
const LOGO_PADDING = parseInt(getArg("padding", "14"));
const BG_MODE = getArg("bg", "white"); // white | black | auto | none
const SHAPE = getArg("shape", "circle"); // circle | rect | none
const CIRCLE_SIZE_PERCENT = parseInt(getArg("circle-size", "45")); // اندازه دایره (درصد از عرض عکس)
const RUN = hasFlag("--run");
const ONLY_PRODUCT = getArg("product", "");

console.log("═══════════════════════════════════════════");
console.log("🎨 KAW CAMP — Overlay لوگو");
console.log("═══════════════════════════════════════════");
console.log("حالت:", RUN ? "🔴 اجرای واقعی" : "🟢 Dry-run");
console.log("لوگو:", LOGO_PATH);
console.log("شکل پس‌زمینه:", SHAPE);
if (SHAPE === "circle") console.log("اندازه دایره:", CIRCLE_SIZE_PERCENT, "% عرض عکس");
console.log("اندازه لوگو:", LOGO_SIZE_PERCENT, "% عرض عکس");
console.log("پدینگ:", LOGO_PADDING, "px");
console.log("رنگ پس‌زمینه:", BG_MODE);
if (ONLY_PRODUCT) console.log("فقط محصول:", ONLY_PRODUCT);
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

function getBgColor(mode, sample) {
  if (mode === "white") return { r: 255, g: 255, b: 255, alpha: 1 };
  if (mode === "black") return { r: 0, g: 0, b: 0, alpha: 1 };
  if (mode === "auto" && sample) return sample;
  return null;
}

async function sampleCornerColor(imgBuf) {
  try {
    const { data, info } = await sharp(imgBuf)
      .extract({ left: 5, top: 5, width: 30, height: 30 })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    return {
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count),
      alpha: 1,
    };
  } catch {
    return { r: 255, g: 255, b: 255, alpha: 1 };
  }
}

// 🆕 ساخت دایره
async function createCircle(size, color) {
  const r = Math.round(color.r);
  const g = Math.round(color.g);
  const b = Math.round(color.b);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" 
              fill="rgb(${r},${g},${b})" />
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

// 🆕 ساخت مستطیل
async function createRect(width, height, color) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: color,
    },
  })
    .png()
    .toBuffer();
}

async function main() {
  const logoFullPath = path.resolve(ROOT, LOGO_PATH);
  if (!existsSync(logoFullPath)) {
    throw new Error(`لوگو پیدا نشد: ${logoFullPath}`);
  }
  const logoBuf = await readFile(logoFullPath);
  const logoMeta = await sharp(logoBuf).metadata();
  console.log(
    `📷 لوگو اصلی: ${logoMeta.width}×${logoMeta.height} (${logoMeta.format})`
  );

  const trimmedLogoBuf = await sharp(logoBuf)
    .trim({ threshold: 10 })
    .toBuffer();
  const trimmedMeta = await sharp(trimmedLogoBuf).metadata();
  console.log(
    `✂️  لوگو بعد از trim: ${trimmedMeta.width}×${trimmedMeta.height}`
  );

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

  console.log(`   ${targetFolders.length} محصول برای پردازش`);

  let totalImages = 0;
  let processedImages = 0;
  let failedImages = 0;

  for (let i = 0; i < targetFolders.length; i++) {
    const folder = targetFolders[i];
    const folderPath = `rivancamp/${folder.name}`;
    process.stdout.write(
      `\n[${i + 1}/${targetFolders.length}] 📁 ${folder.name}`
    );

    const { data: files, error: filesErr } = await supabase.storage
      .from("products")
      .list(folderPath, { limit: 100 });

    if (filesErr) {
      console.log(` ❌ لیست نشد: ${filesErr.message}`);
      continue;
    }

    const imageFiles = (files || []).filter((f) =>
      /\.(jpe?g|png|webp)$/i.test(f.name)
    );

    if (imageFiles.length === 0) {
      console.log(` ⏭  بدون عکس`);
      continue;
    }

    totalImages += imageFiles.length;
    process.stdout.write(` → ${imageFiles.length} عکس`);

    for (const file of imageFiles) {
      const filePath = `${folderPath}/${file.name}`;
      try {
        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        const res = await fetch(urlData.publicUrl);
        if (!res.ok) throw new Error(`Download ${res.status}`);
        const imgBuf = Buffer.from(await res.arrayBuffer());

        const img = sharp(imgBuf);
        const meta = await img.metadata();
        const imgWidth = meta.width || 0;
        const imgHeight = meta.height || 0;

        if (imgWidth === 0 || imgHeight === 0) {
          throw new Error("ابعاد عکس نامعتبر");
        }

        if (!RUN) {
          process.stdout.write(".");
          processedImages++;
          continue;
        }

        const composites = [];

        // ═══ ۱. پس‌زمینه (دایره یا مستطیل) ═══
        if (SHAPE !== "none" && BG_MODE !== "none") {
          let bgColor;
          if (BG_MODE === "auto") {
            bgColor = await sampleCornerColor(imgBuf);
          } else {
            bgColor = getBgColor(BG_MODE);
          }

          if (bgColor) {
            if (SHAPE === "circle") {
              // دایره
              const circleSize = Math.round(
                (imgWidth * CIRCLE_SIZE_PERCENT) / 100
              );
              const circleBuf = await createCircle(circleSize, bgColor);

              // موقعیت دایره: گوشه پایین-راست
              const circleLeft = imgWidth - circleSize;
              const circleTop = imgHeight - circleSize;

              composites.push({
                input: circleBuf,
                top: Math.max(0, circleTop),
                left: Math.max(0, circleLeft),
              });
            } else {
              // مستطیل (حالت قبلی)
              const blockWidth = Math.round(imgWidth * 0.5);
              const blockHeight = Math.round(imgHeight * 0.22);
              const blockLeft = imgWidth - blockWidth;
              const blockTop = imgHeight - blockHeight;

              const rectBuf = await createRect(
                blockWidth,
                blockHeight,
                bgColor
              );

              composites.push({
                input: rectBuf,
                top: Math.max(0, blockTop),
                left: Math.max(0, blockLeft),
              });
            }
          }
        }

        // ═══ ۲. KAW logo روی پس‌زمینه ═══
        const logoWidth = Math.round((imgWidth * LOGO_SIZE_PERCENT) / 100);
        const logoAspect = trimmedMeta.height / trimmedMeta.width;
        const logoHeight = Math.round(logoWidth * logoAspect);

        const resizedLogo = await sharp(trimmedLogoBuf)
          .resize(logoWidth, logoHeight, { fit: "fill" })
          .toBuffer();

        const logoLeft = Math.max(0, imgWidth - logoWidth - LOGO_PADDING);
        const logoTop = Math.max(0, imgHeight - logoHeight - LOGO_PADDING);

        composites.push({
          input: resizedLogo,
          top: logoTop,
          left: logoLeft,
        });

        // ═══ Composite نهایی ═══
        const output = await img.composite(composites).toBuffer();

        const { error: upErr } = await supabase.storage
          .from("products")
          .upload(filePath, output, {
            upsert: true,
            contentType: `image/${meta.format || "webp"}`,
          });

        if (upErr) throw upErr;
        process.stdout.write(".");
        processedImages++;
      } catch (e) {
        console.log(`\n   ❌ ${file.name}: ${e.message}`);
        failedImages++;
      }
    }
    console.log("");
  }

  console.log("\n═══════════════════════════════════════════");
  console.log("📊 خلاصه");
  console.log("═══════════════════════════════════════════");
  console.log(`📷 کل عکس‌ها: ${totalImages}`);
  console.log(`✅ پردازش: ${processedImages}`);
  console.log(`❌ خطا: ${failedImages}`);
  console.log("");
  if (!RUN) {
    console.log("⚠️  dry-run بود. برای اجرای واقعی: --run اضافه کن");
  }
}

main().catch((e) => {
  console.error("\n❌ خطا:", e);
  process.exit(1);
});