"use server";

import { db } from "@/lib/data";

export async function registerViewAction(listingId: string) {
  await db.registerView(listingId);
}

const reasons = [
  "המודעה מטעה או שקרית",
  "הפריט אסור להעברה או למכירה",
  "מחיר לא סביר / ניסיון הונאה",
  "תוכן פוגעני",
  "המודעה כבר לא רלוונטית",
  "אחר",
] as const;

export type ReportReason = (typeof reasons)[number];

export async function reportListingAction(formData: FormData) {
  const listingId = String(formData.get("listingId") ?? "");
  const reason = String(formData.get("reason") ?? "");
  const details = String(formData.get("details") ?? "").trim();

  if (!listingId || !reasons.includes(reason as ReportReason)) {
    return { ok: false, message: "יש לבחור סיבת דיווח" };
  }

  await db.reportListing({
    listingId,
    reason,
    details: details || null,
    reporterId: null,
  });

  return { ok: true, message: "הדיווח נשלח. צוות האתר יבדוק את המודעה." };
}
