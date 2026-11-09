"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { addFavorite, listFavorites, removeFavorite } from "@/lib/data/remote/favorites";
import { useAuth } from "@/lib/auth/auth-context";

interface FavoritesState {
  ids: string[];
  ready: boolean;
  /** null כשהמשתמש אינו מחובר — הקריאה לא בוצעה */
  requiresLogin: boolean;
  has(id: string): boolean;
  toggle(id: string): Promise<boolean | null>;
}

const FavoritesContext = createContext<FavoritesState | null>(null);

/** המועדפים נשמרים בטבלה עם הרשאות פרטיות למשתמש, ולכן דורשים התחברות */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      setIds([]);
      setReady(true);
      return;
    }

    let active = true;
    listFavorites(user.id)
      .then((result) => {
        if (active) setIds(result);
      })
      .catch(() => {
        if (active) setIds([]);
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, [user, authReady]);

  const toggle = useCallback(
    async (id: string): Promise<boolean | null> => {
      if (!user) return null;

      const exists = ids.includes(id);
      setIds((current) => (exists ? current.filter((x) => x !== id) : [...current, id]));

      try {
        if (exists) await removeFavorite(user.id, id);
        else await addFavorite(user.id, id);
        return !exists;
      } catch {
        // החזרת המצב הקודם אם הכתיבה נכשלה
        setIds((current) => (exists ? [...current, id] : current.filter((x) => x !== id)));
        throw new Error("שמירת המועדף נכשלה");
      }
    },
    [ids, user],
  );

  const value = useMemo<FavoritesState>(
    () => ({
      ids,
      ready,
      requiresLogin: !user,
      has: (id) => ids.includes(id),
      toggle,
    }),
    [ids, ready, user, toggle],
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
