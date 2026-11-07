"use client";

import Link from "next/link";
import { categories, locations } from "@/lib/data/hooks";
import { useListings } from "@/lib/data/hooks";
import { ListingGrid } from "@/components/listing/listing-grid";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { FiltersPanel } from "@/components/filters/filters-panel";
import { ResultsToolbar } from "@/components/filters/results-toolbar";
import { activeFilterCount, type RawParams } from "@/lib/search-params";
import type { ListingQuery } from "@/lib/data/types";

/** אזור התוצאות המשותף לעמוד החיפוש ולעמודי הקטגוריות */
export function ResultsView({
  query,
  params,
  basePath,
}: {
  query: ListingQuery;
  params: RawParams;
  basePath: string;
}) {
  const results = useListings(query);

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-36 max-h-[calc(100dvh-10rem)] overflow-y-auto pe-1">
          <FiltersPanel
            categories={categories}
            locations={locations}
            activeCategoryId={query.categoryId}
          />
        </div>
      </aside>

      <div>
        <ResultsToolbar
          total={results.total}
          categories={categories}
          locations={locations}
          activeCategoryId={query.categoryId}
          activeFilters={activeFilterCount(query, basePath.startsWith("/c"))}
        />

        {results.items.length > 0 ? (
          <>
            <ListingGrid listings={results.items} columns={3} priorityCount={3} />
            <Pagination
              page={results.page}
              pageCount={results.pageCount}
              basePath={basePath}
              params={params}
            />
          </>
        ) : (
          <EmptyState
            title="לא נמצאו מודעות שמתאימות לסינון"
            description="אפשר לנסות מילת חיפוש אחרת, להרחיב את טווח המחירים או לבחור קטגוריה אחרת."
            action={
              <Link
                href="/search"
                className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                ניקוי החיפוש
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
