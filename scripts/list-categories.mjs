// نمایش همهٔ slugهای دسته‌بندی‌های ریوان
async function main() {
  const map = {};
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://rivancamp.com/wp-json/wp/v2/product_cat?per_page=100&page=${page}&_fields=id,name,slug,count,parent`,
      { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } }
    );
    if (!res.ok) break;
    const data = await res.json();
    if (!data.length) break;
    for (const c of data) map[c.id] = c;
    if (data.length < 100) break;
    page++;
  }

  // فقط دسته‌هایی که parent=0 (ریشه) یا count>0
  const all = Object.values(map);
  console.log(`\n📊 ${all.length} دسته\n`);

  // گروه‌بندی بر اساس parent
  const byParent = {};
  for (const c of all) {
    const p = c.parent || 0;
    if (!byParent[p]) byParent[p] = [];
    byParent[p].push(c);
  }

  // چاپ درخت
  function printTree(parentId, depth = 0) {
    const children = byParent[parentId] || [];
    children.sort((a, b) => b.count - a.count);
    for (const c of children) {
      const indent = "  ".repeat(depth);
      console.log(
        `${indent}[${c.id}] "${c.slug}" — ${c.name} (${c.count} محصول)`
      );
      printTree(c.id, depth + 1);
    }
  }

  console.log("═══════════════════════════════════════════");
  console.log("دسته‌های ریوان (توسط والد)");
  console.log("═══════════════════════════════════════════");
  printTree(0);
}

main().catch(console.error);