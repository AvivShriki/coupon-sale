import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { CoverImage } from "@/components/common/cover-image";
import { FavoriteButton } from "@/components/listing/favorite-button";
import { PriceTag } from "@/components/listing/price-tag";
import { daysUntil, formatRelative, formatShortDate } from "@/lib/utils/format";
import type { ListingView } from "@/lib/data/types";

export function ListingCard({
  listing,
  priority = false,
}: {
  listing: ListingView;
  priority?: boolean;
}) {
  const eventDate = formatShortDate(listing.eventDate);
  const expiryDays = daysUntil(listing.expiresAt);
  const expiringSoon = expiryDays !== null && expiryDays >= 0 && expiryDays <= 14;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card-hover">
      <Link href={`/listing/${listing.id}`} className="relative block aspect-[4/3] overflow-hidden">
        {listing.cover && (
          <CoverImage
            src={listing.cover.url}
            alt={listing.cover.alt}
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <span className="absolute start-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[0.7rem] font-semibold text-foreground backdrop-blur">
          {listing.category.name}
        </span>
        {listing.discountPercent !== null && (
          <span className="absolute bottom-3 start-3 rounded-full bg-success px-2.5 py-1 text-[0.7rem] font-bold text-success-foreground shadow-sm">
            חיסכון <span className="num">{listing.discountPercent}%</span>
          </span>
        )}
        {listing.status === "sold" && (
          <span className="absolute inset-0 grid place-items-center bg-foreground/55 text-base font-bold text-background">
            נמכר
          </span>
        )}
      </Link>

      <div className="absolute end-3 top-3">
        <FavoriteButton listingId={listing.id} title={listing.title} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={`/listing/${listing.id}`} className="block">
          <h3 className="line-clamp-2 font-heading text-[0.98rem] leading-snug font-bold transition-colors group-hover:text-primary">
            {listing.title}
          </h3>
        </Link>

        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {listing.location && (
            <li className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {listing.location}
            </li>
          )}
          {eventDate && (
            <li className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {eventDate}
            </li>
          )}
          {!eventDate && expiringSoon && (
            <li className="flex items-center gap-1 font-medium text-accent-foreground">
              <Clock className="size-3.5" />
              {expiryDays === 0 ? "תוקף נגמר היום" : `תוקף ל-${expiryDays} ימים`}
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <PriceTag
            price={listing.price}
            originalPrice={listing.originalPrice}
            discountPercent={null}
          />
          <span className="shrink-0 text-[0.7rem] text-muted-foreground">
            {formatRelative(listing.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
