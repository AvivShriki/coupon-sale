"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";
import { ListingDetail } from "@/components/listing/listing-detail";

/**
 * באתר סטטי נוצר עמוד רק למודעות שקיימות בזמן הבנייה. מודעה שפורסמה
 * בדפדפן מקבלת מזהה חדש, ולכן השרת מחזיר את דף ה-404 — וכאן מזהים
 * את הכתובת ומציגים את המודעה מתוך הנתונים המקומיים.
 */
export function NotFoundView() {
  const [listingId, setListingId] = useState<string | null>(null);

  useEffect(() => {
    const match = window.location.pathname.match(/^\/listing\/([^/]+)\/?$/);
    if (match) setListingId(decodeURIComponent(match[1]));
  }, []);

  if (listingId) {
    return <ListingDetail id={listingId} />;
  }

  return (
    <div className="container-page flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-7" />
      </span>
      <h1 className="font-heading text-2xl font-extrabold">הדף לא נמצא</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        ייתכן שהמודעה הוסרה, שהקטגוריה שונתה או שהקישור שגוי.
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/"
          className="flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          לדף הבית
        </Link>
        <Link
          href="/search"
          className="flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold transition hover:bg-muted"
        >
          לחיפוש מודעות
        </Link>
      </div>
    </div>
  );
}
