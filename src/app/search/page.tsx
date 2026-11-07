import { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/data";
import { ResultsSection } from "@/components/listing/results-section";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { SearchBox } from "@/components/layout/search-box";
import { ResultsSkeleton } from "@/components/listing/results-skeleton";
import { parseSearchParams, type RawParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "חיפוש מודעות",
  description: "חיפוש כרטיסים, חופשות, שוברים ומנויים שאנשים לא מנצלים.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  const params = await searchParams;
  const query = parseSearchParams(params);
  const [category, seller] = await Promise.all([
    query.categoryId ? db.getCategoryByPath(query.categoryId) : null,
    query.sellerId ? db.getSeller(query.sellerId) : null,
  ]);

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
            <Suspense fallback={<div className="h-11 rounded-full bg-muted" />}>
              <SearchBox />
            </Suspense>
          </div>
        </div>
      </div>

      <Suspense key={JSON.stringify(params)} fallback={<ResultsSkeleton />}>
        <ResultsSection query={query} params={params} basePath="/search" />
      </Suspense>
    </>
  );
}
