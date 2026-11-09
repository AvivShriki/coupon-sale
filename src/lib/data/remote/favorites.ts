import { getSupabase } from "@/lib/supabase/client";

export async function listFavorites(userId: string): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from("favorites")
    .select("listing_id")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.listing_id as string);
}

export async function addFavorite(userId: string, listingId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("favorites")
    .insert({ user_id: userId, listing_id: listingId });
  if (error && error.code !== "23505") throw new Error(error.message);
}

export async function removeFavorite(userId: string, listingId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);
  if (error) throw new Error(error.message);
}
