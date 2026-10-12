import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

async function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
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
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // محصولاتی که از ریوان اومدن (id > 30000)
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image, images")
    .gt("id", "30000")
    .order("id", { ascending: true });

  if (error) {
    console.log("❌ خطا:", error.message);
    return;
  }

  console.log(`\n📦 ${products.length} محصول از ریوان\n`);

  for (const p of products) {
    console.log("═══════════════════════════════════════════");
    console.log(`id: ${p.id}`);
    console.log(`name: ${p.name}`);
    console.log(`image (اصلی): ${p.image}`);
    console.log(`images (گالری):`);
    if (Array.isArray(p.images)) {
      p.images.forEach((img, i) => console.log(`  ${i + 1}. ${img}`));
    } else {
      console.log("  (ندارد)");
    }

    // مقایسه با ریوان
    try {
      const res = await fetch(
        `https://rivancamp.com/wp-json/wc/store/v1/products/${p.id}`,
        { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } }
      );
      if (res.ok) {
        const rp = await res.json();
        console.log(`\n🌐 ریوان (${rp.images?.length || 0} عکس):`);
        (rp.images || []).slice(0, 5).forEach((img, i) => {
          console.log(`  ${i + 1}. ${img.src}`);
        });
      }
    } catch (e) {
      console.log("⚠️  ریوان fetch نشد:", e.message);
    }
    console.log("");
  }
}

main().catch(console.error);