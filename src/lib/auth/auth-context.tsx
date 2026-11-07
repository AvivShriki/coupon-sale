"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEMO_USER_ID } from "@/data/seed/users";

export type UserRole = "user" | "admin";

export interface SessionUser {
  id: string;
  displayName: string;
  email: string;
  phone: string | null;
  city: string | null;
  role: UserRole;
}

/** במצב דמה כתובת שמתחילה ב-admin@ מקבלת הרשאת ניהול, כדי שאפשר יהיה לבדוק את הפאנל */
function roleFor(email: string): UserRole {
  return email.trim().toLowerCase().startsWith("admin@") ? "admin" : "user";
}

interface AuthState {
  user: SessionUser | null;
  /** false עד שהקריאה מ-localStorage הסתיימה — מונע הבהוב וחוסר התאמה ב-hydration */
  ready: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(input: { displayName: string; email: string; password: string; phone: string }): Promise<void>;
  signOut(): void;
  updateProfile(patch: Partial<Omit<SessionUser, "id">>): void;
}

const STORAGE_KEY = "coupon-sale.session";

const AuthContext = createContext<AuthState | null>(null);

function read(): SessionUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function write(user: SessionUser | null) {
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // אחסון חסום (גלישה פרטית) — הסשן יחיה עד רענון הדף
  }
}

/**
 * ניהול סשן במצב דמה: המשתמש נשמר ב-localStorage ומזוהה כמשתמש הדמה של ה-seed,
 * כך שהאזור האישי מציג מודעות אמיתיות. בשלב Supabase המימוש מוחלף ב-supabase.auth.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(read());
    setReady(true);
  }, []);

  const persist = useCallback((next: SessionUser | null) => {
    setUser(next);
    write(next);
  }, []);

  const signIn = useCallback(
    async (email: string) => {
      persist({
        id: DEMO_USER_ID,
        displayName: email.split("@")[0] || "משתמש",
        email,
        phone: "052-555-0147",
        city: "תל אביב",
        role: roleFor(email),
      });
    },
    [persist],
  );

  const signUp = useCallback(
    async (input: { displayName: string; email: string; password: string; phone: string }) => {
      persist({
        id: DEMO_USER_ID,
        displayName: input.displayName,
        email: input.email,
        phone: input.phone,
        city: null,
        role: roleFor(input.email),
      });
    },
    [persist],
  );

  const signOut = useCallback(() => persist(null), [persist]);

  const updateProfile = useCallback(
    (patch: Partial<Omit<SessionUser, "id">>) => {
      setUser((current) => {
        if (!current) return current;
        const next = { ...current, ...patch };
        write(next);
        return next;
      });
    },
    [],
  );

  const value = useMemo<AuthState>(
    () => ({ user, ready, signIn, signUp, signOut, updateProfile }),
    [user, ready, signIn, signUp, signOut, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth חייב לרוץ בתוך AuthProvider");
  return context;
}
