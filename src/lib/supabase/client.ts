import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * האתר מתפרסם כקבצים סטטיים, ולכן הדפדפן פונה ישירות ל-Supabase.
 * המפתח כאן ציבורי בכוונה — ההרשאות נאכפות ב-Row Level Security.
 */
export const hasSupabaseConfig = Boolean(url && anonKey);

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error("חסרים NEXT_PUBLIC_SUPABASE_URL או NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  cached ??= createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cached;
}
