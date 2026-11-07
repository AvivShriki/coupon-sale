"use server";

import { db } from "@/lib/data";
import type { ListingStatus, ListingView } from "@/lib/data/types";

/**
 * במצב דמה הבעלות נבדקת כאן. כשיחובר Supabase הבדיקה תיאכף גם ברמת ה-DB
 * באמצעות Row Level Security, כך ששום בקשה ישירה לא תוכל לעקוף אותה.
 */
async function assertOwner(listingId: string, userId: string): Promise<boolean> {
  const listing = await db.getListing(listingId);
  return Boolean(listing && listing.sellerId === userId);
}

export async function getMyListingsAction(userId: string): Promise<ListingView[]> {
  if (!userId) return [];
  const results = await db.listListings({
    sellerId: userId,
    status: ["active", "paused", "sold", "expired", "pending_review"],
    perPage: 200,
  });
  return results.items;
}

export async function getListingsByIdsAction(ids: string[]): Promise<ListingView[]> {
  if (ids.length === 0) return [];
  const results = await db.listListings({
    ids,
    status: ["active", "paused", "sold", "expired"],
    perPage: 200,
  });
  return results.items;
}

export async function getListingForEditAction(
  listingId: string,
  userId: string,
): Promise<ListingView | null> {
  const listing = await db.getListing(listingId);
  if (!listing || listing.sellerId !== userId) return null;
  return listing;
}

export async function setListingStatusAction(
  listingId: string,
  userId: string,
  status: ListingStatus,
): Promise<{ ok: boolean; message: string }> {
  if (!(await assertOwner(listingId, userId))) {
    return { ok: false, message: "אפשר לשנות רק מודעות שלך" };
  }
  await db.updateListing(listingId, { status });
  return { ok: true, message: "המודעה עודכנה" };
}

export async function deleteListingAction(
  listingId: string,
  userId: string,
): Promise<{ ok: boolean; message: string }> {
  if (!(await assertOwner(listingId, userId))) {
    return { ok: false, message: "אפשר למחוק רק מודעות שלך" };
  }
  await db.deleteListing(listingId);
  return { ok: true, message: "המודעה נמחקה" };
}

export async function updateListingDetailsAction(
  listingId: string,
  userId: string,
  patch: {
    title: string;
    description: string;
    price: number;
    originalPrice: number | null;
    location: string | null;
    eventDate: string | null;
    expiresAt: string | null;
    quantity: number;
    attributes: Record<string, string>;
  },
): Promise<{ ok: boolean; message: string }> {
  if (!(await assertOwner(listingId, userId))) {
    return { ok: false, message: "אפשר לערוך רק מודעות שלך" };
  }
  if (patch.title.trim().length < 6 || patch.description.trim().length < 20 || patch.price <= 0) {
    return { ok: false, message: "חלק מהפרטים אינם תקינים" };
  }
  await db.updateListing(listingId, patch);
  return { ok: true, message: "השינויים נשמרו" };
}
