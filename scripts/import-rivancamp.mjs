#!/usr/bin/env node
// ═══════════════════════════════════════════
// Import از ریوان به دیتابیس پستگرس (Neon) + آپلود عکس در Supabase
// ═══════════════════════════════════════════
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
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

const RUN = hasFlag("--run");
const LIMIT = parseInt(getArg("limit", "100"));
const START_OFFSET = parseInt(getArg("start", "0"));
const MAX_IMAGES = parseInt(getArg("max-images", "5"));
const SKIP_IMAGES = hasFlag("--skip-images");
const SKIP_BRANDS = hasFlag("--skip-brands");

console.log("═══════════════════════════════════════════");
console.log("🚀 KAW CAMP — Import به PostgreSQL (Neon)");
console.log("═══════════════════════════════════════════");
console.log("حالت:", RUN ? "🔴 اجرای واقعی" : "🟢 Dry-run");
console.log("تعداد:", LIMIT);
if (START_OFFSET > 0) console.log("شروع از محصول شماره:", START_OFFSET + 1);
console.log("");

const CATEGORY_MAP = {
  "tent": "tent", "camping-tent": "tent", "naturehike-tent": "tent",
  "mountaineering-tent": "tent", "automatic-tent": "tent",
  "inflatable-tent": "tent", "travel-awning": "tent",
  "pekynew-tent": "tent", "kingcamp": "tent", "chanodug": "tent",
  "camp-light": "lighting", "flashlight": "lighting",
  "small-sun-flashlight": "lighting", "naturehike-flashlight": "lighting",
  "zingaro-flashlight": "lighting", "uv-flashlight": "lighting",
  "tent-lights": "lighting", "lantern": "lighting",
  "naturehike-light": "lighting", "headlamp": "lighting",
  "cooking": "cooking", "travel-stove": "cooking",
  "naturehike-camping-stove": "cooking", "brs1": "cooking",
  "flame-head": "cooking", "brs": "cooking",
  "wood-burning-stove": "cooking", "naturehike": "cooking",
  "barbecue": "cooking", "dishes": "cooking",
  "sleep-essentials": "sleep", "sleeping-bag": "sleep",
  "naturehike-sleeping-bag": "sleep", "air-pillow": "sleep",
  "camping-bed": "sleep", "blanket": "sleep", "neck-pillow": "sleep",
  "underlay": "mattress", "air-mattress": "mattress",
  "naturehike-mattress": "mattress", "chanodug2": "mattress",
  "travel-mat": "mattress", "naturehike-mat": "mattress",
  "tent-floor": "mattress", "sleeping-bag-liner": "mattress",
  "camping-table-and-chairs": "table", "camping-table": "table",
  "naturhike": "table", "chanodug1": "table",
  "camping-chair": "table", "naturehike-camping-chair": "table",
  "inflatable-sofa": "table",
  "travel-equipment": "tools", "power-station": "tools",
  "toolbox": "tools", "coolbox": "tools", "jetfan": "tools",
  "camping-trolley": "tools", "climbing-baton": "tools",
  "backpack": "backpack", "hiking-backpack": "backpack",
  "camping-bag": "backpack", "travel-backpack": "backpack",
  "tactical-backpack": "backpack",
  "clothing": "clothing", "jackets": "clothing",
  "shoes": "shoes",
  "mug": "bottle",
};

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

function htmlToText(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanBrandName(name) {
  return (name || "").replace(/\s*\([^)]*\)\s*$/, "").replace(/^[a-zA-Z\s|]+/, "").trim() || name.trim();
}

function extractBrand(attributes) {
  if (!Array.isArray(attributes)) return null;
  const brandAttr = attributes.find((a) => a.name === "برند" || a.taxonomy === "pa_brand");
  if (!brandAttr || !brandAttr.terms?.length) return null;
  return brandAttr.terms[0].name;
}

function attributesToSpecs(attributes) {
  if (!Array.isArray(attributes)) return [];
  return attributes
    .filter((a) => a.name !== "برند" && a.taxonomy !== "pa_brand")
    .map((a) => ({
      label: (a.name || "").trim(),
      value: (a.terms || []).map((t) => t.name).filter(Boolean).join(" / "),
    }))
    .filter((s) => s.label && s.value);
}

async function fetchJson(url, label = "") {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } });
    if (!res.ok) { console.log(`   ❌ ${label} ${res.status}`); return null; }
    return res.json();
  } catch (e) { console.log(`   ❌ ${label} ${e.message}`); return null; }
}

async function fetchAllCategories() {
  const map = {}; let page = 1;
  while (true) {
    const data = await fetchJson(`https://rivancamp.com/wp-json/wp/v2/product_cat?per_page=100&page=${page}&_fields=id,name,slug,parent,count`);
    if (!data || data.length === 0) break;
    for (const c of data) map[c.id] = { name: c.name, slug: c.slug, parent: c.parent };
    if (data.length < 100) break; page++;
  }
  return map;
}

async function fetchProductCatIds(limit, offset = 0) {
  const map = {}; let page = Math.floor(offset / 100) + 1;
  let skipInFirstPage = offset - (page - 1) * 100;
  let isFirstPage = true; let fetchedGlobal = 0; let collected = 0;
  while (collected < limit) {
    const data = await fetchJson(`https://rivancamp.com/wp-json/wp/v2/product?per_page=100&page=${page}&_fields=id,product_cat`);
    if (!data || data.length === 0) break;
    for (const p of data) {
      fetchedGlobal++;
      if (isFirstPage && fetchedGlobal <= skipInFirstPage) continue;
      if (collected >= limit) break;
      map[p.id] = p.product_cat || []; collected++;
    }
    isFirstPage = false; if (data.length < 100) break; page++;
  }
  return map;
}

async function fetchStoreProducts(limit, offset = 0) {
  const list = []; let page = Math.floor(offset / 100) + 1;
  let skipInFirstPage = offset - (page - 1) * 100;
  let isFirstPage = true; let fetchedGlobal = 0;
  while (list.length < limit) {
    const data = await fetchJson(`https://rivancamp.com/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
    if (!data || data.length === 0) break;
    for (const p of data) {
      fetchedGlobal++;
      if (isFirstPage && fetchedGlobal <= skipInFirstPage) continue;
      if (list.length >= limit) break;
      list.push(p);
    }
    isFirstPage = false; if (data.length < 100) break; page++;
  }
  return list;
}

async function downloadImage(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const extMatch = url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
  const contentType = res.headers.get("content-type") || `image/${ext === "jpg" ? "jpeg" : ext}`;
  return { buf, ext, contentType };
}

async function main() {
  const env = await loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  const pool = new Pool({ 
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });

  pool.on('error', (err) => {
    console.error('⚠️ خطای شبکه دیتابیس:', err.message);
  });

  console.log("📥 خواندن برندها و محصولات موجود از PostgreSQL...");
  const { rows: existingBrands } = await pool.query("SELECT name, order_index FROM brands");
  const brandSet = new Set(existingBrands.map((b) => b.name.toLowerCase().trim()));
  let maxBrandOrder = existingBrands.reduce((m, b) => Math.max(m, b.order_index || 0), 0);

  const { rows: existingProducts } = await pool.query("SELECT id, slug FROM products");
  const slugSet = new Set(existingProducts.map((p) => p.slug));
  const idSet = new Set(existingProducts.map((p) => p.id));
  console.log(`   ${existingBrands.length} برند | ${existingProducts.length} محصول موجود\n`);

  console.log("📥 دریافت اطلاعات از ریوان...");
  const catMap = await fetchAllCategories();
  const productCatMap = await fetchProductCatIds(LIMIT, START_OFFSET);
  const allRivan = await fetchStoreProducts(LIMIT, START_OFFSET);

  console.log(`\n🚀 شروع پردازش ${allRivan.length} محصول...\n`);
  let inserted = 0; let skipped = 0; let failed = 0;
  const newBrands = [];

  for (let i = 0; i < allRivan.length; i++) {
    const rp = allRivan[i];
    const num = `${i + 1}/${allRivan.length}`;
    const shortName = rp.name.length > 45 ? rp.name.slice(0, 45) + "…" : rp.name;

    try {
      const localId = String(rp.id);

      // 🆕 چک کردن تکراری بودن (این بخش قبلاً جا افتاده بود)
      if (slugSet.has(rp.slug) || idSet.has(localId)) {
        skipped++; 
        continue;
      }

      // 🆕 رد کردن محصولات ناموجود
      if (rp.is_in_stock === false) {
        console.log(`  [${num}] ⏭ ناموجود: ${shortName}`);
        skipped++; continue;
      }

      const catIds = productCatMap[rp.id] || [];
      const catSlugs = catIds.map((id) => catMap[id]?.slug).filter(Boolean);
      let kawCat = null;
      for (const slug of catSlugs) { if (CATEGORY_MAP[slug]) { kawCat = CATEGORY_MAP[slug]; break; } }
      if (!kawCat) { skipped++; continue; }

      const rawBrand = extractBrand(rp.attributes);
      const brandName = rawBrand ? cleanBrandName(rawBrand) : "";
      if (brandName && !SKIP_BRANDS && !brandSet.has(brandName.toLowerCase())) {
        newBrands.push({ name: brandName }); brandSet.add(brandName.toLowerCase());
      }

      const rawImages = (rp.images || []).slice(0, MAX_IMAGES);
      const uploadedUrls = [];

      if (!SKIP_IMAGES && rawImages.length > 0) {
        for (let imgIdx = 0; imgIdx < rawImages.length; imgIdx++) {
          try {
            const { buf, ext, contentType } = await downloadImage(rawImages[imgIdx].src);
            const filePath = `rivancamp/${localId}/${imgIdx}.${ext}`;
            const { error } = await supabase.storage.from("products").upload(filePath, buf, { contentType, upsert: true });
            if (!error) uploadedUrls.push(supabase.storage.from("products").getPublicUrl(filePath).data.publicUrl);
          } catch (imgErr) { /* skip image */ }
        }
      }

      const price = Math.round(Number(rp.prices?.price || 0));
      const oldPrice = Number(rp.prices?.regular_price) > price ? Math.round(Number(rp.prices.regular_price)) : null;

      if (!RUN) {
        console.log(`  [${num}] 🟢 ${shortName}`);
        inserted++; continue;
      }

      const sql = `
        INSERT INTO products (
          id, name, slug, price, old_price, cost_price, category, image, images, 
          rating, reviews, in_stock, short_desc, description, features, brand, 
          english_name, colors, sizes, capacities, specs
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      `;
      const values = [
        localId, rp.name, rp.slug, price, oldPrice, 0, kawCat, uploadedUrls[0] || "", JSON.stringify(uploadedUrls),
        Number(rp.average_rating || 0) || 0, Number(rp.review_count || 0) || 0, rp.is_in_stock !== false,
        htmlToText(rp.short_description), htmlToText(rp.description), JSON.stringify([]), brandName || null,
        null, null, null, null, JSON.stringify(attributesToSpecs(rp.attributes))
      ];
      
      try {
        await pool.query(sql, values);
        console.log(`  [${num}] ✅ ${shortName} → ${kawCat}`);
        inserted++; slugSet.add(rp.slug); idSet.add(localId);
      } catch (dbErr) {
        console.log(`  [${num}] ❌ خطای دیتابیس برای ${shortName}: ${dbErr.message}`);
        failed++;
      }
    } catch (e) {
      console.log(`  [${num}] ❌ ${shortName}: ${e.message}`);
      failed++;
    }
  }

  if (!SKIP_BRANDS && newBrands.length > 0 && RUN) {
    console.log(`\n🏷 درج ${newBrands.length} برند جدید...`);
    for (const b of newBrands) {
      maxBrandOrder++;
      try {
        await pool.query(
          `INSERT INTO brands (name, logo, href, order_index, is_active) VALUES ($1, $2, $3, $4, $5)`,
          [b.name, "", `/products?brand=${b.name}`, maxBrandOrder, true]
        );
        console.log(`   ✅ ${b.name}`);
      } catch (bErr) {
         console.log(`   ❌ خطا در درج برند ${b.name}: ${bErr.message}`);
      }
    }
  }

  await pool.end();
  console.log("\n═══════════════════════════════════════════");
  console.log("📊 خلاصه: ✅ " + inserted + " | ⏭ " + skipped + " | ❌ " + failed);
}

main().catch((e) => { console.error(e); process.exit(1); });