"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FiltersPanel } from "@/components/filters/filters-panel";
import { sortLabels } from "@/lib/search-params";
import type { Category, ListingSort } from "@/lib/data/types";

export function ResultsToolbar({
  total,
  categories,
  locations,
  activeCategoryId,
  activeFilters,
}: {
  total: number;
  categories: Category[];
  locations: string[];
  activeCategoryId?: string;
  activeFilters: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  function changeSort(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "newest") next.delete("sort");
    else next.set("sort", value);
    next.delete("page");
    const search = next.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        <span className="num font-bold text-foreground">{total}</span> מודעות
      </p>

      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium transition hover:bg-muted lg:hidden"
              />
            }
          >
            <SlidersHorizontal className="size-4" />
            סינון
            {activeFilters > 0 && (
              <span className="num grid size-5 place-items-center rounded-full bg-primary text-[0.7rem] font-bold text-primary-foreground">
                {activeFilters}
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="right" className="w-[88%] max-w-sm overflow-y-auto p-5">
            <SheetTitle className="mb-4 font-heading text-lg font-bold">סינון מודעות</SheetTitle>
            <FiltersPanel
              categories={categories}
              locations={locations}
              activeCategoryId={activeCategoryId}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <label className="flex items-center gap-2">
          <span className="sr-only">מיון תוצאות</span>
          <select
            value={params.get("sort") ?? "newest"}
            onChange={(event) => changeSort(event.target.value)}
            className="h-10 rounded-full border border-border bg-card px-3 text-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value as ListingSort}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
