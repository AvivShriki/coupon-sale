import { getSupabase } from "@/lib/supabase/client";

const BUCKET = "listing-images";

/**
 * מעלה תמונה שהוקטנה בדפדפן לאחסון של Supabase ומחזיר כתובת ציבורית.
 * כל משתמש כותב רק לתיקייה שנושאת את המזהה שלו — נאכף במדיניות ה-Storage.
 */
export async function uploadListingImage(userId: string, dataUrl: string): Promise<string> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const path = `${userId}/${crypto.randomUUID()}.jpg`;

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(`העלאת התמונה נכשלה: ${error.message}`);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
