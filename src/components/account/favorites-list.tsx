"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getListingsByIdsAction } from "@/app/account/actions";
import { useFavorites } from "@/lib/favorites";
import { ListingGrid } from "@/components/listing/listing-grid";
import { EmptyState } from "@/components/common/empty-state";
import type { ListingView } from "@/lib/data/types";

export function FavoritesList() {
  const { ids, ready } = useFavorites();
  const [listings, setListings] = useState<ListingView[] | null>(null);

  useEffect(() => {
    if (!ready) return;
    void getListingsByIdsAction(ids).then(setListings);
  }, [ids, ready]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold">המועדפים שלי</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        מודעות ששמרתם. הרשימה נשמרת בדפדפן הזה.
      </p>

      <div className="mt-6">
        {!ready || listings === null ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
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
