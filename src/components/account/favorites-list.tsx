"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useListings } from "@/lib/data/hooks";
import { useFavorites } from "@/lib/favorites";
import { ListingGrid } from "@/components/listing/listing-grid";
import { EmptyState } from "@/components/common/empty-state";
import { CardsSkeleton } from "@/components/common/cards-skeleton";

export function FavoritesList() {
  const { ids, ready } = useFavorites();
  const results = useListings({
    ids,
    status: ["active", "paused", "sold", "expired"],
    perPage: 200,
  });
  const listings = ids.length > 0 ? results.data.items : [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold">המועדפים שלי</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        מודעות ששמרתם. הרשימה נשמרת בדפדפן הזה.
      </p>

      <div className="mt-6">
        {!ready || (ids.length > 0 && results.loading) ? (
          <CardsSkeleton count={3} columns={3} />
        ) : listings.length === 0 ? (
          <EmptyState
            title="אין עדיין מועדפים"
            description="לחצו על הלב בכל מודעה כדי לשמור אותה כאן ולחזור אליה אחר כך."
            icon={<Heart className="size-6" />}
            action={
              <Link
                href="/search"
                className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                לעיון במודעות
              </Link>
            }
          />
        ) : (
          <ListingGrid listings={listings} columns={3} />
        )}
      </div>
    </div>
  );
}
