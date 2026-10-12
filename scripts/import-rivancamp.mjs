#!/usr/bin/env node
// ═══════════════════════════════════════════
// اسکریپت وارد کردن محصولات از ریوان کمپ به KAW CAMP
// ═══════════════════════════════════════════
// استفاده:
//   node scripts/import-rivancamp.mjs --limit=200                          → ۲۰۰ محصول اول (dry-run)
//   node scripts/import-rivancamp.mjs --limit=200 --run                    → ۲۰۰ محصول اول (واقعی)
//   node scripts/import-rivancamp.mjs --limit=200 --start=200 --run        → ۲۰۰ محصول بعدی (۲۰۱-۴۰۰)
//   node scripts/import-rivancamp.mjs --limit=200 --start=400 --run        → ۲۰۰ محصول بعدی (۴۰۱-۶۰۰)
//   node scripts/import-rivancamp.mjs --product-id=31716 --run             → فقط یه محصول خاص
//
// نکته: --start=N یعنی N محصول اول ریوان رو رد کن و از N+1 شروع کن

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ═══ CLI args ═══
const args = process.argv.slice(2);
const hasFlag = (f) => args.includes(f);
const getArg = (name, def) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split("=").slice(1).join("=") : def;
};

const RUN = hasFlag("--run");
const LIMIT = parseInt(getArg("limit", "100"));
const START_OFFSET = parseInt(getArg("start", "0")); // 🆕
const MAX_IMAGES = parseInt(getArg("max-images", "5"));
const SKIP_IMAGES = hasFlag("--skip-images");
const SKIP_BRANDS = hasFlag("--skip-brands");
const ONLY_PRODUCT_ID = getArg("product-id", "");

console.log("═══════════════════════════════════════════");
console.log("🚀 KAW CAMP — Import از ریوان");
console.log("═══════════════════════════════════════════");
console.log("حالت:", RUN ? "🔴 اجرای واقعی" : "🟢 Dry-run (بدون درج)");
console.log("تعداد:", LIMIT);
if (START_OFFSET > 0) console.log("شروع از محصول شماره:", START_OFFSET + 1);
if (ONLY_PRODUCT_ID) console.log("فقط محصول ID:", ONLY_PRODUCT_ID);
console.log("حداکثر عکس هر محصول:", SKIP_IMAGES ? "بدون عکس" : MAX_IMAGES);
console.log("");

// ═══ مپ دسته‌بندی ═══
const CATEGORY_MAP = {
  // چادر و سایبان
  "tent": "tent", "camping-tent": "tent", "naturehike-tent": "tent",
  "mountaineering-tent": "tent", "automatic-tent": "tent",
  "inflatable-tent": "tent", "travel-awning": "tent",
  "pekynew-tent": "tent", "kingcamp": "tent", "chanodug": "tent",
  // چراغ و روشنایی
  "camp-light": "lighting", "flashlight": "lighting",
  "small-sun-flashlight": "lighting", "naturehike-flashlight": "lighting",
  "zingaro-flashlight": "lighting", "uv-flashlight": "lighting",
  "tent-lights": "lighting", "lantern": "lighting",
  "naturehike-light": "lighting", "headlamp": "lighting",
  // پخت و پز
  "cooking": "cooking", "travel-stove": "cooking",
  "naturehike-camping-stove": "cooking", "brs1": "cooking",
  "flame-head": "cooking", "brs": "cooking",
  "wood-burning-stove": "cooking", "naturehike": "cooking",
  "barbecue": "cooking", "dishes": "cooking",
  // لوازم خواب و شب‌مانی
  "sleep-essentials": "sleep", "sleeping-bag": "sleep",
  "naturehike-sleeping-bag": "sleep", "air-pillow": "sleep",
  "camping-bed": "sleep", "blanket": "sleep", "neck-pillow": "sleep",
  // زیرانداز
  "underlay": "mattress", "air-mattress": "mattress",
  "naturehike-mattress": "mattress", "chanodug2": "mattress",
  "travel-mat": "mattress", "naturehike-mat": "mattress",
  "tent-floor": "mattress", "sleeping-bag-liner": "mattress",
  // میز و صندلی
  "camping-table-and-chairs": "table", "camping-table": "table",
  "naturhike": "table", "chanodug1": "table",
  "camping-chair": "table", "naturehike-camping-chair": "table",
  "inflatable-sofa": "table",
  // تجهیزات و ابزار
  "travel-equipment": "tools", "power-station": "tools",
  "toolbox": "tools", "coolbox": "tools", "jetfan": "tools",
  "camping-trolley": "tools", "climbing-baton": "tools",
  // کیف و کوله‌پشتی
  "backpack": "backpack", "hiking-backpack": "backpack",
  "camping-bag": "backpack", "travel-backpack": "backpack",
  "tactical-backpack": "backpack",
  // پوشاک
  "clothing": "clothing", "jackets": "clothing",
  // کفش
  "shoes": "shoes",
  // لیوان
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

// ═══ Utils ═══
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
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanBrandName(name) {
  return (name || "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .replace(/^[a-zA-Z\s|]+/, "")
    .trim() || name.trim();
}

function extractBrand(attributes) {
  if (!Array.isArray(attributes)) return null;
  const brandAttr = attributes.find(
    (a) => a.name === "برند" || a.taxonomy === "pa_brand"
  );
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
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      console.log(`   ❌ ${label} ${res.status}`);
      return null;
    }
    return res.json();
  } catch (e) {
    console.log(`   ❌ ${label} ${e.message}`);
    return null;
  }
}

// ═══ ۱. دسته‌بندی‌ها ═══
async function fetchAllCategories() {
  console.log("📥 دریافت دسته‌بندی‌ها از WP REST...");
  const map = {};
  let page = 1;
  while (true) {
    const data = await fetchJson(
      `https://rivancamp.com/wp-json/wp/v2/product_cat?per_page=100&page=${page}&_fields=id,name,slug,parent,count`
    );
    if (!data || data.length === 0) break;
    for (const c of data) {
      map[c.id] = { name: c.name, slug: c.slug, parent: c.parent };
    }
    if (data.length < 100) break;
    page++;
  }
  console.log(`   ✅ ${Object.keys(map).length} دسته دریافت شد`);
  return map;
}

// 🆕 ۲. catIds محصولات (با offset)
async function fetchProductCatIds(limit, offset = 0) {
  console.log("📥 دریافت product_cat از WP REST...");
  if (offset > 0) console.log(`   شروع از محصول #${offset + 1}`);

  const map = {};
  let page = Math.floor(offset / 100) + 1;
  let skipInFirstPage = offset - (page - 1) * 100;
  let isFirstPage = true;
  let fetchedGlobal = 0;
  let collected = 0;

  while (collected < limit) {
    const data = await fetchJson(
      `https://rivancamp.com/wp-json/wp/v2/product?per_page=100&page=${page}&_fields=id,product_cat`
    );
    if (!data || data.length === 0) break;

    for (const p of data) {
      fetchedGlobal++;
      if (isFirstPage && fetchedGlobal <= skipInFirstPage) continue;
      if (collected >= limit) break;
      map[p.id] = p.product_cat || [];
      collected++;
    }

    console.log(`   صفحه ${page}: → ${collected}/${limit}`);
    isFirstPage = false;
    if (data.length < 100) break;
    page++;
  }
  console.log(`   ✅ ${collected} محصول با catIds`);
  return map;
}

// 🆕 ۲b. محصول تک
async function fetchSingleProductCatId(id) {
  console.log(`📥 دریافت product_cat برای محصول ${id}...`);
  const data = await fetchJson(
    `https://rivancamp.com/wp-json/wp/v2/product/${id}?_fields=id,product_cat`
  );
  if (!data) return {};
  console.log(`   ✅ دریافت شد (${data.product_cat?.length || 0} دسته)`);
  return { [data.id]: data.product_cat || [] };
}

// 🆕 ۳. محصولات کامل (با offset)
async function fetchStoreProducts(limit, offset = 0) {
  console.log("📥 دریافت جزئیات کامل از Store API...");
  if (offset > 0) console.log(`   شروع از محصول #${offset + 1}`);

  const list = [];
  let page = Math.floor(offset / 100) + 1;
  let skipInFirstPage = offset - (page - 1) * 100;
  let isFirstPage = true;
  let fetchedGlobal = 0;

  while (list.length < limit) {
    const data = await fetchJson(
      `https://rivancamp.com/wp-json/wc/store/v1/products?per_page=100&page=${page}`
    );
    if (!data || data.length === 0) break;

    for (const p of data) {
      fetchedGlobal++;
      if (isFirstPage && fetchedGlobal <= skipInFirstPage) continue;
      if (list.length >= limit) break;
      list.push(p);
    }

    console.log(`   صفحه ${page}: → ${list.length}/${limit}`);
    isFirstPage = false;
    if (data.length < 100) break;
    page++;
  }
  console.log(`   ✅ ${list.length} محصول کامل`);
  return list;
}

// 🆕 ۳b. محصول تک
async function fetchSingleStoreProduct(id) {
  console.log(`📥 دریافت جزئیات محصول ${id} از Store API...`);
  const data = await fetchJson(
    `https://rivancamp.com/wp-json/wc/store/v1/products/${id}`
  );
  if (!data) return [];
  console.log(`   ✅ دریافت شد`);
  return [data];
}

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });
  if (!res.ok) throw new Error(`Image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const extMatch = url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
  const contentType =
    res.headers.get("content-type") || `image/${ext === "jpg" ? "jpeg" : ext}`;
  return { buf, ext, contentType };
}

// ═══ Main ═══
async function main() {
  const env = await loadEnv();
  const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase env پیدا نشد.");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // ۱. برندهای موجود
  console.log("📥 خواندن برندهای موجود از Supabase...");
  const { data: existingBrands } = await supabase
    .from("brands")
    .select("id, name, order_index");
  const brandSet = new Set(
    (existingBrands || []).map((b) => b.name.toLowerCase().trim())
  );
  let maxBrandOrder = (existingBrands || []).reduce(
    (m, b) => Math.max(m, b.order_index || 0),
    0
  );
  console.log(`   ${existingBrands?.length || 0} برند موجود`);

  // ۲. محصولات موجود
  console.log("📥 خواندن محصولات موجود از Supabase...");
  const { data: existingProducts } = await supabase
    .from("products")
    .select("id, slug");
  const slugSet = new Set((existingProducts || []).map((p) => p.slug));
  const idSet = new Set((existingProducts || []).map((p) => p.id));
  console.log(`   ${existingProducts?.length || 0} محصول موجود`);

  console.log("");

  // ۳. دسته‌بندی‌ها
  const catMap = await fetchAllCategories();

  // ۴. catIds
  let productCatMap;
  let allRivan;

  if (ONLY_PRODUCT_ID) {
    productCatMap = await fetchSingleProductCatId(ONLY_PRODUCT_ID);
    console.log("");
    allRivan = await fetchSingleStoreProduct(ONLY_PRODUCT_ID);
  } else {
    productCatMap = await fetchProductCatIds(LIMIT, START_OFFSET);
    console.log("");
    allRivan = await fetchStoreProducts(LIMIT, START_OFFSET);
  }

  // ۶. پردازش
  console.log("\n🚀 شروع پردازش...\n");

  let inserted = 0;
  let skipped = 0;
  let failed = 0;
  const newBrands = [];
  const skippedReasons = { slug: 0, id: 0, category: 0 };

  for (let i = 0; i < allRivan.length; i++) {
    const rp = allRivan[i];
    const num = `${i + 1}/${allRivan.length}`;
    const shortName =
      rp.name.length > 45 ? rp.name.slice(0, 45) + "…" : rp.name;

    try {
      if (slugSet.has(rp.slug)) {
        console.log(`  [${num}] ⏭  ${shortName} (slug تکراری)`);
        skipped++;
        skippedReasons.slug++;
        continue;
      }
      if (idSet.has(String(rp.id))) {
        console.log(`  [${num}] ⏭  ${shortName} (id تکراری)`);
        skipped++;
        skippedReasons.id++;
        continue;
      }

      const catIds = productCatMap[rp.id] || [];
      const catSlugs = catIds.map((id) => catMap[id]?.slug).filter(Boolean);

      let kawCat = null;
      for (const slug of catSlugs) {
        if (CATEGORY_MAP[slug]) {
          kawCat = CATEGORY_MAP[slug];
          break;
        }
      }

      if (!kawCat) {
        console.log(
          `  [${num}] ⚠️  ${shortName} (دسته ناشناخته: ${catSlugs.join(",") || "خالی"})`
        );
        skipped++;
        skippedReasons.category++;
        continue;
      }

      const rawBrand = extractBrand(rp.attributes);
      const brandName = rawBrand ? cleanBrandName(rawBrand) : "";
      const brandToSave = brandName || undefined;

      if (brandName && !SKIP_BRANDS && !brandSet.has(brandName.toLowerCase())) {
        newBrands.push({ name: brandName, slug: rp.slug });
        brandSet.add(brandName.toLowerCase());
      }

      const rawImages = (rp.images || []).slice(0, MAX_IMAGES);
      const uploadedUrls = [];
      const localId = String(rp.id);

      if (SKIP_IMAGES) {
        uploadedUrls.push(...rawImages.map((img) => img.src));
      } else if (rawImages.length > 0) {
        for (let imgIdx = 0; imgIdx < rawImages.length; imgIdx++) {
          const img = rawImages[imgIdx];
          try {
            const { buf, ext, contentType } = await downloadImage(img.src);
            const filePath = `rivancamp/${localId}/${imgIdx}.${ext}`;
            if (RUN) {
              const { error: upErr } = await supabase.storage
                .from("products")
                .upload(filePath, buf, { contentType, upsert: true });
              if (upErr) throw upErr;
              const { data: urlData } = supabase.storage
                .from("products")
                .getPublicUrl(filePath);
              uploadedUrls.push(urlData.publicUrl);
            } else {
              uploadedUrls.push(`[DRY]/${filePath}`);
            }
          } catch (imgErr) {
            console.log(`     ⚠️  عکس ${imgIdx + 1} رد شد: ${imgErr.message}`);
          }
        }
      }

      const priceRaw = Number(rp.prices?.price || 0);
      const regularRaw = Number(rp.prices?.regular_price || 0);
      const price = Math.round(priceRaw);
      const oldPrice =
        regularRaw > 0 && regularRaw !== priceRaw ? Math.round(regularRaw) : null;

      const specs = attributesToSpecs(rp.attributes);

      const row = {
        id: localId,
        name: rp.name || "",
        slug: rp.slug || "",
        price,
        old_price: oldPrice,
        category: kawCat,
        image: uploadedUrls[0] || "",
        images: uploadedUrls.length > 0 ? uploadedUrls : null,
        rating: Number(rp.average_rating || 0) || 0,
        reviews: Number(rp.review_count || 0) || 0,
        in_stock: rp.is_in_stock !== false,
        short_desc: htmlToText(rp.short_description) || "",
        description: htmlToText(rp.description) || "",
        features: [],
        brand: brandToSave ?? null,
        english_name: null,
        colors: null,
        sizes: null,
        capacities: null,
        specs: specs.length > 0 ? specs : null,
        cost_price: 0,
      };

      if (!RUN) {
        console.log(
          `  [${num}] 🟢 ${shortName} → ${kawCat} | ${brandName || "بدون برند"} (${uploadedUrls.length} عکس)`
        );
        inserted++;
        continue;
      }

      const { error: insErr } = await supabase.from("products").insert(row);
      if (insErr) throw insErr;

      console.log(
        `  [${num}] ✅ ${shortName} → ${kawCat} | ${brandName || "-"} (${uploadedUrls.length} عکس)`
      );
      inserted++;
      slugSet.add(rp.slug);
      idSet.add(localId);
    } catch (e) {
      console.log(`  [${num}] ❌ ${shortName}: ${e.message}`);
      failed++;
    }
  }

  // درج برندهای جدید
  if (!SKIP_BRANDS && newBrands.length > 0 && RUN) {
    console.log(`\n🏷  درج ${newBrands.length} برند جدید...`);
    let brandOk = 0;
    for (const b of newBrands) {
      maxBrandOrder++;
      const { error } = await supabase.from("brands").insert({
        name: b.name,
        logo: "",
        href: `/products?brand=${b.slug}`,
        order_index: maxBrandOrder,
        is_active: true,
      });
      if (error) console.log(`   ❌ ${b.name}: ${error.message}`);
      else {
        brandOk++;
        console.log(`   ✅ ${b.name}`);
      }
    }
    console.log(`   → ${brandOk}/${newBrands.length} برند`);
  }

  // خلاصه
  console.log("\n═══════════════════════════════════════════");
  console.log("📊 خلاصه");
  console.log("═══════════════════════════════════════════");
  console.log(`✅ موفق:   ${inserted}`);
  console.log(`⏭  رد شده: ${skipped}`);
  if (skipped > 0) {
    console.log(
      `     (slug: ${skippedReasons.slug} | id: ${skippedReasons.id} | دسته: ${skippedReasons.category})`
    );
  }
  console.log(`❌ خطا:    ${failed}`);
  if (!SKIP_BRANDS) console.log(`🏷  برند جدید: ${newBrands.length}`);
  console.log("");
  if (!RUN) {
    console.log("⚠️  dry-run بود. برای اجرای واقعی: --run اضافه کن");
  } else {
    console.log(`💡 مجموع محصولات در DB: ${(existingProducts?.length || 0) + inserted}`);
  }
}

main().catch((e) => {
  console.error("\n❌ خطا:", e);
  process.exit(1);
});