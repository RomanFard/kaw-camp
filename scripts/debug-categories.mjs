// بررسی دقیق ساختار categories در محصول تکی
import { writeFile } from "node:fs/promises";

async function main() {
  // ۱. یه محصول از لیست بگیر
  const listRes = await fetch(
    "https://rivancamp.com/wp-json/wc/store/v1/products?per_page=3",
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    }
  );
  const list = await listRes.json();
  console.log("📋 لیست:");
  list.forEach((p) => {
    console.log(`   id=${p.id} | ${p.name}`);
    console.log(`   categories (در لیست):`, JSON.stringify(p.categories));
    console.log(`   tags (در لیست):`, JSON.stringify(p.tags?.slice(0, 2)));
    console.log(`   brands (در لیست):`, JSON.stringify(p.brands));
  });

  // ۲. یه محصول رو تکی بگیر و کامل ذخیره کن
  const firstId = list[0].id;
  console.log(`\n📦 محصول تکی id=${firstId}:`);
  const singleRes = await fetch(
    `https://rivancamp.com/wp-json/wc/store/v1/products/${firstId}`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    }
  );
  const single = await singleRes.json();

  console.log("\n🔑 همهٔ keys:");
  console.log(Object.keys(single).join("\n"));

  console.log("\n📂 categories:");
  console.log(JSON.stringify(single.categories, null, 2));

  console.log("\n🏷 brands:");
  console.log(JSON.stringify(single.brands, null, 2));

  console.log("\n🏷 tags:");
  console.log(JSON.stringify(single.tags, null, 2));

  console.log("\n📐 attributes (اولین ۳):");
  console.log(JSON.stringify(single.attributes?.slice(0, 3), null, 2));

  // ذخیره کامل برای بررسی
  await writeFile(
    "scripts/debug-single.json",
    JSON.stringify(single, null, 2),
    "utf8"
  );
  console.log("\n💾 ذخیره شد: scripts/debug-single.json");

  // جستجو توی همهٔ کلیدها برای کلمهٔ کلیدی
  console.log("\n🔎 جستجو برای «تگ» یا «دسته»:");
  for (const [key, value] of Object.entries(single)) {
    const str = JSON.stringify(value);
    if (
      str.includes("دسته") ||
      str.includes("categor") ||
      str.includes("تگ") ||
      str.includes("tag")
    ) {
      console.log(`   ✅ کلید «${key}»:`, JSON.stringify(value).slice(0, 200));
    }
  }
}

main().catch(console.error);