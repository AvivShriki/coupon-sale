"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Check, Flag, Lock, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { updateListing } from "@/lib/data/remote";
import { useListings, useReports } from "@/lib/data/hooks";
import { useAuth } from "@/lib/auth/auth-context";
import { EmptyState } from "@/components/common/empty-state";
import { formatPrice, formatRelative } from "@/lib/utils/format";
import type { ListingStatus, ListingView } from "@/lib/data/types";

const statusNames: Record<string, string> = {
  pending_review: "ממתינה לאישור",
  active: "פעילה",
  paused: "מושהית",
  sold: "נמכרה",
  expired: "פג תוקף",
  removed: "הוסרה",
};

export function AdminPanel() {
  const { user, ready } = useAuth();
  const [pending, startTransition] = useTransition();
  const isAdmin = user?.role === "admin";

  const queue = useListings({
    status: ["pending_review"],
    sort: "newest",
    perPage: 50,
  });
  const all = useListings({
    status: ["active", "paused", "sold", "expired", "pending_review", "removed"],
    perPage: 50,
  });
  const reports = useReports();

  if (!ready) {
    return (
      <div className="container-page py-12">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={<Lock className="size-6" />}
          title="אזור ניהול"
          description={
            user
              ? "החשבון שלך אינו חשבון ניהול. הרשאת ניהול נקבעת בשדה התפקיד של המשתמש במסד הנתונים."
              : "צריך להתחבר עם חשבון ניהול."
          }
          action={
            <Link
              href="/login?next=/admin"
              className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              התחברות
            </Link>
          }
        />
      </div>
    );
  }

  function setStatus(listing: ListingView, status: ListingStatus, message: string) {
    startTransition(async () => {
      try {
        await updateListing(listing.id, { status });
        toast.success(message);
        queue.reload();
        all.reload();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "העדכון נכשל");
      }
    });
  }

  const byStatus: Record<string, number> = {};
  for (const listing of all.data.items) {
    byStatus[listing.status] = (byStatus[listing.status] ?? 0) + 1;
  }

  return (
    <div className="container-page py-8">
      <h1 className="flex items-center gap-2 font-heading text-2xl font-extrabold">
        <ShieldCheck className="size-6 text-primary" />
        פאנל ניהול
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        כל מודעה חדשה ממתינה לאישור כאן לפני שהיא מופיעה באתר.
      </p>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-bold">
          ממתינות לאישור
          {queue.data.total > 0 && (
            <span className="num ms-2 rounded-full bg-accent px-2 py-0.5 text-sm text-accent-foreground">
              {queue.data.total}
            </span>
          )}
        </h2>

        {queue.loading ? (
          <div className="mt-3 h-24 animate-pulse rounded-2xl bg-muted" />
        ) : queue.data.items.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            אין מודעות שממתינות לאישור.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {queue.data.items.map((listing) => (
              <li
                key={listing.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/listing/${listing.id}`}
                    className="font-bold transition hover:text-primary"
                  >
                    {listing.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {listing.category.name} · {listing.seller.displayName} ·{" "}
                    <span className="num">{formatPrice(listing.price)}</span> ·{" "}
                    {formatRelative(listing.createdAt, Date.now())}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => setStatus(listing, "active", "המודעה אושרה ופורסמה")}
                    className="flex h-9 items-center gap-1.5 rounded-lg bg-success px-3 text-xs font-semibold text-success-foreground transition hover:opacity-90 disabled:opacity-50"
                  >
                    <Check className="size-4" />
                    אישור
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => setStatus(listing, "removed", "המודעה נדחתה")}
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                  >
                    <X className="size-4" />
                    דחייה
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-6">
        {Object.entries(statusNames).map(([key, label]) => (
          <div key={key} className="rounded-2xl border border-border bg-card p-4">
            <p className="num font-heading text-xl font-extrabold">{byStatus[key] ?? 0}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
          <Flag className="size-4" />
          דיווחים ({reports.data.length})
        </h2>
        {reports.data.length === 0 ? (
          <p className="mt-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            אין דיווחים פתוחים.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {reports.data.map((report) => (
              <li
                key={report.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-sm"
              >
                <div>
                  <Link
                    href={`/listing/${report.listingId}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    לצפייה במודעה
                  </Link>
                  <span className="mx-2 text-muted-foreground">{report.reason}</span>
                  {report.details && (
                    <span className="text-muted-foreground">– {report.details}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelative(report.createdAt, Date.now())}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-bold">כל המודעות</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-start text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="p-3 text-start font-semibold">כותרת</th>
                <th className="p-3 text-start font-semibold">קטגוריה</th>
                <th className="p-3 text-start font-semibold">מחיר</th>
                <th className="p-3 text-start font-semibold">סטטוס</th>
                <th className="p-3 text-start font-semibold">פעולה</th>
              </tr>
            </thead>
            <tbody>
              {all.data.items.map((listing) => (
                <tr key={listing.id} className="border-t border-border">
                  <td className="max-w-56 truncate p-3">
                    <Link href={`/listing/${listing.id}`} className="hover:text-primary">
                      {listing.title}
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">{listing.category.name}</td>
                  <td className="num p-3">{formatPrice(listing.price)}</td>
                  <td className="p-3 text-muted-foreground">
                    {statusNames[listing.status] ?? listing.status}
                  </td>
                  <td className="p-3">
                    {listing.status === "removed" ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => setStatus(listing, "active", "המודעה הוחזרה")}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs transition hover:bg-muted disabled:opacity-50"
                      >
                        החזרה
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => setStatus(listing, "removed", "המודעה הוסרה")}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                      >
                        הסרה
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
