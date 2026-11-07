/**
 * מודל הנתונים של המערכת.
 * המבנה כאן תואם אחד-לאחד לטבלאות ב-supabase/migrations/0001_init.sql,
 * כדי שהמעבר ממצב דמה ל-Postgres לא ידרוש שינוי ברכיבי ה-UI.
 */

export type ListingStatus =
  | "active"
  | "paused"
  | "sold"
  | "expired"
  | "pending_review"
  | "removed";

export type ContactMethod = "whatsapp" | "phone" | "email";

export interface Category {
  /** מזהה פנימי. במצב דמה זהה למסלול (entertainment/concerts) */
  id: string;
  parentId: string | null;
  slug: string;
  name: string;
  /** שם אייקון מתוך CategoryIcon */
  icon: string;
  order: number;
  /** מסלול מלא, משמש ל-URL: /c/entertainment/concerts */
  path: string;
}

export interface ListingImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface Seller {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  memberSince: string;
  city: string | null;
  isVerified: boolean;
}

export interface ListingContact {
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  preferred: ContactMethod;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  /** תת-הקטגוריה (עלה בעץ) */
  categoryId: string;
  /** מחיר מבוקש, בשקלים */
  price: number;
  /** מחיר מקורי — לא חובה */
  originalPrice: number | null;
  location: string | null;
  /** תאריך האירוע, אם רלוונטי */
  eventDate: string | null;
  /** תוקף / מועד תפוגה */
  expiresAt: string | null;
  quantity: number;
  /** שדות נוספים לפי הקטגוריה (listings.attributes ב-JSONB) */
  attributes: Record<string, string | number | boolean | null>;
  images: ListingImage[];
  status: ListingStatus;
  createdAt: string;
  views: number;
  sellerId: string;
  contact: ListingContact;
  /** המוכר הצהיר שהוא רשאי להעביר את הפריט */
  transferConfirmed: boolean;
}

/** מודעה מועשרת — מה שרכיבי ה-UI מקבלים */
export interface ListingView extends Listing {
  category: Category;
  /** מהקטגוריה הראשית עד העלה */
  categoryPath: Category[];
  seller: Seller;
  cover: ListingImage | null;
  /** אחוז הנחה מחושב, null אם אין מחיר מקורי */
  discountPercent: number | null;
}

export type ListingSort = "newest" | "price_asc" | "price_desc" | "discount";

export interface ListingQuery {
  text?: string;
  /** כולל את כל תתי-הקטגוריות שמתחתיה */
  categoryId?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  /** סינון לפי תאריך אירוע / תוקף */
  dateFrom?: string;
  dateTo?: string;
  /** רק מודעות שבהן המחיר המבוקש נמוך מהמקורי */
  onlyDeals?: boolean;
  sellerId?: string;
  ids?: string[];
  status?: ListingStatus[];
  sort?: ListingSort;
  page?: number;
  perPage?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
}

export interface NewListingInput {
  title: string;
  description: string;
  categoryId: string;
  price: number;
  originalPrice: number | null;
  location: string | null;
  eventDate: string | null;
  expiresAt: string | null;
  quantity: number;
  attributes: Record<string, string | number | boolean | null>;
  images: { url: string; alt: string }[];
  contact: ListingContact;
  transferConfirmed: boolean;
}

export interface StoredReport extends ReportInput {
  id: string;
  createdAt: string;
}

export interface ReportInput {
  listingId: string;
  reason: string;
  details: string | null;
  reporterId: string | null;
}
