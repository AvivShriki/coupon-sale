"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";

export type UserRole = "user" | "admin";

export interface SessionUser {
  id: string;
  displayName: string;
  email: string;
  phone: string | null;
  city: string | null;
  role: UserRole;
}

interface AuthState {
  user: SessionUser | null;
  /** false עד שהסשן נבדק מול Supabase — מונע הבהוב בין אורח למחובר */
  ready: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(input: {
    displayName: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<void>;
  signOut(): Promise<void>;
  updateProfile(patch: Partial<Omit<SessionUser, "id" | "role">>): Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/** שגיאות Supabase מגיעות באנגלית; כאן מתרגמים את הנפוצות */
function translateError(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "אימייל או סיסמה שגויים",
    "User already registered": "כתובת האימייל הזו כבר רשומה",
    "Password should be at least 6 characters.": "הסיסמה צריכה להכיל לפחות 6 תווים",
    "Email not confirmed": "צריך לאשר את כתובת האימייל לפני ההתחברות",
    "Unable to validate email address: invalid format": "כתובת האימייל אינה תקינה",
  };
  return map[message] ?? message;
}

async function loadProfile(session: Session): Promise<SessionUser> {
  const { data } = await getSupabase()
    .from("profiles")
    .select("display_name, phone, city, role")
    .eq("id", session.user.id)
    .maybeSingle();

  return {
    id: session.user.id,
    email: session.user.email ?? "",
    displayName:
      (data?.display_name as string | undefined) ??
      (session.user.user_metadata?.display_name as string | undefined) ??
      (session.user.email?.split("@")[0] || "משתמש"),
    phone: (data?.phone as string | null) ?? null,
    city: (data?.city as string | null) ?? null,
    role: ((data?.role as UserRole | undefined) ?? "user") as UserRole,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    let active = true;

    async function apply(session: Session | null) {
      if (!active) return;
      setUser(session ? await loadProfile(session) : null);
      setReady(true);
    }

    void supabase.auth.getSession().then(({ data }) => apply(data.session));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      void apply(session);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) throw new Error(translateError(error.message));
  }, []);

  const signUp = useCallback(
    async (input: { displayName: string; email: string; password: string; phone: string }) => {
      const { error } = await getSupabase().auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          // הטריגר handle_new_user יוצר מזה את הפרופיל
          data: { display_name: input.displayName, phone: input.phone },
        },
      });
      if (error) throw new Error(translateError(error.message));
    },
    [],
  );

  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Omit<SessionUser, "id" | "role">>) => {
      if (!user) return;
      const payload: Record<string, unknown> = {};
      if (patch.displayName !== undefined) payload.display_name = patch.displayName;
      if (patch.phone !== undefined) payload.phone = patch.phone;
      if (patch.city !== undefined) payload.city = patch.city;

      const { error } = await getSupabase()
        .from("profiles")
        .update(payload)
        .eq("id", user.id);
      if (error) throw new Error(error.message);

      setUser({ ...user, ...patch });
    },
    [user],
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
