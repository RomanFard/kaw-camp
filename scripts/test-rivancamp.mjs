// ═══════════════════════════════════════════
// تست API ریوان کمپ — بررسی ساختار داده
// ═══════════════════════════════════════════
import { writeFile } from "node:fs/promises";

// دو تا endpoint ممکنه — اولی رو تست می‌کنیم
const ENDPOINTS = [
  "https://rivancamp.com/wp-json/wc/store/v1/products",
  "https://rivancamp.com/wp-json/wc/store/products",
];

async function tryEndpoint(url) {
  console.log(`\n🔍 تست: ${url}`);
  try {
    const res = await fetch(`${url}?per_page=2`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });

    console.log(`   وضعیت: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const text = await res.text();
      console.log(`   ❌ خطا: ${text.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    console.log(`   ✅ موفق! تعداد: ${Array.isArray(data) ? data.length : "?"}`);
    return data;
  } catch (e) {
    console.log(`   ❌ خطا شبکه: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("🧪 تست API ریوان کمپ");
  console.log("═══════════════════════════════════════");

  let data = null;
  let usedUrl = "";

  for (const url of ENDPOINTS) {
    data = await tryEndpoint(url);
    if (data) {
      usedUrl = url;
      break;
    }
  }

  if (!data) {
    console.log("\n❌ هیچ endpointی جواب نداد.\n");
    process.exit(1);
  }

  console.log(`\n✅ از endpoint استفاده شد: ${usedUrl}`);

  // ذخیره نمونه
  await writeFile(
    "scripts/rivancamp-sample.json",
    JSON.stringify(data, null, 2),
    "utf8"
  );
  console.log("💾 نمونه ذخیره شد: scripts/rivancamp-sample.json");

  // خلاصه
  if (Array.isArray(data) && data.length > 0) {
    const p = data[0];
    console.log("\n📦 ساختار اولین محصول:");
    console.log("   keys:", Object.keys(p).join(", "));
    console.log("   نام:", p.name);
    console.log("   قیمت:", p.prices?.price, p.prices?.currency_symbol);
    console.log("   تعداد عکس:", p.images?.length ?? 0);
    console.log("   دسته‌ها:", (p.categories ?? []).map((c) => c.name).join(" / "));
    console.log("   برندها:", (p.brands ?? []).map((b) => b.name).join(" / "));
  }
}

main().catch((e) => {
  console.error("❌ خطای کلی:", e);
  process.exit(1);
});