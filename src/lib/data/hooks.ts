"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as remote from "@/lib/data/remote";
import { categories as seedCategories } from "@/data/seed/categories";
import type {
  Category,
  ListingQuery,
  ListingView,
  Paged,
  Seller,
  StoredReport,
} from "@/lib/data/types";

/**
 * הממשק שהרכיבים משתמשים בו. מתחתיו יושב Supabase, והדפדפן פונה אליו ישירות
 * כי האתר מתפרסם כקבצים סטטיים. ההרשאות נאכפות במסד הנתונים עצמו.
 */

export interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

function useAsync<T>(run: () => Promise<T>, initial: T, key: string): AsyncState<T> {
  const runRef = useRef(run);
  runRef.current = run;

  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    runRef
      .current()
      .then((result) => {
        if (!active) return;
        setData(result);
        setLoading(false);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "אירעה שגיאה בטעינת הנתונים");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [key, nonce]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  return { data, loading, error, reload };
}

const emptyPage: Paged<ListingView> = {
  items: [],
  total: 0,
  page: 1,
  perPage: 12,
  pageCount: 1,
};

export function useListings(query: ListingQuery): AsyncState<Paged<ListingView>> {
  return useAsync(() => remote.listListings(query), emptyPage, JSON.stringify(query));
}

export function useListing(id: string): AsyncState<ListingView | null> {
  return useAsync(() => remote.getListing(id), null, id);
}

export function useSimilarListings(id: string, limit = 4): AsyncState<ListingView[]> {
  return useAsync(() => remote.getSimilarListings(id, limit), [], `${id}:${limit}`);
}

export function useReports(): AsyncState<StoredReport[]> {
  return useAsync(() => remote.listReports(), [], "reports");
}

export function useCategoryCounts(): AsyncState<Record<string, number>> {
  return useAsync(() => remote.getCategoryCounts(), {}, "category-counts");
}

export function useSeller(id: string | undefined): Seller | null {
  const { data } = useAsync(
    () => (id ? remote.getSeller(id) : Promise.resolve(null)),
    null,
    id ?? "none",
  );
  return data;
}

export function useLocations(): string[] {
  const { data } = useAsync(() => remote.getLocations(), [], "locations");
  return data;
}

/** הקטגוריות קבועות ונשתלו במסד הנתונים מאותו קובץ, ולכן נקראות מקומית */
export const categories: Category[] = seedCategories;

export function categoryByPath(path: string): Category | null {
  return seedCategories.find((category) => category.path === path) ?? null;
}

