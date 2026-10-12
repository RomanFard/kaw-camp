import { writeFile } from "node:fs/promises";

const BASE = "https://rivancamp.com/wp-json/wc/store/v1";

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
    });
    if (!res.ok) return { error: `${res.status} ${res.statusText}` };
    return { data: await res.json() };
  } catch (e) {
    return { error: e.message };
  }
}

async function main() {
  // ۱. محصول تکی (id=1 حدس، احتمالاً اولین محصول)
  console.log("\n═══ ۱. محصول تکی (id از نمونه قبلی) ═══");
  const sampleRes = await fetchJson(`${BASE}/products?per_page=1`);
  if (sampleRes.error) {
    console.log("❌", sampleRes.error);
  } else {
    const firstId = sampleRes.data[0].id;
    console.log(`نمونه id: ${firstId}`);

    const single = await fetchJson(`${BASE}/products/${firstId}`);
    if (single.error) {
      console.log("❌ تکی:", single.error);
    } else {
      const p = single.data;
      console.log("نام:", p.name);
      console.log("دسته‌ها:", JSON.stringify(p.categories, null, 2));
      console.log("برندها:", JSON.stringify(p.brands, null, 2));
      console.log("attributes:", JSON.stringify(p.attributes, null, 2));
      console.log("weight:", p.weight, "dimensions:", p.dimensions);

      await writeFile(
        "scripts/rivancamp-single.json",
        JSON.stringify(p, null, 2),
        "utf8"
      );
      console.log("💾 ذخیره شد: scripts/rivancamp-single.json");
    }
  }

  // ۲. لیست دسته‌بندی‌ها
  console.log("\n═══ ۲. دسته‌بندی‌ها ═══");
  const cats = await fetchJson(`${BASE}/products/categories?per_page=100`);
  if (cats.error) {
    console.log("❌", cats.error);
  } else {
    console.log(`تعداد: ${cats.data.length}`);
    cats.data.slice(0, 30).forEach((c) => {
      console.log(`  [${c.id}] ${c.name} (${c.slug}) — ${c.count} محصول`);
    });
    await writeFile(
      "scripts/rivancamp-categories.json",
      JSON.stringify(cats.data, null, 2),
      "utf8"
    );
    console.log("💾 ذخیره شد: scripts/rivancamp-categories.json");
  }

  // ۳. لیست برندها
  console.log("\n═══ ۳. برندها ═══");
  const brands = await fetchJson(`${BASE}/products/brands?per_page=100`);
  if (brands.error) {
    console.log("❌", brands.error);
  } else {
    console.log(`تعداد: ${brands.data.length}`);
    brands.data.slice(0, 30).forEach((b) => {
      console.log(`  [${b.id}] ${b.name} (${b.slug}) — ${b.count} محصول`);
    });
    await writeFile(
      "scripts/rivancamp-brands.json",
      JSON.stringify(brands.data, null, 2),
      "utf8"
    );
    console.log("💾 ذخیره شد: scripts/rivancamp-brands.json");
  }

  // ۴. تعداد کل محصولات
  console.log("\n═══ ۴. آمار کلی ═══");
  const all = await fetchJson(`${BASE}/products?per_page=1`);
  if (!all.error) {
    // از هدرها باید count رو بگیریم — ولی fetch ساده دسترسی به هدر نمی‌ده
    // به جای اون، یه درخواست بزرگ می‌زنیم
    const big = await fetchJson(`${BASE}/products?per_page=100&page=1`);
    if (!big.error) {
      console.log(`صفحه اول: ${big.data.length} محصول`);
    }
  }
}

main().catch(console.error);