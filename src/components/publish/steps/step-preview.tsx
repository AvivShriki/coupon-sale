"use client";

import { ListingCard } from "@/components/listing/listing-card";
import { findById, pathChain } from "@/lib/categories";
import { fieldsForRoot } from "@/lib/categories/category-fields";
import { discountPercent } from "@/lib/utils/format";
import type { Category, ListingView } from "@/lib/data/types";
import type { ListingDraft } from "@/lib/validation/listing";

export function buildPreview(
  draft: ListingDraft,
  categories: Category[],
  sellerName: string,
): ListingView | null {
  const category = findById(categories, draft.categoryId);
  if (!category) return null;

  const chain = pathChain(categories, category.id);
  const root = chain[0];
  const images = draft.images.length
    ? draft.images
    : [`/covers/${root?.slug ?? "benefits"}-1.svg`];

  return {
    id: "preview",
    title: draft.title,
    description: draft.description,
    categoryId: category.id,
    price: Number(draft.price) || 0,
    originalPrice: draft.originalPrice ? Number(draft.originalPrice) : null,
    location: draft.location || null,
    eventDate: draft.eventDate || null,
    expiresAt: draft.expiresAt || null,
    quantity: Number(draft.quantity) || 1,
    attributes: draft.attributes,
    images: images.map((url, index) => ({
      id: `preview-${index}`,
      url,
      alt: draft.title,
      position: index,
    })),
    status: "active",
    approved: true,
    createdAt: new Date().toISOString(),
    views: 0,
    sellerId: "preview",
    contact: {
      whatsapp: draft.whatsapp,
      phone: draft.whatsapp,
      email: draft.email || null,
      preferred: draft.preferred,
    },
    transferConfirmed: draft.transferConfirmed,
    category,
    categoryPath: chain,
    seller: {
      id: "preview",
      displayName: sellerName,
      avatarUrl: null,
      memberSince: new Date().toISOString(),
      city: null,
      isVerified: false,
    },
    cover: { id: "preview-0", url: images[0], alt: draft.title, position: 0 },
    discountPercent: discountPercent(
      Number(draft.price) || 0,
      draft.originalPrice ? Number(draft.originalPrice) : null,
    ),
  };
}

export function StepPreview({
  draft,
  categories,
  sellerName,
}: {
  draft: ListingDraft;
  categories: Category[];
  sellerName: string;
}) {
  const preview = buildPreview(draft, categories, sellerName);
  if (!preview) return null;

  const fields = fieldsForRoot(preview.categoryPath[0]?.slug).filter(
    (field) => (draft.attributes[field.key] ?? "").trim(),
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-lg font-bold">תצוגה מקדימה</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          כך המודעה תיראה לקונים. אפשר לחזור אחורה ולתקן כל פרט.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-[260px_1fr]">
        <div className="max-w-[260px]">
          <ListingCard listing={preview} />
        </div>

        <dl className="space-y-2.5 text-sm">
          <Row label="קטגוריה" value={preview.categoryPath.map((c) => c.name).join(" › ")} />
          <Row label="כמות" value={String(preview.quantity)} numeric />
          {preview.location && <Row label="מיקום" value={preview.location} />}
          {preview.eventDate && <Row label="תאריך האירוע" value={draft.eventDate} numeric />}
          {preview.expiresAt && <Row label="תוקף" value={draft.expiresAt} numeric />}
          {fields.map((field) => (
            <Row
              key={field.key}
              label={field.label}
              value={`${draft.attributes[field.key]}${field.suffix ? ` ${field.suffix}` : ""}`}
            />
          ))}
          <Row label="יצירת קשר" value={`${draft.contactName} · ${draft.whatsapp}`} numeric />
        </dl>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  numeric = false,
}: {
  label: string;
  value: string;
  numeric?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-end font-medium ${numeric ? "num" : ""}`}>{value}</dd>
    </div>
  );
}
