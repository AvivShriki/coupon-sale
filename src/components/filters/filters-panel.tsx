"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "cn";
import { childrenOf, mainCategories } from "@/lib/categories";
import type { Category } from "@/lib/data/types";

export function FiltersPanel({
  categories,
  locations,
  activeCategoryId,
  onNavigate,
}: {
  categories: Category[];
  locations: string[];
  activeCategoryId?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [minPrice, setMinPrice] = useState(params.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("max") ?? "");

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    next.delete("page");
    const search = next.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
    onNavigate?.();
  }

  const roots = mainCategories(categories);
  const activeRoot = activeCategoryId ? activeCategoryId.split("/")[0] : null;
  const hasFilters =
    Boolean(params.get("loc") || params.get("min") || params.get("max") || params.get("from") || params.get("to") || params.get("deals"));

  return (
    <div className="flex flex-col gap-6">
      <Group title="קטגוריה">
        <div className="flex flex-col gap-0.5">
          <CategoryLink
            href={hrefWithCategory(pathname, params, null)}
            active={!activeCategoryId}
            onNavigate={onNavigate}
          >
            כל הקטגוריות
          </CategoryLink>
          {roots.map((root) => {
            const children = childrenOf(categories, root.id);
            const expanded = activeRoot === root.id;
            return (
              <div key={root.id}>
                <CategoryLink
                  href={hrefWithCategory(pathname, params, root.path)}
                  active={activeCategoryId === root.id}
                  onNavigate={onNavigate}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    {root.name}
                    <ChevronDown
                      className={cn(
                        "size-3.5 shrink-0 text-muted-foreground transition-transform",
                        expanded && "rotate-180",
                      )}
                    />
                  </span>
                </CategoryLink>
                {expanded && (
                  <div className="mt-0.5 flex flex-col gap-0.5 border-s border-border ps-2 ms-3">
                    {children.map((child) => (
                      <CategoryLink
                        key={child.id}
                        href={hrefWithCategory(pathname, params, child.path)}
                        active={activeCategoryId === child.id}
                        onNavigate={onNavigate}
                        small
                      >
                        {child.name}
                      </CategoryLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Group>

      <Group title="מיקום">
        <select
          value={params.get("loc") ?? ""}
          onChange={(event) => update({ loc: event.target.value || null })}
          className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
        >
          <option value="">כל המיקומים</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </Group>

      <Group title="טווח מחירים">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="מ-"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            className="num h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="עד"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="num h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <button
          type="button"
          onClick={() => update({ min: minPrice || null, max: maxPrice || null })}
          className="mt-2 h-9 w-full rounded-lg bg-secondary text-sm font-medium transition hover:bg-muted"
        >
          החלת טווח
        </button>
      </Group>

      <Group title="תאריך האירוע / התוקף">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            מתאריך
            <input
              type="date"
              value={params.get("from") ?? ""}
              onChange={(event) => update({ from: event.target.value || null })}
              className="num h-9 flex-1 rounded-lg border border-border bg-card px-2 text-sm outline-none focus:border-primary/40"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            עד תאריך
            <input
              type="date"
              value={params.get("to") ?? ""}
              onChange={(event) => update({ to: event.target.value || null })}
              className="num h-9 flex-1 rounded-lg border border-border bg-card px-2 text-sm outline-none focus:border-primary/40"
            />
          </label>
        </div>
      </Group>

      <Group title="הזדמנויות">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm">
          <span>רק מודעות מתחת למחיר המקורי</span>
          <input
            type="checkbox"
            checked={params.get("deals") === "1"}
            onChange={(event) => update({ deals: event.target.checked ? "1" : null })}
            className="size-4 accent-[var(--primary)]"
          />
        </label>
      </Group>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
            update({ loc: null, min: null, max: null, from: null, to: null, deals: null });
          }}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          ניקוי כל המסננים
        </button>
      )}
    </div>
  );
}

/**
 * בחירת קטגוריה: בעמוד החיפוש נשארים ב-/search עם פרמטר cat,
 * ובעמודי הקטגוריות עוברים לכתובת הקטגוריה עצמה. שאר המסננים נשמרים.
 */
function hrefWithCategory(
  pathname: string,
  params: URLSearchParams,
  categoryPath: string | null,
): string {
  const next = new URLSearchParams(params.toString());
  next.delete("page");
  next.delete("cat");

  let base: string;
  if (pathname.startsWith("/search")) {
    base = "/search";
    if (categoryPath) next.set("cat", categoryPath);
  } else {
    base = categoryPath ? `/c/${categoryPath}` : "/search";
  }

  const search = next.toString();
  return search ? `${base}?${search}` : base;
}

function CategoryLink({
  href,
  active,
  children,
  onNavigate,
  small = false,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onNavigate?: () => void;
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-sm transition",
        small ? "text-[0.82rem]" : "",
        active
          ? "bg-primary-soft font-semibold text-primary"
          : "text-foreground hover:bg-muted",
      )}
    >
      {children}
    </Link>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-bold">{title}</h3>
      {children}
    </section>
  );
}
