"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EditListingForm } from "@/components/account/edit-listing-form";
import { EmptyState } from "@/components/common/empty-state";

/**
 * מזהה המודעה מגיע כפרמטר בכתובת ולא כנתיב, כדי שלא יידרש עמוד סטטי
 * לכל מודעה באתר.
 */
export function EditListingPanel() {
  const id = useSearchParams().get("id");

  if (!id) {
    return (
      <EmptyState
        title="לא נבחרה מודעה"
        description="פתחו את העריכה מתוך רשימת המודעות שלכם."
        action={
          <Link
            href="/account/listings"
            className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            למודעות שלי
          </Link>
        }
      />
    );
  }

  return <EditListingForm listingId={id} />;
}
