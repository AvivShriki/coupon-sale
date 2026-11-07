"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Flag, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { updateListing } from "@/lib/data/local";
import { useListings, useReports } from "@/lib/data/hooks";
import { useAuth } from "@/lib/auth/auth-context";
import { EmptyState } from "@/components/common/empty-state";
import { formatPrice, formatRelative } from "@/lib/utils/format";

// תוויות לכרטיסי הסיכום (רבים) ולטבלה (יחיד)
const statusNames: Record<string, string> = {
  active: "פעילות",
  paused: "מושהות",
  sold: "נמכרו",
  expired: "פג תוקף",
  pending_review: "בבדיקה",
  removed: "הוסרו",
};

const statusNameSingular: Record<string, string> = {
  active: "פעילה",
  paused: "מושהית",
  sold: "נמכרה",
  expired: "פג תוקף",
  pending_review: "בבדיקה",
  removed: "הוסרה",
};

export function AdminPanel() {
  const { user, ready } = useAuth();
  const [pending, startTransition] = useTransition();
  const isAdmin = user?.role === "admin";

  const all = useListings({
    status: ["active", "paused", "sold", "expired", "pending_review", "removed"],
    perPage: 1000,
  });
  const reports = useReports();

  const byStatus: Record<string, number> = {};
  for (const listing of all.items) {
    byStatus[listing.status] = (byStatus[listing.status] ?? 0) + 1;
  }

  if (!ready) {
    return <div className="container-page py-12"><div className="h-64 animate-pulse rounded-2xl bg-muted" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={<Lock className="size-6" />}
          title="אזור ניהול"
          description={
            user
              ? "החשבון שלך אינו חשבון ניהול. בגרסת ההדגמה אפשר להתחבר עם כתובת שמתחילה ב-admin@ כדי לראות את הפאנל. בגרסה האמיתית ההרשאה תיקבע לפי תפקיד המשתמש ב-Supabase."
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

  function setStatus(listingId: string, status: "active" | "removed") {
    if (!isAdmin) return;
    startTransition(() => {
      updateListing(listingId, { status });
      toast.success("סטטוס המודעה עודכן");
    });
  }

  return (
    <div className="container-page py-8">
      <h1 className="flex items-center gap-2 font-heading text-2xl font-extrabold">
        <ShieldCheck className="size-6 text-primary" />
        פאנל ניהול
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        תשתית ראשונית: מעקב אחר מודעות ודיווחים. ניהול קטגוריות ומשתמשים ייפתח עם
        חיבור Supabase.
      </p>

      <>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Object.entries(statusNames).map(([key, label]) => (
              <div key={key} className="rounded-2xl border border-border bg-card p-4">
                <p className="num font-heading text-xl font-extrabold">
                  {byStatus[key] ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <section className="mt-8">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
              <Flag className="size-4" />
              דיווחים ({reports.length})
            </h2>
            {reports.length === 0 ? (
              <p className="mt-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                אין דיווחים פתוחים.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {reports.map((report) => (
                  <li
                    key={report.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-sm"
                  >
                    <div>
                      <Link
                        href={`/listing/${report.listingId}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {report.listingId}
                      </Link>
                      <span className="mx-2 text-muted-foreground">{report.reason}</span>
                      {report.details && (
                        <span className="text-muted-foreground">– {report.details}</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatRelative(report.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-8">
            <h2 className="font-heading text-lg font-bold">מודעות אחרונות</h2>
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
                  {all.items.slice(0, 12).map((listing) => (
                    <tr key={listing.id} className="border-t border-border">
                      <td className="max-w-56 truncate p-3">
                        <Link href={`/listing/${listing.id}`} className="hover:text-primary">
                          {listing.title}
                        </Link>
                      </td>
                      <td className="p-3 text-muted-foreground">{listing.category.name}</td>
                      <td className="num p-3">{formatPrice(listing.price)}</td>
                      <td className="p-3 text-muted-foreground">
                        {statusNameSingular[listing.status] ?? listing.status}
                      </td>
                      <td className="p-3">
                        {listing.status === "removed" ? (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => setStatus(listing.id, "active")}
                            className="rounded-lg border border-border px-2.5 py-1 text-xs transition hover:bg-muted disabled:opacity-50"
                          >
                            החזרה
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => setStatus(listing.id, "removed")}
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
      </>
    </div>
  );
}
