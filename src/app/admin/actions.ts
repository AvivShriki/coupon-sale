"use server";

import { db } from "@/lib/data";
import type { ListingStatus, ListingView, StoredReport } from "@/lib/data/types";

export interface AdminSnapshot {
  byStatus: Record<string, number>;
  categoriesCount: number;
  recent: ListingView[];
  reports: StoredReport[];
}

/**
 * כל הפעולות כאן מקבלות את התפקיד מהלקוח, וזה מספיק רק במצב דמה.
 * עם Supabase הבדיקה תעבור לצד השרת: claim בטוקן + מדיניות RLS לטבלאות.
 */
export async function getAdminSnapshotAction(role: string): Promise<AdminSnapshot | null> {
  if (role !== "admin") return null;

  const [all, categories, reports] = await Promise.all([
    db.listListings({
      status: ["active", "paused", "sold", "expired", "pending_review", "removed"],
      perPage: 1000,
    }),
    db.getCategories(),
    db.listReports(),
  ]);

  const byStatus: Record<string, number> = {};
  for (const listing of all.items) {
    byStatus[listing.status] = (byStatus[listing.status] ?? 0) + 1;
  }

  return {
    byStatus,
    categoriesCount: categories.length,
    recent: all.items.slice(0, 12),
    reports,
  };
}

export async function adminSetStatusAction(
  role: string,
  listingId: string,
  status: ListingStatus,
): Promise<{ ok: boolean; message: string }> {
  if (role !== "admin") return { ok: false, message: "נדרשת הרשאת ניהול" };
  const updated = await db.updateListing(listingId, { status });
  return updated
    ? { ok: true, message: "סטטוס המודעה עודכן" }
    : { ok: false, message: "המודעה לא נמצאה" };
}
