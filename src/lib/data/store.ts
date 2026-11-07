import { withDescendantIds } from "@/lib/categories";
import { discountPercent } from "@/lib/utils/format";
import type {
  Category,
  Listing,
  ListingQuery,
  ListingView,
  Paged,
  Seller,
} from "@/lib/data/types";

export interface DataStore {
  categories: Category[];
  listings: Listing[];
  sellers: Seller[];
}

export const DEFAULT_PER_PAGE = 12;

/** מודעה גולמית → מודעה מועשרת שה-UI יודע להציג */
export function enrich(store: DataStore, listing: Listing): ListingView {
  const chain: Category[] = [];
  let current = store.categories.find((c) => c.id === listing.categoryId) ?? null;
  while (current) {
    chain.unshift(current);
    const parentId: string | null = current.parentId;
    current = parentId
      ? (store.categories.find((c) => c.id === parentId) ?? null)
      : null;
  }

  const category = chain[chain.length - 1] ?? store.categories[0];
  const seller = store.sellers.find((s) => s.id === listing.sellerId) ?? store.sellers[0];
  const cover = [...listing.images].sort((a, b) => a.position - b.position)[0] ?? null;

  return {
    ...listing,
    category,
    categoryPath: chain,
    seller,
    cover,
    discountPercent: discountPercent(listing.price, listing.originalPrice),
  };
}

function searchableText(view: ListingView): string {
  return [
    view.title,
    view.description,
    view.location ?? "",
    ...view.categoryPath.map((c) => c.name),
    ...Object.values(view.attributes).map((v) => (v === null ? "" : String(v))),
  ]
    .join(" ")
    .toLowerCase();
}

function relevantDate(view: ListingView): number | null {
  const value = view.eventDate ?? view.expiresAt;
  return value ? new Date(value).getTime() : null;
}

/** כל לוגיקת הסינון והמיון במקום אחד — משמשת גם את מצב הדמה וגם בדיקות */
export function queryListings(store: DataStore, query: ListingQuery = {}): ListingView[] {
  const statuses = query.status ?? ["active"];
  let items = store.listings
    .map((listing) => enrich(store, listing))
    .filter((view) => statuses.includes(view.status));

  if (query.ids) {
    const set = new Set(query.ids);
    items = items.filter((view) => set.has(view.id));
  }
  if (query.sellerId) {
    items = items.filter((view) => view.sellerId === query.sellerId);
  }
  if (query.categoryId) {
    const allowed = new Set(withDescendantIds(store.categories, query.categoryId));
    items = items.filter((view) => allowed.has(view.categoryId));
  }
  if (query.location) {
    items = items.filter((view) => view.location === query.location);
  }
  if (query.minPrice !== undefined) {
    items = items.filter((view) => view.price >= query.minPrice!);
  }
  if (query.maxPrice !== undefined) {
    items = items.filter((view) => view.price <= query.maxPrice!);
  }
  if (query.onlyDeals) {
    items = items.filter((view) => view.discountPercent !== null);
  }
  if (query.dateFrom) {
    const from = new Date(query.dateFrom).getTime();
    items = items.filter((view) => {
      const date = relevantDate(view);
      return date !== null && date >= from;
    });
  }
  if (query.dateTo) {
    const to = new Date(query.dateTo).getTime() + 86_400_000;
    items = items.filter((view) => {
      const date = relevantDate(view);
      return date !== null && date <= to;
    });
  }
  if (query.text?.trim()) {
    const terms = query.text.toLowerCase().trim().split(/\s+/);
    items = items.filter((view) => {
      const haystack = searchableText(view);
      return terms.every((term) => haystack.includes(term));
    });
  }

  switch (query.sort ?? "newest") {
    case "price_asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "discount":
      items.sort((a, b) => (b.discountPercent ?? -1) - (a.discountPercent ?? -1));
      break;
    default:
      items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  return items;
}

export function paginate(items: ListingView[], query: ListingQuery): Paged<ListingView> {
  const perPage = query.perPage ?? DEFAULT_PER_PAGE;
  const page = Math.max(1, query.page ?? 1);
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(items.length / perPage)),
  };
}
