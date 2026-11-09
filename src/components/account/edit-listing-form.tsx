"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { StepDetails } from "@/components/publish/steps/step-details";
import { EmptyState } from "@/components/common/empty-state";
import { getListing, updateListing } from "@/lib/data/remote";
import { useAuth } from "@/lib/auth/auth-context";
import { rootOf } from "@/lib/categories";
import { fieldsForRoot } from "@/lib/categories/category-fields";
import {
  emptyDraft,
  validateDetails,
  type Errors,
  type ListingDraft,
} from "@/lib/validation/listing";
import { categories, useLocations } from "@/lib/data/hooks";

export function EditListingForm({ listingId }: { listingId: string }) {
  const { user, ready } = useAuth();
  const locations = useLocations();
  const router = useRouter();
  const [draft, setDraft] = useState<ListingDraft | null>(null);
  const [missing, setMissing] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!ready || !user) return;
    let active = true;

    void getListing(listingId)
      .then((listing) => {
        if (!active) return;
        if (!listing || listing.sellerId !== user.id) {
          setMissing(true);
          return;
        }
        setDraft({
          ...emptyDraft,
          categoryId: listing.categoryId,
          title: listing.title,
          description: listing.description,
          price: String(listing.price),
          originalPrice: listing.originalPrice ? String(listing.originalPrice) : "",
          location: listing.location ?? "",
          eventDate: listing.eventDate ? listing.eventDate.slice(0, 10) : "",
          expiresAt: listing.expiresAt ? listing.expiresAt.slice(0, 10) : "",
          quantity: String(listing.quantity),
          attributes: Object.fromEntries(
            Object.entries(listing.attributes).map(([key, value]) => [
              key,
              value === null ? "" : String(value),
            ]),
          ),
        });
      })
      .catch(() => setMissing(true));

    return () => {
      active = false;
    };
  }, [listingId, ready, user]);

  if (ready && !user) {
    return (
      <EmptyState
        title="צריך להתחבר"
        description="אפשר לערוך רק מודעות של החשבון שלך."
        action={
          <Link
            href="/login?next=/account/listings"
            className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            התחברות
          </Link>
        }
      />
    );
  }

  if (missing) {
    return (
      <EmptyState
        title="המודעה לא נמצאה"
        description="ייתכן שהיא נמחקה, או שהיא שייכת למשתמש אחר."
        action={
          <Link
            href="/account/listings"
            className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            חזרה למודעות שלי
          </Link>
        }
      />
    );
  }

  if (!draft) {
    return <div className="h-96 animate-pulse rounded-2xl bg-muted" />;
  }

  const root = rootOf(categories, draft.categoryId);
  const fields = fieldsForRoot(root?.slug);

  function set<K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  function setAttribute(key: string, value: string) {
    setDraft((current) =>
      current ? { ...current, attributes: { ...current.attributes, [key]: value } } : current,
    );
  }

  function save() {
    if (!draft || !user) return;
    const found = validateDetails(draft, fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("יש להשלים את השדות המסומנים");
      return;
    }

    startTransition(async () => {
      try {
        await updateListing(listingId, {
        title: draft.title.trim(),
        description: draft.description.trim(),
        price: Number(draft.price),
        originalPrice: draft.originalPrice ? Number(draft.originalPrice) : null,
        location: draft.location.trim() || null,
        eventDate: draft.eventDate || null,
        expiresAt: draft.expiresAt || null,
        quantity: Number(draft.quantity),
          attributes: draft.attributes,
        });
        toast.success("השינויים נשמרו");
        router.push("/account/listings");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "השמירה נכשלה");
      }
    });
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/account/listings"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary"
      >
        <ArrowRight className="size-4" />
        חזרה למודעות שלי
      </Link>

      <h1 className="mt-3 font-heading text-2xl font-extrabold">עריכת מודעה</h1>

      <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7">
        <StepDetails
          draft={draft}
          errors={errors}
          fields={fields}
          locations={locations}
          set={set}
          setAttribute={setAttribute}
        />

        <div className="mt-8 flex justify-end gap-3 border-t border-border pt-5">
          <Link
            href="/account/listings"
            className="flex h-11 items-center rounded-full px-4 text-sm font-medium transition hover:bg-muted"
          >
            ביטול
          </Link>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            שמירת שינויים
          </button>
        </div>
      </div>
    </div>
  );
}
