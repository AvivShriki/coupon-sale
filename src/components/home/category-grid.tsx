import Link from "next/link";
import { CategoryIcon } from "@/components/common/category-icon";
import type { Category } from "@/lib/data/types";

export function CategoryGrid({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/c/${category.path}`}
          className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card-hover"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
            <CategoryIcon name={category.icon} className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{category.name}</span>
            <span className="num block text-xs text-muted-foreground">
              {counts[category.id] ?? 0} מודעות
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
