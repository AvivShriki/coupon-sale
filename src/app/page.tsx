"use client";

import Link from "next/link";
import { Plus, TrendingDown } from "lucide-react";
import { categories } from "@/lib/data/hooks";
import { useCategoryCounts, useListings } from "@/lib/data/hooks";
import { mainCategories, rootOf } from "@/lib/categories";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { HowItWorks } from "@/components/home/how-it-works";
import { ListingGrid } from "@/components/listing/listing-grid";
import { SectionHeader } from "@/components/common/section-header";
import { EmptyState } from "@/components/common/empty-state";
import { CardsSkeleton } from "@/components/common/cards-skeleton";
import type { ListingView } from "@/lib/data/types";

const roots = mainCategories(categories);

export default function HomePage() {
  const latest = useListings({ sort: "newest", perPage: 8 });
  const deals = useListings({ onlyDeals: true, sort: "discount", perPage: 4 });

  const items = latest.data.items;
  const total = latest.data.total;
  const isEmpty = !latest.loading && total === 0;

  const { data: counts } = useCategoryCounts();

  // מודעות ל-Hero מקטגוריות שונות, כדי שהתצוגה לא תיראה חד-גונית
  const featured: ListingView[] = [];
  const usedRoots = new Set<string>();
  for (const listing of deals.data.items) {
    const root = rootOf(categories, listing.categoryId);
    if (!root || usedRoots.has(root.id)) continue;
    usedRoots.add(root.id);
    featured.push(listing);
    if (featured.length === 3) break;
  }

  const discounts = deals.data.items
    .map((listing) => listing.discountPercent)
    .filter((value): value is number => value !== null);
  const averageDiscount = discounts.length
    ? Math.round(discounts.reduce((sum, value) => sum + value, 0) / discounts.length)
    : null;

  return (
    <>
      <Hero
        featured={featured}
        activeCount={total}
        categoryCount={roots.length}
        averageDiscount={averageDiscount}
      />

      <section className="container-page py-14">
        <SectionHeader
          title="קטגוריות"
          description="מה שכבר רכשתם, מחולק לפי סוג"
          href="/c"
          linkLabel="כל הקטגוריות"
        />
        <CategoryGrid categories={roots} counts={counts} showCounts={total > 0} />
      </section>

      <section className="container-page pb-14">
        <SectionHeader
          title="מודעות אחרונות"
          description={isEmpty ? undefined : "מה שפורסם כאן לאחרונה"}
          href={isEmpty ? undefined : "/search"}
        />
        {latest.loading ? (
          <CardsSkeleton count={4} />
        ) : isEmpty ? (
          <EmptyState
            icon={<Plus className="size-6" />}
            title="עוד אין מודעות באתר"
            description="האתר בתחילת דרכו. יש לכם כרטיס, שובר או מנוי שלא תנצלו? תהיו הראשונים."
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
          <ListingGrid listings={items} priorityCount={4} />
        )}
      </section>

      {deals.data.items.length > 0 && (
        <section className="border-y border-border/60 bg-success-soft/40 py-14">
          <div className="container-page">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 font-heading text-xl font-extrabold sm:text-2xl">
                  <span className="grid size-9 place-items-center rounded-xl bg-success text-success-foreground">
                    <TrendingDown className="size-5" />
                  </span>
                  אזור ההזדמנויות
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  מודעות שבהן המחיר המבוקש נמוך מהמחיר שהמוכר שילם
                </p>
              </div>
              <Link
                href="/search?deals=1&sort=discount"
                className="shrink-0 text-sm font-semibold text-success transition hover:underline"
              >
                לכל ההזדמנויות
              </Link>
            </div>
            <ListingGrid listings={deals.data.items} />
          </div>
        </section>
      )}

      <HowItWorks />
    </>
  );
}
