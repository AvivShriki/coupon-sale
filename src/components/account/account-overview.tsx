"use client";

import Link from "next/link";
import { Eye, Heart, LayoutList, Plus, TrendingDown } from "lucide-react";
import { useListings } from "@/lib/data/hooks";
import { useAuth } from "@/lib/auth/auth-context";
import { useFavorites } from "@/lib/favorites";
import { ListingGrid } from "@/components/listing/listing-grid";
import { EmptyState } from "@/components/common/empty-state";
import { formatNumber } from "@/lib/utils/format";

export function AccountOverview() {
  const { user } = useAuth();
  const { ids } = useFavorites();
  const mine = useListings({
    sellerId: user?.id ?? "",
    status: ["active", "paused", "sold", "expired", "pending_review"],
    perPage: 200,
  });
  const listings = user ? mine.items : [];

  const active = listings.filter((listing) => listing.status === "active");
  const sold = listings.filter((listing) => listing.status === "sold");
  const views = listings.reduce((sum, listing) => sum + listing.views, 0);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold">שלום {user?.displayName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        כאן מנהלים את המודעות, המועדפים והפרטים שלכם.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<LayoutList className="size-4" />} label="מודעות פעילות" value={active.length} />
        <Stat icon={<Eye className="size-4" />} label="צפיות בסך הכל" value={views} />
        <Stat icon={<TrendingDown className="size-4" />} label="נמכרו" value={sold.length} />
        <Stat icon={<Heart className="size-4" />} label="מועדפים" value={ids.length} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">המודעות האחרונות שלי</h2>
          <Link
            href="/new"
            className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="size-4" />
            מודעה חדשה
          </Link>
        </div>

        {listings.length === 0 ? (
          <EmptyState
            title="עוד לא פרסמתם מודעה"
            description="יש לכם כרטיס, שובר או מנוי שלא תנצלו? זה המקום להעביר אותו הלאה."
            icon={<Plus className="size-6" />}
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
          <ListingGrid listings={listings.slice(0, 3)} columns={3} />
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
        {icon}
      </span>
      <p className="num mt-3 font-heading text-xl font-extrabold">{formatNumber(value)}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
