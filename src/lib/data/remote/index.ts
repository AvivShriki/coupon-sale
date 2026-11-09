import { categories as seedCategories } from "@/data/seed/categories";
import { getSupabase } from "@/lib/supabase/client";
import { pathChain } from "@/lib/categories";
import { discountPercent } from "@/lib/utils/format";
import {
  categoryMaps,
  uuidForPath,
  uuidsForSubtree,
} from "@/lib/data/remote/categories";
import type {
  Listing,
  ListingImage,
  ListingQuery,
  ListingView,
  NewListingInput,
  Paged,
  ReportInput,
  Seller,
  StoredReport,
} from "@/lib/data/types";

const SELECT =
  "*, listing_images(id, url, alt, position), profiles!listings_seller_id_fkey(id, display_name, avatar_url, city, is_verified, created_at)";

interface ProfileRow {
  id: string;
  display_name: string;
  avatar_url: string | null;
  city: string | null;
  is_verified: boolean;
  created_at: string;
}

interface ImageRow {
  id: string;
  url: string;
  alt: string | null;
  position: number;
}

interface ListingRow {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  description: string;
  price: string | number;
  original_price: string | number | null;
  location: string | null;
  event_date: string | null;
  expires_at: string | null;
  quantity: number;
  attributes: Record<string, string | number | boolean | null> | null;
  status: Listing["status"];
  approved: boolean;
  views: number;
  contact_whatsapp: string;
  contact_phone: string | null;
  contact_email: string | null;
  contact_preferred: Listing["contact"]["preferred"];
  transfer_confirmed: boolean;
  created_at: string;
  listing_images?: ImageRow[] | null;
  profiles?: ProfileRow | null;
}

const fallbackSeller: Seller = {
  id: "unknown",
  displayName: "מוכר",
  avatarUrl: null,
  memberSince: new Date().toISOString(),
  city: null,
  isVerified: false,
};

function toNumber(value: string | number | null): number | null {
  if (value === null) return null;
  return typeof value === "number" ? value : Number(value);
}

function toSeller(row: ProfileRow | null | undefined): Seller {
  if (!row) return fallbackSeller;
  return {
    id: row.id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    memberSince: row.created_at,
    city: row.city,
    isVerified: row.is_verified,
  };
}

async function toView(row: ListingRow): Promise<ListingView> {
  const { pathById } = await categoryMaps();
  const path = pathById.get(row.category_id) ?? "";
  const chain = path ? pathChain(seedCategories, path) : [];
  const category = chain[chain.length - 1] ?? seedCategories[0];

  const images: ListingImage[] = (row.listing_images ?? [])
    .map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt ?? row.title,
      position: image.position,
    }))
    .sort((a, b) => a.position - b.position);

  const price = toNumber(row.price) ?? 0;
  const originalPrice = toNumber(row.original_price);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    categoryId: path,
    price,
    originalPrice,
    location: row.location,
    eventDate: row.event_date,
    expiresAt: row.expires_at,
    quantity: row.quantity,
    attributes: row.attributes ?? {},
    images,
    status: row.status,
    approved: row.approved,
    createdAt: row.created_at,
    views: row.views,
    sellerId: row.seller_id,
    contact: {
      whatsapp: row.contact_whatsapp,
      phone: row.contact_phone,
      email: row.contact_email,
      preferred: row.contact_preferred,
    },
    transferConfirmed: row.transfer_confirmed,
    category,
    categoryPath: chain,
    seller: toSeller(row.profiles),
    cover: images[0] ?? null,
    discountPercent: discountPercent(price, originalPrice),
  };
}

export async function listListings(query: ListingQuery = {}): Promise<Paged<ListingView>> {
  const perPage = query.perPage ?? 12;
  const page = Math.max(1, query.page ?? 1);
  const from = (page - 1) * perPage;

  let request = getSupabase()
    .from("listings")
    .select(SELECT, { count: "exact" })
    .in("status", query.status ?? ["active"]);

  if (query.ids) request = request.in("id", query.ids);
  if (query.pendingApproval) request = request.eq("approved", false);
  if (query.sellerId) request = request.eq("seller_id", query.sellerId);
  if (query.categoryId) {
    const ids = await uuidsForSubtree(query.categoryId);
    request = request.in("category_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
  }
  if (query.location) request = request.eq("location", query.location);
  if (query.minPrice !== undefined) request = request.gte("price", query.minPrice);
  if (query.maxPrice !== undefined) request = request.lte("price", query.maxPrice);
  if (query.onlyDeals) request = request.not("discount_percent", "is", null);
  if (query.dateFrom) request = request.gte("relevant_date", query.dateFrom);
  if (query.dateTo) {
    const to = new Date(new Date(query.dateTo).getTime() + 86_400_000).toISOString();
    request = request.lte("relevant_date", to);
  }
  if (query.text?.trim()) {
    for (const term of query.text.toLowerCase().trim().split(/\s+/)) {
      request = request.ilike("search_text", `%${term}%`);
    }
  }

  switch (query.sort ?? "newest") {
    case "price_asc":
      request = request.order("price", { ascending: true });
      break;
    case "price_desc":
      request = request.order("price", { ascending: false });
      break;
    case "discount":
      request = request.order("discount_percent", { ascending: false, nullsFirst: false });
      break;
    default:
      request = request.order("created_at", { ascending: false });
  }

  const { data, error, count } = await request.range(from, from + perPage - 1);
  if (error) throw new Error(error.message);

  const items = await Promise.all(((data ?? []) as ListingRow[]).map(toView));
  const total = count ?? items.length;

  return {
    items,
    total,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getListing(id: string): Promise<ListingView | null> {
  const { data, error } = await getSupabase()
    .from("listings")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toView(data as ListingRow) : null;
}

export async function getSimilarListings(id: string, limit = 4): Promise<ListingView[]> {
  const current = await getListing(id);
  if (!current) return [];
  const root = current.categoryPath[0];
  if (!root) return [];

  const results = await listListings({
    categoryId: root.path,
    perPage: limit + 1,
    sort: "newest",
  });
  return results.items.filter((item) => item.id !== id).slice(0, limit);
}

export async function registerView(id: string): Promise<void> {
  // הטריגר bump_listing_views מעדכן את המונה במודעה
  await getSupabase().from("listing_views").insert({ listing_id: id });
}

export async function createListing(
  input: NewListingInput,
  sellerId: string,
): Promise<{ id: string }> {
  const supabase = getSupabase();
  const categoryId = await uuidForPath(input.categoryId);
  if (!categoryId) throw new Error("הקטגוריה שנבחרה לא נמצאה");

  const { data, error } = await supabase
    .from("listings")
    .insert({
      seller_id: sellerId,
      category_id: categoryId,
      title: input.title,
      description: input.description,
      price: input.price,
      original_price: input.originalPrice,
      location: input.location,
      event_date: input.eventDate,
      expires_at: input.expiresAt,
      quantity: input.quantity,
      attributes: input.attributes,
      contact_whatsapp: input.contact.whatsapp,
      contact_phone: input.contact.phone,
      contact_email: input.contact.email,
      contact_preferred: input.contact.preferred,
      transfer_confirmed: input.transferConfirmed,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (input.images.length > 0) {
    const { error: imageError } = await supabase.from("listing_images").insert(
      input.images.map((image, index) => ({
        listing_id: data.id,
        url: image.url,
        alt: image.alt,
        position: index,
      })),
    );
    if (imageError) throw new Error(imageError.message);
  }

  return { id: data.id as string };
}

export async function updateListing(
  id: string,
  patch: Partial<Listing>,
): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (patch.title !== undefined) payload.title = patch.title;
  if (patch.description !== undefined) payload.description = patch.description;
  if (patch.price !== undefined) payload.price = patch.price;
  if (patch.originalPrice !== undefined) payload.original_price = patch.originalPrice;
  if (patch.location !== undefined) payload.location = patch.location;
  if (patch.eventDate !== undefined) payload.event_date = patch.eventDate;
  if (patch.expiresAt !== undefined) payload.expires_at = patch.expiresAt;
  if (patch.quantity !== undefined) payload.quantity = patch.quantity;
  if (patch.attributes !== undefined) payload.attributes = patch.attributes;
  if (patch.status !== undefined) payload.status = patch.status;
  if (patch.approved !== undefined) payload.approved = patch.approved;

  const { error } = await getSupabase().from("listings").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteListing(id: string): Promise<void> {
  const { error } = await getSupabase().from("listings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reportListing(input: ReportInput): Promise<void> {
  const { error } = await getSupabase().from("reports").insert({
    listing_id: input.listingId,
    reporter_id: input.reporterId,
    reason: input.reason,
    details: input.details,
  });
  if (error) throw new Error(error.message);
}

export async function listReports(): Promise<StoredReport[]> {
  const { data, error } = await getSupabase()
    .from("reports")
    .select("id, listing_id, reporter_id, reason, details, created_at")
    .eq("handled", false)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    listingId: row.listing_id as string,
    reporterId: row.reporter_id as string | null,
    reason: row.reason as string,
    details: row.details as string | null,
    createdAt: row.created_at as string,
  }));
}

export async function getSeller(id: string): Promise<Seller | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("id, display_name, avatar_url, city, is_verified, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toSeller(data as ProfileRow) : null;
}

export async function getLocations(): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from("listings")
    .select("location")
    .eq("status", "active")
    .not("location", "is", null);
  if (error) throw new Error(error.message);

  const unique = new Set((data ?? []).map((row) => row.location as string));
  return [...unique].sort((a, b) => a.localeCompare(b, "he"));
}

/** כמה מודעות פעילות יש בכל קטגוריה, לפי מסלול */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data, error } = await getSupabase()
    .from("listings")
    .select("category_id")
    .eq("status", "active");
  if (error) throw new Error(error.message);

  const { pathById } = await categoryMaps();
  const counts: Record<string, number> = {};

  for (const row of data ?? []) {
    const path = pathById.get(row.category_id as string);
    if (!path) continue;
    // כל מודעה נספרת גם בתת-הקטגוריה וגם בקטגוריה הראשית שמעליה
    for (const segment of pathChain(seedCategories, path)) {
      counts[segment.id] = (counts[segment.id] ?? 0) + 1;
    }
  }

  return counts;
}
