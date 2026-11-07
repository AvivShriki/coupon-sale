import { z } from "zod";
import type { CategoryField } from "@/lib/categories/category-fields";
import type { ContactMethod } from "@/lib/data/types";

export interface ListingDraft {
  categoryId: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  location: string;
  eventDate: string;
  expiresAt: string;
  quantity: string;
  attributes: Record<string, string>;
  images: string[];
  contactName: string;
  whatsapp: string;
  phone: string;
  email: string;
  preferred: ContactMethod;
  transferConfirmed: boolean;
  notProhibited: boolean;
  termsAccepted: boolean;
}

export const emptyDraft: ListingDraft = {
  categoryId: "",
  title: "",
  description: "",
  price: "",
  originalPrice: "",
  location: "",
  eventDate: "",
  expiresAt: "",
  quantity: "1",
  attributes: {},
  images: [],
  contactName: "",
  whatsapp: "",
  phone: "",
  email: "",
  preferred: "whatsapp",
  transferConfirmed: false,
  notProhibited: false,
  termsAccepted: false,
};

export type Errors = Record<string, string>;

const phonePattern = /^0\d{1,2}-?\d{7}$|^0\d{9}$/;

export function normalizePhone(value: string): string {
  return value.replace(/[\s-]/g, "");
}

export function validateCategory(draft: ListingDraft): Errors {
  if (!draft.categoryId || !draft.categoryId.includes("/")) {
    return { categoryId: "יש לבחור קטגוריה ותת-קטגוריה" };
  }
  return {};
}

export function validateDetails(draft: ListingDraft, fields: CategoryField[]): Errors {
  const errors: Errors = {};

  if (draft.title.trim().length < 6) errors.title = "כותרת קצרה מדי – לפחות 6 תווים";
  if (draft.title.trim().length > 80) errors.title = "כותרת ארוכה מדי – עד 80 תווים";
  if (draft.description.trim().length < 20)
    errors.description = "תיאור קצר מדי – לפחות 20 תווים, כדי שהקונה יבין מה הוא מקבל";

  const price = Number(draft.price);
  if (!draft.price || !Number.isFinite(price) || price <= 0)
    errors.price = "יש להזין מחיר מבוקש";
  else if (price > 200000) errors.price = "המחיר נראה גבוה מדי";

  if (draft.originalPrice) {
    const original = Number(draft.originalPrice);
    if (!Number.isFinite(original) || original <= 0)
      errors.originalPrice = "מחיר מקורי לא תקין";
    else if (original < price)
      errors.originalPrice = "המחיר המקורי צריך להיות גבוה מהמחיר המבוקש";
  }

  const quantity = Number(draft.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50)
    errors.quantity = "כמות בין 1 ל-50";

  if (draft.eventDate && draft.expiresAt && draft.expiresAt < draft.eventDate)
    errors.expiresAt = "התוקף לא יכול להסתיים לפני תאריך האירוע";

  for (const field of fields) {
    const value = (draft.attributes[field.key] ?? "").trim();
    if (field.required && !value) {
      errors[`attr.${field.key}`] = `יש למלא ${field.label}`;
      continue;
    }
    if (value && field.type === "number" && !Number.isFinite(Number(value))) {
      errors[`attr.${field.key}`] = "יש להזין מספר";
    }
  }

  return errors;
}

export function validateContact(draft: ListingDraft): Errors {
  const errors: Errors = {};
  if (draft.contactName.trim().length < 2) errors.contactName = "יש להזין שם ליצירת קשר";

  const whatsapp = normalizePhone(draft.whatsapp);
  if (!whatsapp) errors.whatsapp = "יש להזין מספר טלפון לוואטסאפ";
  else if (!phonePattern.test(draft.whatsapp.trim()))
    errors.whatsapp = "מספר לא תקין – לדוגמה 052-5550147";

  if (draft.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(draft.email))
    errors.email = "כתובת אימייל לא תקינה";

  return errors;
}

export function validateTerms(draft: ListingDraft): Errors {
  const errors: Errors = {};
  if (!draft.transferConfirmed)
    errors.transferConfirmed = "יש לאשר שאתם רשאים להעביר את הפריט";
  if (!draft.notProhibited)
    errors.notProhibited = "יש לאשר שהפריט אינו ברשימת הפריטים האסורים";
  if (!draft.termsAccepted) errors.termsAccepted = "יש לאשר את תנאי הפרסום";
  return errors;
}

/** אימות מלא בצד השרת — ה-UI לעולם לא הגורם היחיד שמאמת */
export const newListingSchema = z.object({
  categoryId: z.string().min(3).includes("/"),
  title: z.string().trim().min(6).max(80),
  description: z.string().trim().min(20).max(4000),
  price: z.number().positive().max(200000),
  originalPrice: z.number().positive().max(500000).nullable(),
  location: z.string().trim().max(60).nullable(),
  eventDate: z.string().nullable(),
  expiresAt: z.string().nullable(),
  quantity: z.number().int().min(1).max(50),
  attributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
  images: z.array(z.string().max(4_000_000)).max(5),
  contact: z.object({
    whatsapp: z.string().min(9).max(20),
    phone: z.string().min(9).max(20).nullable(),
    email: z.string().email().nullable(),
    preferred: z.enum(["whatsapp", "phone", "email"]),
  }),
  transferConfirmed: z.literal(true),
});

export type NewListingPayload = z.infer<typeof newListingSchema>;
