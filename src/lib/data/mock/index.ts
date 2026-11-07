import { categories as seedCategories } from "@/data/seed/categories";
import { demoLocations, listings as seedListings } from "@/data/seed/listings";
import { sellers } from "@/data/seed/users";
import { withDescendantIds } from "@/lib/categories";
import { discountPercent } from "@/lib/utils/format";
import type {
  Category,
  DataSource,
  Listing,
  ListingQuery,
  ListingView,
  NewListingInput,
  Paged,
  ReportInput,
  StoredReport,
  Seller,
} from "@/lib/data/types";

/**
 * מימוש דמה של שכבת הנתונים. הנתונים נשמרים בזיכרון התהליך,
 * כך שמודעה שנוצרת נשמרת עד להפעלה מחדש של השרת.
 */
const store = {
  categories: [...seedCategories],
  listings: [...seedListings],
  sellers: [...sellers],
  reports: [] as StoredReport[],
};

const DEFAULT_PER_PAGE = 12;

function enrich(listing: Listing): ListingView {
  const chain: Category[] = [];
  let current = store.categories.find((c) => c.id === listing.categoryId) ?? null;
  while (current) {
    chain.unshift(current);
    current = current.parentId
      ? (store.categories.find((c) => c.id === current!.parentId) ?? null)
      : null;
  }
  const category = chain[chain.length - 1] ?? store.categories[0];
  const seller =
    store.sellers.find((s) => s.id === listing.sellerId) ?? store.sellers[0];
  const cover =
    [...listing.images].sort((a, b) => a.position - b.position)[0] ?? null;

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

function applyQuery(query: ListingQuery): ListingView[] {
  const statuses = query.status ?? ["active"];
  let items = store.listings.map(enrich).filter((v) => statuses.includes(v.status));

  if (query.ids) {
    const set = new Set(query.ids);
    items = items.filter((v) => set.has(v.id));
  }
  if (query.sellerId) {
    items = items.filter((v) => v.sellerId === query.sellerId);
  }
  if (query.categoryId) {
    const allowed = new Set(withDescendantIds(store.categories, query.categoryId));
    items = items.filter((v) => allowed.has(v.categoryId));
  }
  if (query.location) {
    items = items.filter((v) => v.location === query.location);
  }
  if (query.minPrice !== undefined) {
    items = items.filter((v) => v.price >= query.minPrice!);
  }
  if (query.maxPrice !== undefined) {
    items = items.filter((v) => v.price <= query.maxPrice!);
  }
  if (query.onlyDeals) {
    items = items.filter((v) => v.discountPercent !== null);
  }
  if (query.dateFrom) {
    const from = new Date(query.dateFrom).getTime();
    items = items.filter((v) => {
      const date = relevantDate(v);
      return date !== null && date >= from;
    });
  }
  if (query.dateTo) {
    const to = new Date(query.dateTo).getTime() + 86_400_000;
    items = items.filter((v) => {
      const date = relevantDate(v);
      return date !== null && date <= to;
    });
  }
  if (query.text?.trim()) {
    const terms = query.text.toLowerCase().trim().split(/\s+/);
    items = items.filter((v) => {
      const haystack = searchableText(v);
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

export const mockDataSource: DataSource = {
  async getCategories(): Promise<Category[]> {
    return store.categories;
  },

  async getCategoryByPath(path: string): Promise<Category | null> {
    return store.categories.find((c) => c.path === path) ?? null;
  },

  async getLocations(): Promise<string[]> {
    return demoLocations;
  },

  async listListings(query: ListingQuery = {}): Promise<Paged<ListingView>> {
    const all = applyQuery(query);
    const perPage = query.perPage ?? DEFAULT_PER_PAGE;
    const page = Math.max(1, query.page ?? 1);
    const start = (page - 1) * perPage;
    return {
      items: all.slice(start, start + perPage),
      total: all.length,
      page,
      perPage,
      pageCount: Math.max(1, Math.ceil(all.length / perPage)),
    };
  },

  async getListing(id: string): Promise<ListingView | null> {
    const listing = store.listings.find((l) => l.id === id);
    return listing ? enrich(listing) : null;
  },

  async getSimilarListings(id: string, limit = 4): Promise<ListingView[]> {
    const listing = store.listings.find((l) => l.id === id);
    if (!listing) return [];
    const root = listing.categoryId.split("/")[0];
    return store.listings
      .filter(
        (l) =>
          l.id !== id &&
          l.status === "active" &&
          l.categoryId.split("/")[0] === root,
      )
      .slice(0, limit)
      .map(enrich);
  },

  async registerView(id: string): Promise<void> {
    const listing = store.listings.find((l) => l.id === id);
    if (listing) listing.views += 1;
  },

  async createListing(input: NewListingInput, sellerId: string): Promise<Listing> {
    const id = `l-${(store.listings.length + 101).toString()}`;
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
    store.listings.unshift(listing);
    return listing;
  },

  async updateListing(id: string, patch: Partial<Listing>): Promise<Listing | null> {
    const index = store.listings.findIndex((l) => l.id === id);
    if (index === -1) return null;
    store.listings[index] = { ...store.listings[index], ...patch, id };
    return store.listings[index];
  },

  async deleteListing(id: string): Promise<boolean> {
    const index = store.listings.findIndex((l) => l.id === id);
    if (index === -1) return false;
    store.listings.splice(index, 1);
    return true;
  },

  async getSeller(id: string): Promise<Seller | null> {
    return store.sellers.find((s) => s.id === id) ?? null;
  },

  async reportListing(input: ReportInput): Promise<void> {
    store.reports.push({
      ...input,
      id: `r-${store.reports.length + 1}`,
      createdAt: new Date().toISOString(),
    });
  },

  async listReports(): Promise<StoredReport[]> {
    return [...store.reports].reverse();
  },
};
