"use client";

import { cn } from "cn";
import { CategoryIcon } from "@/components/common/category-icon";
import { childrenOf, mainCategories } from "@/lib/categories";
import type { Category } from "@/lib/data/types";

export function StepCategory({
  categories,
  value,
  onChange,
  error,
}: {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
}) {
  const roots = mainCategories(categories);
  const activeRoot = value ? value.split("/")[0] : "";
  const children = activeRoot ? childrenOf(categories, activeRoot) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-bold">מה אתם מעבירים הלאה?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          בחרו קטגוריה ראשית ואז תת-קטגוריה מדויקת. זה קובע אילו פרטים תתבקשו למלא.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {roots.map((root) => (
          <button
            key={root.id}
            type="button"
            onClick={() => onChange(root.id === activeRoot ? value : `${root.path}/`)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border p-3 text-start text-sm font-medium transition",
              activeRoot === root.id
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-card hover:border-primary/30",
            )}
          >
            <CategoryIcon name={root.icon} className="size-5 shrink-0" />
            <span className="min-w-0 truncate">{root.name}</span>
          </button>
        ))}
      </div>

      {children.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-bold">תת-קטגוריה</h3>
          <div className="flex flex-wrap gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => onChange(child.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition",
                  value === child.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
