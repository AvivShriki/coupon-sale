"use client";

import { useEffect, useRef, useState } from "react";
import * as local from "@/lib/data/local";
import type { ListingQuery, ListingView, Paged, StoredReport } from "@/lib/data/types";

/**
 * קורא נתונים בשני שלבים: הרינדור הראשון מחושב מנתוני ה-seed בלבד —
 * זהה למה שנוצר בזמן הבנייה — ומיד אחרי העלייה לדפדפן נקראים גם השינויים
 * המקומיים. כך אין אי-התאמה ב-hydration, והתוכן מוצג מיד בלי מסך טעינה.
 *
 * `key` מתאר את פרמטרי השאילתה; שינוי שלו מריץ קריאה מחדש.
 */
function useLocalData<T>(compute: (includeLocal: boolean) => T, key: string): T {
  const computeRef = useRef(compute);
  computeRef.current = compute;

  const [value, setValue] = useState<T>(() => compute(false));

  useEffect(() => {
    const update = () => setValue(computeRef.current(true));
    update();
    return local.subscribe(update);
  }, [key]);

  return value;
}

export function useListings(query: ListingQuery): Paged<ListingView> {
  return useLocalData(
    (includeLocal) => local.listListings(query, includeLocal),
    JSON.stringify(query),
  );
}

export function useListing(id: string): ListingView | null {
  return useLocalData((includeLocal) => local.getListing(id, includeLocal), id);
}

export function useSimilarListings(id: string, limit = 4): ListingView[] {
  return useLocalData(
    (includeLocal) => local.getSimilarListings(id, includeLocal, limit),
    `${id}:${limit}`,
  );
}

export function useReports(): StoredReport[] {
  const [reports, setReports] = useState<StoredReport[]>([]);
  useEffect(() => {
    const update = () => setReports(local.listReports());
    update();
    return local.subscribe(update);
  }, []);
  return reports;
}

export const categories = local.getCategories();
export const locations = local.getLocations();
export const getSeller = local.getSeller;
export const getCategoryByPath = local.getCategoryByPath;
