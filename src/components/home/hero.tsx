import Link from "next/link";
import { Suspense } from "react";
import { Search, Sparkles } from "lucide-react";
import { SearchBox } from "@/components/layout/search-box";
import { CoverImage } from "@/components/common/cover-image";
import { PriceTag } from "@/components/listing/price-tag";
import { formatNumber } from "@/lib/utils/format";
import { site } from "@/lib/site";
import type { ListingView } from "@/lib/data/types";

export function Hero({
  featured,
  activeCount,
  categoryCount,
  averageDiscount,
}: {
  featured: ListingView[];
  activeCount: number;
  categoryCount: number;
  averageDiscount: number | null;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-primary-soft/50" />
        <div className="absolute -top-40 -start-32 size-[30rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-48 end-[-6rem] size-[32rem] rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
            <Sparkles className="size-3.5" />
            הפלטפורמה למה שכבר רכשתם ולא תנצלו
          </span>

          <h1 className="mt-5 font-heading text-[2.1rem] leading-[1.1] font-extrabold sm:text-5xl">
            {site.tagline}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {site.description}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/new"
              className="flex h-12 items-center justify-center rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground shadow-[0_14px_30px_-14px_var(--primary)] transition hover:bg-primary/90 active:translate-y-px"
            >
              פרסום מודעה
            </Link>
            <Link
              href="/search"
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-7 text-[0.95rem] font-semibold transition hover:border-primary/30 hover:bg-primary-soft"
            >
              <Search className="size-4" />
              למציאת הזדמנויות
            </Link>
          </div>

          <div className="mt-8 lg:hidden">
            <Suspense fallback={<div className="h-14 rounded-full bg-background/60" />}>
              <SearchBox size="lg" />
            </Suspense>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
            {activeCount > 0 && (
              <Stat value={formatNumber(activeCount)} label="מודעות פעילות" />
            )}
            <Stat value={formatNumber(categoryCount)} label="קטגוריות" />
            {averageDiscount !== null && (
              <Stat value={`${averageDiscount}%`} label="חיסכון ממוצע" />
            )}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="mb-6">
            <Suspense fallback={<div className="h-14 rounded-full bg-background/60" />}>
              <SearchBox size="lg" />
            </Suspense>
          </div>
          {featured.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-10">
                {featured.slice(1, 3).map((listing) => (
                  <PreviewCard key={listing.id} listing={listing} />
                ))}
              </div>
              {featured[0] && <PreviewCard listing={featured[0]} priority large />}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="num font-heading text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function PreviewCard({
  listing,
  large = false,
  priority = false,
}: {
  listing: ListingView;
  large?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block self-start overflow-hidden rounded-2xl border border-border bg-card shadow-float transition-transform duration-300 hover:-translate-y-1"
    >
      <div className={`relative ${large ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
        {listing.cover && (
          <CoverImage
            src={listing.cover.url}
            alt={listing.cover.alt}
            sizes="260px"
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-[1.05]"
          />
        )}
        {listing.discountPercent !== null && (
          <span className="absolute bottom-3 start-3 rounded-full bg-success px-2.5 py-1 text-[0.7rem] font-bold text-success-foreground">
            חיסכון <span className="num">{listing.discountPercent}%</span>
          </span>
        )}
      </div>
      <div className="p-3.5">
        <p className="line-clamp-1 text-sm font-bold">{listing.title}</p>
        <PriceTag
          price={listing.price}
          originalPrice={listing.originalPrice}
          discountPercent={null}
          className="mt-1.5"
        />
      </div>
    </Link>
  );
}
