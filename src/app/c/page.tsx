import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/data";
import { childrenOf, mainCategories, rootOf } from "@/lib/categories";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CategoryIcon } from "@/components/common/category-icon";

export const metadata: Metadata = {
  title: "כל הקטגוריות",
  description: "כל הקטגוריות ותתי-הקטגוריות באתר.",
};

// הנתונים משתנים בזמן ריצה (פרסום, עריכה, מחיקה), ולכן העמוד לא נשמר כסטטי
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await db.getCategories();
  const roots = mainCategories(categories);
  const all = await db.listListings({ perPage: 1000 });

  const counts: Record<string, number> = {};
  for (const listing of all.items) {
    counts[listing.categoryId] = (counts[listing.categoryId] ?? 0) + 1;
    const root = rootOf(categories, listing.categoryId);
    if (root) counts[root.id] = (counts[root.id] ?? 0) + 1;
  }

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "כל הקטגוריות" }]} />
      <h1 className="mt-2 font-heading text-2xl font-extrabold">כל הקטגוריות</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {roots.length} קטגוריות ראשיות, {categories.length - roots.length} תתי-קטגוריות
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {roots.map((root) => (
          <section
            key={root.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <Link href={`/c/${root.path}`} className="group flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <CategoryIcon name={root.icon} className="size-5" />
              </span>
              <span>
                <span className="block font-heading font-bold transition group-hover:text-primary">
                  {root.name}
                </span>
                <span className="num block text-xs text-muted-foreground">
                  {counts[root.id] ?? 0} מודעות
                </span>
              </span>
            </Link>

            <ul className="mt-4 space-y-1.5">
              {childrenOf(categories, root.id).map((child) => (
                <li key={child.id}>
                  <Link
                    href={`/c/${child.path}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {child.name}
                    <span className="num text-xs opacity-70">{counts[child.id] ?? 0}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
