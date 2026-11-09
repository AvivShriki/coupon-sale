"use client";

import Link from "next/link";
import { categories, useCategoryCounts } from "@/lib/data/hooks";
import { childrenOf, mainCategories } from "@/lib/categories";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CategoryIcon } from "@/components/common/category-icon";

const roots = mainCategories(categories);

export function CategoriesView() {
  const { data: counts } = useCategoryCounts();

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
