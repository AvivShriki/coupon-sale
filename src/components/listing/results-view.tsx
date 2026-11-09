"use client";

import Link from "next/link";
import { categories, useListings, useLocations } from "@/lib/data/hooks";
import { CardsSkeleton } from "@/components/common/cards-skeleton";
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
  const locations = useLocations();
  const { data: page, loading, error } = results;

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
          total={page.total}
          categories={categories}
          locations={locations}
          activeCategoryId={query.categoryId}
          activeFilters={activeFilterCount(query, basePath.startsWith("/c"))}
        />

        {loading ? (
          <CardsSkeleton count={6} columns={3} />
        ) : error ? (
          <EmptyState
            title="לא הצלחנו לטעון את המודעות"
            description={error}
            action={
              <button
                type="button"
                onClick={results.reload}
                className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                ניסיון חוזר
              </button>
            }
          />
        ) : page.items.length > 0 ? (
          <>
            <ListingGrid listings={page.items} columns={3} priorityCount={3} />
            <Pagination
              page={page.page}
              pageCount={page.pageCount}
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
