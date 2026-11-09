import { createClient } from "@supabase/supabase-js";

/**
 * קריאות שרצות רק בזמן הבנייה, כדי לייצר עמוד סטטי לכל מודעה שקיימת.
 * מודעה שנוצרת אחרי הבנייה מוצגת דרך דף ה-404 שמזהה כתובת של מודעה.
 */
function buildClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export interface BuildListing {
  id: string;
  title: string;
  description: string;
}

export async function fetchListingsForBuild(): Promise<BuildListing[]> {
  const supabase = buildClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("listings")
      .select("id, title, description")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) return [];
    return (data ?? []) as BuildListing[];
  } catch {
    // בנייה בלי חיבור למסד הנתונים עדיין צריכה לעבור
    return [];
  }
}
