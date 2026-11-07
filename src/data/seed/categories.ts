import type { Category } from "@/lib/data/types";
import tree from "./categories.json";

/**
 * עץ הקטגוריות. מקור האמת הוא categories.json — אותו קובץ משמש גם
 * את scripts/seed-categories-sql.mjs שמייצר את ה-INSERT ל-Postgres,
 * כך שאין כפילות בין מצב הדמה למסד הנתונים.
 */
function flatten(): Category[] {
  const out: Category[] = [];
  tree.forEach((parent, parentIndex) => {
    out.push({
      id: parent.slug,
      parentId: null,
      slug: parent.slug,
      name: parent.name,
      icon: parent.icon,
      order: parentIndex,
      path: parent.slug,
    });
    parent.children.forEach((child, childIndex) => {
      const path = `${parent.slug}/${child.slug}`;
      out.push({
        id: path,
        parentId: parent.slug,
        slug: child.slug,
        name: child.name,
        icon: parent.icon,
        order: childIndex,
        path,
      });
    });
  });
  return out;
}

export const categories: Category[] = flatten();
