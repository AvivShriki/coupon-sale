"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface FavoritesState {
  ids: string[];
  ready: boolean;
  has(id: string): boolean;
  toggle(id: string): boolean;
}

const STORAGE_KEY = "coupon-sale.favorites";

const FavoritesContext = createContext<FavoritesState | null>(null);

/**
 * מועדפים במצב דמה נשמרים בדפדפן. בשלב Supabase זה עובר לטבלת favorites
 * עם RLS לפי המשתמש המחובר, והממשק כאן נשאר זהה.
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw) as string[]);
    } catch {
      // אחסון חסום — המועדפים יישארו בזיכרון בלבד
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // מתעלמים בכוונה
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const exists = ids.includes(id);
      persist(exists ? ids.filter((x) => x !== id) : [...ids, id]);
      return !exists;
    },
    [ids, persist],
  );

  const value = useMemo<FavoritesState>(
    () => ({ ids, ready, has: (id) => ids.includes(id), toggle }),
    [ids, ready, toggle],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesState {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites חייב לרוץ בתוך FavoritesProvider");
  return context;
}
