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
  const pool = new Pool({ connectionString: env.DATABASE_URL });

  const productId = process.argv[2];
  const imageIndex = parseInt(process.argv[3]);
  if (!productId || isNaN(imageIndex)) {
    console.error("❌ لطفاً آیدی محصول و شماره عکس را وارد کنید: node scripts/repair-single-image.mjs <productId> <imageIndex>");
    process.exit(1);
  }

  console.log(`🔍 شروع تعمیر عکس ${imageIndex} برای محصول ${productId}...`);

  // ۱. دریافت اطلاعات محصول از دیتابیس
  const { rows: products } = await pool.query("SELECT image, images FROM products WHERE id = $1", [productId]);
  if (products.length === 0) {
    console.error("❌ محصول در دیتابیس پیدا نشد.");
    process.exit(1);
  }
  const product = products[0];
  const currentImages = product.images || [];

  // ۲. دریافت اطلاعات محصول از ریوان (برای پیدا کردن URL اصلی عکس)
  console.log("📥 دریافت اطلاعات محصول از ریوان...");
  const rivanRes = await fetch(`https://rivancamp.com/wp-json/wc/store/v1/products/${productId}`);
  if (!rivanRes.ok) {
    console.error(`❌ دریافت اطلاعات از ریوان ناموفق: ${rivanRes.status}`);
    process.exit(1);
  }
  const rivanProduct = await rivanRes.json();
  const rawImages = rivanProduct.images || [];
  if (imageIndex >= rawImages.length) {
    console.error(`❌ عکس با شماره ${imageIndex} در ریوان وجود ندارد.`);
    process.exit(1);
  }

  // ۳. دانلود عکس اصلی از ریوان
  const originalUrl = rawImages[imageIndex].src;
  console.log(`🔗 دانلود از: ${originalUrl}`);
  const imgRes = await fetch(originalUrl);
  if (!imgRes.ok) {
    console.error(`❌ دانلود عکس اصلی ناموفق: ${imgRes.status}`);
    process.exit(1);
  }
  const imgBuf = Buffer.from(await imgRes.arrayBuffer());

  // ۴. پردازش لوگو
  const logoBuf = await readFile(path.resolve(ROOT, "./public/images/logo2.png"));
  const trimmedLogoBuf = await sharp(logoBuf).trim({ threshold: 10 }).toBuffer();
  const trimmedMeta = await sharp(trimmedLogoBuf).metadata();

  const img = sharp(imgBuf);
  const meta = await img.metadata();
  const logoWidth = Math.round((meta.width * 20) / 100);
  const logoHeight = Math.round(logoWidth * (trimmedMeta.height / trimmedMeta.width));
  const resizedLogo = await sharp(trimmedLogoBuf).resize(logoWidth, logoHeight).toBuffer();

  const top = Math.max(0, meta.height - logoHeight - 60);
  const left = Math.max(0, meta.width - logoWidth - 20);
  const bgTop = Math.max(0, top - 45);
  const bgLeft = Math.max(0, left - 15);
  const whiteBg = await sharp({
    create: { width: logoWidth + 30, height: logoHeight + 55, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  }).png().toBuffer();

  const output = await img.composite([
    { input: whiteBg, top: bgTop, left: bgLeft },
    { input: resizedLogo, top, left },
  ]).toBuffer();

  // ۵. آپلود عکس جدید به Supabase
  const ext = originalUrl.split(".").pop().split("?")[0] || "webp";
  const newFileName = `${imageIndex}-${Date.now()}.${ext}`;
  const newFilePath = `rivancamp/${productId}/${newFileName}`;
  
  console.log("📤 آپلود عکس جدید به Supabase...");
  const { error: uploadError } = await supabase.storage.from("products").upload(newFilePath, output, { upsert: false, contentType: `image/${meta.format || ext}` });
  if (uploadError) {
    console.error(`❌ آپلود ناموفق: ${uploadError.message}`);
    process.exit(1);
  }
  const { data: newUrlData } = supabase.storage.from("products").getPublicUrl(newFilePath);
  const newUrl = newUrlData.publicUrl;
  console.log(`🔗 لینک جدید: ${newUrl}`);

  // ۶. به‌روزرسانی دیتابیس
  const updatedImages = [...currentImages];
  updatedImages[imageIndex] = newUrl;
  const newMainImage = product.image === currentImages[imageIndex] ? newUrl : product.image;
  
  await pool.query(
    "UPDATE products SET image = $1, images = $2, updated_at = NOW() WHERE id = $3",
    [newMainImage, JSON.stringify(updatedImages), productId]
  );

  console.log("✅ عکس با موفقیت تعمیر و دیتابیس به‌روزرسانی شد.");
  await pool.end();
}

main().catch(console.error);