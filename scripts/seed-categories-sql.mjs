// מייצר את קובץ ה-INSERT של הקטגוריות ל-Postgres מתוך אותו JSON שמזין את האתר.
// הרצה: node scripts/seed-categories-sql.mjs > supabase/migrations/0002_seed_categories.sql
import { readFileSync } from "node:fs";

const tree = JSON.parse(readFileSync("src/data/seed/categories.json", "utf8"));
const quote = (value) => `'${String(value).replace(/'/g, "''")}'`;

const lines = ["-- נוצר אוטומטית מ-src/data/seed/categories.json – אין לערוך ידנית", ""];

tree.forEach((parent, parentIndex) => {
  lines.push(
    `insert into categories (parent_id, slug, name, icon, position, path) values ` +
      `(null, ${quote(parent.slug)}, ${quote(parent.name)}, ${quote(parent.icon)}, ${parentIndex}, ${quote(parent.slug)})`,
    `on conflict (path) do update set name = excluded.name, icon = excluded.icon, position = excluded.position;`,
    "",
  );
  parent.children.forEach((child, childIndex) => {
    const path = `${parent.slug}/${child.slug}`;
    lines.push(
      `insert into categories (parent_id, slug, name, icon, position, path) values ` +
        `((select id from categories where path = ${quote(parent.slug)}), ${quote(child.slug)}, ` +
        `${quote(child.name)}, ${quote(parent.icon)}, ${childIndex}, ${quote(path)})`,
      `on conflict (path) do update set name = excluded.name, position = excluded.position;`,
      "",
    );
  });
});

process.stdout.write(lines.join("\n"));
