"use client";

import { useSearchParams } from "next/navigation";
import { categoryByPath, useSeller } from "@/lib/data/hooks";
import { ResultsView } from "@/components/listing/results-view";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { SearchBox } from "@/components/layout/search-box";
import { parseSearchParams, type RawParams } from "@/lib/search-params";

export function SearchView() {
  const searchParams = useSearchParams();
  const params: RawParams = Object.fromEntries(searchParams.entries());
  const query = parseSearchParams(params);

  const category = query.categoryId ? categoryByPath(query.categoryId) : null;
  const seller = useSeller(query.sellerId);

  const heading = seller
    ? `המודעות של ${seller.displayName}`
    : query.text
      ? `תוצאות עבור "${query.text}"`
      : query.onlyDeals
        ? "אזור ההזדמנויות"
        : category
          ? category.name
          : "כל המודעות";

  return (
    <>
      <div className="border-b border-border/60 bg-card">
        <div className="container-page py-6">
          <Breadcrumbs items={[{ label: "חיפוש" }]} />
          <h1 className="mt-2 font-heading text-2xl font-extrabold">{heading}</h1>
          <div className="mt-4 max-w-2xl">
            <SearchBox />
          </div>
        </div>
      </div>

      <ResultsView query={query} params={params} basePath="/search" />
    </>
  );
}
