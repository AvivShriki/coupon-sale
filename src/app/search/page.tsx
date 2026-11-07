import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchView } from "@/components/search/search-view";
import { ResultsSkeleton } from "@/components/listing/results-skeleton";

export const metadata: Metadata = {
  title: "חיפוש מודעות",
  description: "חיפוש כרטיסים, חופשות, שוברים ומנויים שאנשים לא מנצלים.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <SearchView />
    </Suspense>
  );
}
