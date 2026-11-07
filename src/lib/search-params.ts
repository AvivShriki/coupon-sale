import type { ListingQuery, ListingSort } from "@/lib/data/types";

export type RawParams = Record<string, string | string[] | undefined>;

const sorts: ListingSort[] = ["newest", "price_asc", "price_desc", "discount"];

export const sortLabels: Record<ListingSort, string> = {
  newest: "פורסם לאחרונה",
  price_asc: "מחיר: מהנמוך לגבוה",
  price_desc: "מחיר: מהגבוה לנמוך",
  discount: "אחוז ההנחה הגבוה ביותר",
};

function single(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

/** פרמטרים ב-URL → שאילתה לשכבת הנתונים. ה-URL הוא מקור האמת של הסינון. */
export function parseSearchParams(params: RawParams, perPage = 12): ListingQuery {
  const sort = single(params.sort);
  return {
    text: single(params.q),
    categoryId: single(params.cat),
    location: single(params.loc),
    minPrice: toNumber(single(params.min)),
    maxPrice: toNumber(single(params.max)),
    dateFrom: single(params.from),
    dateTo: single(params.to),
    onlyDeals: single(params.deals) === "1",
    sellerId: single(params.seller),
    sort: sorts.includes(sort as ListingSort) ? (sort as ListingSort) : "newest",
    page: toNumber(single(params.page)) || 1,
    perPage,
  };
}

/** שאילתה → מחרוזת URL, בלי ערכים ריקים */
export function buildSearchHref(
  base: string,
  query: Partial<Record<string, string | number | boolean | undefined>>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "" || value === false) continue;
    params.set(key, value === true ? "1" : String(value));
  }
  const search = params.toString();
  return search ? `${base}?${search}` : base;
}

export function queryToParams(query: ListingQuery, extra: Record<string, string | number | undefined> = {}) {
  return {
    q: query.text,
    cat: query.categoryId,
    loc: query.location,
    min: query.minPrice,
    max: query.maxPrice,
    from: query.dateFrom,
    to: query.dateTo,
    deals: query.onlyDeals,
    seller: query.sellerId,
    sort: query.sort === "newest" ? undefined : query.sort,
    ...extra,
  };
}

/** כמה מסננים פעילים כרגע — להצגת מונה ליד כפתור הסינון */
export function activeFilterCount(query: ListingQuery, ignoreCategory = false): number {
  let count = 0;
  if (query.text) count++;
  if (query.categoryId && !ignoreCategory) count++;
  if (query.location) count++;
  if (query.minPrice !== undefined) count++;
  if (query.maxPrice !== undefined) count++;
  if (query.dateFrom) count++;
  if (query.dateTo) count++;
  if (query.onlyDeals) count++;
  return count;
}
