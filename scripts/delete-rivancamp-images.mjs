#!/usr/bin/env node
// حذف تمام تصاویر پوشه rivancamp از Storage (با Storage API)

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const BUCKET = "products";
  const ROOT_FOLDER = "rivancamp";

  console.log(`📂 در حال پاک‌سازی پوشه "${ROOT_FOLDER}" از باکت "${BUCKET}"...`);

  // ۱. لیست پوشه‌های سطح اول (شناسه محصولات)
  const { data: folders, error: foldersErr } = await supabase.storage
    .from(BUCKET)
    .list(ROOT_FOLDER, { limit: 1000 });

  if (foldersErr) throw foldersErr;
  if (!folders || folders.length === 0) {
    console.log("✅ پوشه خالی است.");
    return;
  }

  const productFolders = folders.filter((f) => !f.name.includes("."));
  console.log(`📁 ${productFolders.length} پوشه محصول پیدا شد.`);

  let totalDeleted = 0;

  // ۲. برای هر پوشه محصول، فایل‌های داخلش را لیست و حذف کن
  for (const folder of productFolders) {
    const prefix = `${ROOT_FOLDER}/${folder.name}`;
    const { data: files, error: filesErr } = await supabase.storage
      .from(BUCKET)
      .list(prefix, { limit: 100 });

    if (filesErr) {
      console.error(`❌ خطا در لیست ${prefix}:`, filesErr.message);
      continue;
    }

    if (!files || files.length === 0) {
      console.log(`   ⏭  ${prefix} خالی است.`);
      continue;
    }

    const paths = files.map((f) => `${prefix}/${f.name}`);
    const { error: rmErr } = await supabase.storage.from(BUCKET).remove(paths);

    if (rmErr) {
      console.error(`❌ خطا در حذف ${prefix}:`, rmErr.message);
    } else {
      console.log(`   ✅ ${paths.length} فایل از ${prefix} حذف شد.`);
      totalDeleted += paths.length;
    }
  }

  console.log(`\n🎉 مجموعاً ${totalDeleted} فایل حذف شد.`);
}

main().catch((err) => {
  console.error("❌ خطای کلی:", err);
  process.exit(1);
});