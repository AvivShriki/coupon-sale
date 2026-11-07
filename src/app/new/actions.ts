"use server";

import { db } from "@/lib/data";
import { newListingSchema } from "@/lib/validation/listing";
import type { NewListingInput } from "@/lib/data/types";

export async function createListingAction(
  payload: unknown,
  sellerId: string,
): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const parsed = newListingSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, message: "חלק מהפרטים אינם תקינים. בדקו את השדות ונסו שוב." };
  }
  if (!sellerId) {
    return { ok: false, message: "צריך להתחבר כדי לפרסם מודעה." };
  }

  const data = parsed.data;
  const input: NewListingInput = {
    title: data.title,
    description: data.description,
    categoryId: data.categoryId,
    price: data.price,
    originalPrice: data.originalPrice,
    location: data.location,
    eventDate: data.eventDate,
    expiresAt: data.expiresAt,
    quantity: data.quantity,
    attributes: data.attributes,
    images: data.images.map((url) => ({ url, alt: data.title })),
    contact: data.contact,
    transferConfirmed: data.transferConfirmed,
  };

  const listing = await db.createListing(input, sellerId);
  return { ok: true, id: listing.id };
}
