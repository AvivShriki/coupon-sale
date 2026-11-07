"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  CheckCircle2,
  Eye,
  Pause,
  Pencil,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { CoverImage } from "@/components/common/cover-image";
import { EmptyState } from "@/components/common/empty-state";
import {
  deleteListingAction,
  getMyListingsAction,
  setListingStatusAction,
} from "@/app/account/actions";
import { useAuth } from "@/lib/auth/auth-context";
import { formatNumber, formatPrice, formatRelative } from "@/lib/utils/format";
import type { ListingStatus, ListingView } from "@/lib/data/types";

const statusLabels: Record<ListingStatus, { label: string; className: string }> = {
  active: { label: "פעילה", className: "bg-success-soft text-success" },
  paused: { label: "מושהית", className: "bg-muted text-muted-foreground" },
  sold: { label: "נמכרה", className: "bg-primary-soft text-primary" },
  expired: { label: "פג תוקף", className: "bg-destructive/10 text-destructive" },
  pending_review: { label: "בבדיקה", className: "bg-accent/20 text-accent-foreground" },
  removed: { label: "הוסרה", className: "bg-destructive/10 text-destructive" },
};

export function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<ListingView[] | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!user) return;
    void getMyListingsAction(user.id).then(setListings);
  }, [user]);

  function refresh() {
    if (!user) return;
    void getMyListingsAction(user.id).then(setListings);
  }

  function changeStatus(listing: ListingView, status: ListingStatus) {
    if (!user) return;
    startTransition(async () => {
      const result = await setListingStatusAction(listing.id, user.id, status);
      if (result.ok) {
        toast.success(result.message);
        refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function remove(listing: ListingView) {
    if (!user) return;
    if (!window.confirm(`למחוק את המודעה "${listing.title}"? הפעולה אינה הפיכה.`)) return;
    startTransition(async () => {
      const result = await deleteListingAction(listing.id, user.id);
      if (result.ok) {
        toast.success(result.message);
        refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold">המודעות שלי</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            עריכה, השהיה, סימון כנמכרה ומחיקה.
          </p>
        </div>
        <Link
          href="/new"
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="size-4" />
          מודעה חדשה
        </Link>
      </div>

      {listings === null ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          title="אין לכם מודעות עדיין"
          description="כל כרטיס, שובר או מנוי שלא תנצלו יכול למצוא בעלים חדשים."
          action={
            <Link
              href="/new"
              className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              פרסום מודעה
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {listings.map((listing) => {
            const status = statusLabels[listing.status];
            return (
              <li
                key={listing.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center"
              >
                <Link
                  href={`/listing/${listing.id}`}
                  className="relative aspect-[16/9] w-full overflow-hidden rounded-xl sm:aspect-[4/3] sm:w-28 sm:shrink-0"
                >
                  {listing.cover && (
                    <CoverImage src={listing.cover.url} alt={listing.cover.alt} sizes="120px" />
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[0.7rem] font-bold ${status.className}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {listing.category.name} · פורסם {formatRelative(listing.createdAt)}
                    </span>
                  </div>
                  <Link href={`/listing/${listing.id}`} className="mt-1 block">
                    <h2 className="line-clamp-1 font-bold transition hover:text-primary">
                      {listing.title}
                    </h2>
                  </Link>
                  <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="num font-bold text-foreground">
                      {formatPrice(listing.price)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="size-3.5" />
                      <span className="num">{formatNumber(listing.views)}</span>
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:shrink-0">
                  <Action href={`/account/listings/${listing.id}/edit`} icon={<Pencil className="size-4" />}>
                    עריכה
                  </Action>

                  {listing.status === "active" && (
                    <>
                      <ActionButton
                        onClick={() => changeStatus(listing, "paused")}
                        disabled={pending}
                        icon={<Pause className="size-4" />}
                      >
                        השהיה
                      </ActionButton>
                      <ActionButton
                        onClick={() => changeStatus(listing, "sold")}
                        disabled={pending}
                        icon={<CheckCircle2 className="size-4" />}
                      >
                        נמכרה
                      </ActionButton>
                    </>
                  )}

                  {listing.status !== "active" && (
                    <ActionButton
                      onClick={() => changeStatus(listing, "active")}
                      disabled={pending}
                      icon={<Play className="size-4" />}
                    >
                      הפעלה
                    </ActionButton>
                  )}

                  <ActionButton
                    onClick={() => remove(listing)}
                    disabled={pending}
                    icon={<Trash2 className="size-4" />}
                    destructive
                  >
                    מחיקה
                  </ActionButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const actionClass =
  "flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium transition hover:bg-muted disabled:opacity-50";

function Action({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={actionClass}>
      {icon}
      {children}
    </Link>
  );
}

function ActionButton({
  onClick,
  icon,
  children,
  disabled,
  destructive = false,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${actionClass} ${destructive ? "text-destructive hover:bg-destructive/10" : ""}`}
    >
      {icon}
      {children}
    </button>
  );
}
