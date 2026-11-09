"use client";

import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  Clock,
  Eye,
  Hash,
  Info,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { fieldsForRoot } from "@/lib/categories/category-fields";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ListingGallery } from "@/components/listing/listing-gallery";
import { PriceTag } from "@/components/listing/price-tag";
import { FavoriteButton } from "@/components/listing/favorite-button";
import { ShareButton } from "@/components/listing/share-button";
import { ReportDialog } from "@/components/listing/report-dialog";
import { ViewTracker } from "@/components/listing/view-tracker";
import { ListingGrid } from "@/components/listing/listing-grid";
import { SectionHeader } from "@/components/common/section-header";
import {
  daysUntil,
  formatDate,
  formatNumber,
  formatRelative,
  whatsappLink,
} from "@/lib/utils/format";
import { site } from "@/lib/site";

import { useListing, useSimilarListings } from "@/lib/data/hooks";
import { EmptyState } from "@/components/common/empty-state";

export function ListingDetail({ id }: { id: string }) {
  const { data: listing, loading } = useListing(id);
  const { data: similar } = useSimilarListings(id, 4);

  if (loading) {
    return (
      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="aspect-[16/10] animate-pulse rounded-2xl bg-muted" />
          <div className="h-72 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="המודעה לא נמצאה"
          description="ייתכן שהיא נמחקה או שהקישור שגוי."
          action={
            <Link
              href="/search"
              className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              לחיפוש מודעות
            </Link>
          }
        />
      </div>
    );
  }

  const rootSlug = listing.categoryPath[0]?.slug;
  const fields = fieldsForRoot(rootSlug).filter(
    (field) =>
      listing.attributes[field.key] !== undefined &&
      listing.attributes[field.key] !== null &&
      listing.attributes[field.key] !== "",
  );

  const expiryDays = daysUntil(listing.expiresAt);
  const eventDate = formatDate(listing.eventDate);
  const isActive = listing.status === "active";

  const message = `שלום, ראיתי את המודעה "${listing.title}" ב-${site.name} והיא מעניינת אותי. האם היא עדיין זמינה?`;

  return (
    <div className="container-page py-6">
      <ViewTracker listingId={listing.id} />

      <Breadcrumbs
        items={[
          ...listing.categoryPath.map((category) => ({
            label: category.name,
            href: `/c/${category.path}`,
          })),
          { label: listing.title },
        ]}
      />

      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <ListingGallery
            images={listing.images}
            badge={
              listing.discountPercent !== null ? (
                <span className="rounded-full bg-success px-3 py-1 text-xs font-bold text-success-foreground">
                  חיסכון <span className="num">{listing.discountPercent}%</span>
                </span>
              ) : undefined
            }
          />

          <h1 className="mt-6 font-heading text-2xl leading-tight font-extrabold sm:text-3xl">
            {listing.title}
          </h1>

          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {listing.location && (
              <Meta icon={<MapPin className="size-4" />}>{listing.location}</Meta>
            )}
            {eventDate && (
              <Meta icon={<CalendarDays className="size-4" />}>{eventDate}</Meta>
            )}
            {expiryDays !== null && !eventDate && (
              <Meta icon={<Clock className="size-4" />}>
                {expiryDays >= 0
                  ? `בתוקף עוד ${expiryDays} ימים`
                  : "התוקף פג"}
              </Meta>
            )}
            <Meta icon={<Hash className="size-4" />}>
              <span className="num">{listing.quantity}</span> יחידות
            </Meta>
            <Meta icon={<Eye className="size-4" />}>
              <span className="num">{formatNumber(listing.views)}</span> צפיות
            </Meta>
            <Meta icon={<Clock className="size-4" />}>
              פורסם {formatRelative(listing.createdAt)}
            </Meta>
          </ul>

          <section className="mt-7">
            <h2 className="font-heading text-lg font-bold">תיאור</h2>
            <p className="mt-2 leading-relaxed whitespace-pre-line text-foreground/90">
              {listing.description}
            </p>
          </section>

          {fields.length > 0 && (
            <section className="mt-7">
              <h2 className="font-heading text-lg font-bold">פרטי הפריט</h2>
              <dl className="mt-3 grid gap-x-6 gap-y-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
                {fields.map((field) => {
                  const raw = listing.attributes[field.key];
                  const value =
                    field.type === "date"
                      ? (formatDate(String(raw)) ?? String(raw))
                      : String(raw);
                  return (
                    <div key={field.key} className="flex justify-between gap-3 border-b border-border/60 pb-2 last:border-0 sm:last:border-b-0">
                      <dt className="text-sm text-muted-foreground">{field.label}</dt>
                      <dd className="text-sm font-semibold">
                        <span className={field.type === "number" ? "num" : undefined}>
                          {value}
                        </span>
                        {field.suffix ? ` ${field.suffix}` : ""}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          )}

          <section className="mt-7 flex gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4">
            <Info className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
            <div className="text-sm leading-relaxed text-accent-foreground">
              <p className="font-semibold">לפני שסוגרים עסקה</p>
              <p className="mt-1">
                {site.offPlatformNotice} ודאו מול בית העסק או המפיק שהפריט אכן ניתן
                להעברה, ואל תעבירו תשלום לפני שקיבלתם את הפריט או אישור העברה.
              </p>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-36 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <PriceTag
              price={listing.price}
              originalPrice={listing.originalPrice}
              discountPercent={listing.discountPercent}
              size="lg"
            />

            {isActive ? (
              <>
                <a
                  href={whatsappLink(listing.contact.whatsapp ?? "", message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-success text-[0.95rem] font-semibold text-success-foreground transition hover:opacity-90 active:translate-y-px"
                >
                  <MessageCircle className="size-5" />
                  יצירת קשר בוואטסאפ
                </a>
                {listing.contact.phone && (
                  <a
                    href={`tel:${listing.contact.phone.replace(/\D/g, "")}`}
                    className="num mt-2 flex h-11 w-full items-center justify-center rounded-full border border-border text-sm font-medium transition hover:bg-muted"
                  >
                    {listing.contact.phone}
                  </a>
                )}
              </>
            ) : (
              <p className="mt-5 rounded-xl bg-muted px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                {listing.status === "sold" ? "המודעה נמכרה" : "המודעה אינה פעילה כרגע"}
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <FavoriteButton listingId={listing.id} title={listing.title} variant="inline" />
              <ShareButton title={listing.title} />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {site.offPlatformNotice}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold">פרטי המוכר</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                {listing.seller.displayName.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1 font-semibold">
                  {listing.seller.displayName}
                  {listing.seller.isVerified && (
                    <BadgeCheck className="size-4 text-primary" aria-label="מוכר מאומת" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {listing.seller.city ? `${listing.seller.city} · ` : ""}
                  חבר מאז {formatDate(listing.seller.memberSince)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link
                href={`/search?seller=${listing.seller.id}`}
                className="text-xs font-medium text-primary transition hover:underline"
              >
                כל המודעות של המוכר
              </Link>
              <ReportDialog listingId={listing.id} />
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <SectionHeader
            title="מודעות דומות"
            href={`/c/${listing.categoryPath[0]?.path ?? ""}`}
            linkLabel="לכל הקטגוריה"
          />
          <ListingGrid listings={similar} />
        </section>
      )}
    </div>
  );
}

function Meta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5">
      {icon}
      {children}
    </li>
  );
}
