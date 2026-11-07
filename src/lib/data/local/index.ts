import { categories as seedCategories } from "@/data/seed/categories";
import { demoLocations, listings as seedListings } from "@/data/seed/listings";
import { sellers } from "@/data/seed/users";
import {
  enrich,
  paginate,
  queryListings,
  type DataStore,
} from "@/lib/data/store";
import type {
  Category,
  Listing,
  ListingQuery,
  ListingView,
  NewListingInput,
  Paged,
  ReportInput,
  Seller,
  StoredReport,
} from "@/lib/data/types";

/**
 * מקור הנתונים של גרסת התצוגה: נתוני ה-seed + שכבת שינויים מקומית בדפדפן.
 *
 * למה בצד הלקוח ולא בשרת: האתר מתפרסם כאתר סטטי, ואין שרת שיריץ פעולות.
 * זו גם הארכיטקטורה הנכונה ל-Supabase — שם הדפדפן פונה ישירות למסד הנתונים
 * וההרשאות נאכפות ברמת השורה, כך שהמעבר יהיה החלפת המימוש כאן בלבד.
 *
 * בזמן הבנייה אין localStorage, ולכן ה-HTML הסטטי נבנה מה-seed בלבד —
 * אותו פלט בדיוק כמו ברינדור הראשון בדפדפן, בלי אי-התאמה.
 */

const STORAGE_KEY = "coupon-sale.data";

interface Overlay {
  created: Listing[];
  patches: Record<string, Partial<Listing>>;
  deleted: string[];
  reports: StoredReport[];
}

const emptyOverlay: Overlay = { created: [], patches: {}, deleted: [], reports: [] };

const listeners = new Set<() => void>();
let cache: Overlay | null = null;

function readOverlay(): Overlay {
  if (typeof window === "undefined") return emptyOverlay;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? { ...emptyOverlay, ...(JSON.parse(raw) as Overlay) } : emptyOverlay;
  } catch {
    cache = emptyOverlay;
  }
  return cache;
}

function writeOverlay(next: Overlay) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // אחסון חסום (גלישה פרטית) — השינוי יחיה עד רענון הדף
  }
  for (const listener of listeners) listener();
}

/** מאפשר לרכיבים להתעדכן אחרי כל שינוי בנתונים */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function buildStore(includeLocal: boolean): DataStore {
  if (!includeLocal) {
    return { categories: seedCategories, listings: seedListings, sellers };
  }

  const overlay = readOverlay();
  const deleted = new Set(overlay.deleted);
  const listings = [...overlay.created, ...seedListings]
    .filter((listing) => !deleted.has(listing.id))
    .map((listing) =>
      overlay.patches[listing.id] ? { ...listing, ...overlay.patches[listing.id] } : listing,
    );

  return { categories: seedCategories, listings, sellers };
}

// ───────────────────────────── קריאה ─────────────────────────────

export function listListings(query: ListingQuery, local: boolean): Paged<ListingView> {
  const store = buildStore(local);
  return paginate(queryListings(store, query), query);
}

export function getListing(id: string, local: boolean): ListingView | null {
  const store = buildStore(local);
  const listing = store.listings.find((item) => item.id === id);
  return listing ? enrich(store, listing) : null;
}

export function getSimilarListings(id: string, local: boolean, limit = 4): ListingView[] {
  const store = buildStore(local);
  const listing = store.listings.find((item) => item.id === id);
  if (!listing) return [];
  const root = listing.categoryId.split("/")[0];
  return store.listings
    .filter(
      (item) =>
        item.id !== id && item.status === "active" && item.categoryId.split("/")[0] === root,
    )
    .slice(0, limit)
    .map((item) => enrich(store, item));
}

export function getCategories(): Category[] {
  return seedCategories;
}

export function getCategoryByPath(path: string): Category | null {
  return seedCategories.find((category) => category.path === path) ?? null;
}

export function getLocations(): string[] {
  return demoLocations;
}

export function getSeller(id: string): Seller | null {
  return sellers.find((seller) => seller.id === id) ?? null;
}

export function listReports(): StoredReport[] {
  return [...readOverlay().reports].reverse();
}

// ───────────────────────────── כתיבה ─────────────────────────────

export function createListing(input: NewListingInput, sellerId: string): Listing {
  const overlay = readOverlay();
  const id = `local-${Date.now().toString(36)}`;
  const listing: Listing = {
    id,
    title: input.title,
    description: input.description,
    categoryId: input.categoryId,
    price: input.price,
    originalPrice: input.originalPrice,
    location: input.location,
    eventDate: input.eventDate,
    expiresAt: input.expiresAt,
    quantity: input.quantity,
    attributes: input.attributes,
    images: input.images.map((image, index) => ({
      id: `${id}-img-${index + 1}`,
      url: image.url,
      alt: image.alt,
      position: index,
    })),
    status: "active",
    createdAt: new Date().toISOString(),
    views: 0,
    sellerId,
    contact: input.contact,
    transferConfirmed: input.transferConfirmed,
  };

  writeOverlay({ ...overlay, created: [listing, ...overlay.created] });
  return listing;
}

export function updateListing(id: string, patch: Partial<Listing>): boolean {
  const overlay = readOverlay();
  const exists = buildStore(true).listings.some((listing) => listing.id === id);
  if (!exists) return false;
  writeOverlay({
    ...overlay,
    patches: { ...overlay.patches, [id]: { ...overlay.patches[id], ...patch } },
  });
  return true;
}

export function deleteListing(id: string): boolean {
  const overlay = readOverlay();
  if (overlay.deleted.includes(id)) return false;
  writeOverlay({
    ...overlay,
    created: overlay.created.filter((listing) => listing.id !== id),
    deleted: [...overlay.deleted, id],
  });
  return true;
}

export function registerView(id: string): void {
  const current = getListing(id, true);
  if (!current) return;
  const overlay = readOverlay();
  writeOverlay({
    ...overlay,
    patches: {
      ...overlay.patches,
      [id]: { ...overlay.patches[id], views: current.views + 1 },
    },
  });
}

export function reportListing(input: ReportInput): void {
  const overlay = readOverlay();
  const report: StoredReport = {
    ...input,
    id: `r-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  writeOverlay({ ...overlay, reports: [...overlay.reports, report] });
}

/** האם קיימים נתונים מקומיים — משמש להצגת הודעת מצב הדגמה */
export function hasLocalChanges(): boolean {
  const overlay = readOverlay();
  return (
    overlay.created.length > 0 ||
    overlay.deleted.length > 0 ||
    Object.keys(overlay.patches).length > 0
  );
}

export function resetLocalData(): void {
  writeOverlay(emptyOverlay);
}
