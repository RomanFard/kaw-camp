// ═══════════════════════════════════════════
// تشخیص: permalink + WP REST API
// ═══════════════════════════════════════════
async function main() {
  // محصول اول رو بگیر
  const listRes = await fetch(
    "https://rivancamp.com/wp-json/wc/store/v1/products?per_page=1",
    {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
    }
  );
  const list = await listRes.json();
  const first = list[0];

  console.log("═══════════════════════════════════════════");
  console.log("۱. permalink محصول:");
  console.log("   ", first.permalink);

  console.log("\n═══════════════════════════════════════════");
  console.log("۲. WP REST API (wp/v2/product):");
  try {
    const wpRes = await fetch(
      `https://rivancamp.com/wp-json/wp/v2/product/${first.id}?_fields=id,product_cat,product_tag,title,link`,
      {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
      }
    );
    console.log("   Status:", wpRes.status);
    if (wpRes.ok) {
      const wpData = await wpRes.json();
      console.log("   محصول:", JSON.stringify(wpData, null, 2));
    } else {
      const err = await wpRes.text();
      console.log("   ❌ خطا:", err.slice(0, 200));
    }
  } catch (e) {
    console.log("   ❌ خطا:", e.message);
  }

  console.log("\n═══════════════════════════════════════════");
  console.log("۳. WP REST API با slug:");
  try {
    const wpRes = await fetch(
      `https://rivancamp.com/wp-json/wp/v2/product?slug=${first.slug}&_fields=id,product_cat,product_tag,link`,
      {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
      }
    );
    console.log("   Status:", wpRes.status);
    if (wpRes.ok) {
      const wpData = await wpRes.json();
      console.log("   نتیجه:", JSON.stringify(wpData, null, 2));
    }
  } catch (e) {
    console.log("   ❌ خطا:", e.message);
  }

  console.log("\n═══════════════════════════════════════════");
  console.log("۴. taxonomy product_cat از WP REST API:");
  try {
    const catRes = await fetch(
      `https://rivancamp.com/wp-json/wp/v2/product_cat?per_page=5&_fields=id,name,slug,count`,
      {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
      }
    );
    console.log("   Status:", catRes.status);
    if (catRes.ok) {
      const cats = await catRes.json();
      console.log("   دسته‌ها:", JSON.stringify(cats, null, 2));
    } else {
      console.log("   ❌ response:", await catRes.text());
    }
  } catch (e) {
    console.log("   ❌ خطا:", e.message);
  }

  console.log("\n═══════════════════════════════════════════");
  console.log("۵. _links محصول (شاید دسته اینجا باشه):");
  console.log(JSON.stringify(first._links, null, 2).slice(0, 1500));

  console.log("\n═══════════════════════════════════════════");
  console.log("۶. extensions محصول:");
  console.log(JSON.stringify(first.extensions, null, 2).slice(0, 1000));

  console.log("\n═══════════════════════════════════════════");
  console.log("۷. attributes کامل (شامل برند؟):");
  console.log(JSON.stringify(first.attributes, null, 2).slice(0, 1500));
}

main().catch(console.error);