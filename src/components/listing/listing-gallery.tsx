"use client";

import { useState } from "react";
import { cn } from "cn";
import { CoverImage } from "@/components/common/cover-image";
import type { ListingImage } from "@/lib/data/types";

export function ListingGallery({
  images,
  badge,
}: {
  images: ListingImage[];
  badge?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const sorted = [...images].sort((a, b) => a.position - b.position);
  const current = sorted[index];

  if (!current) {
    return <div className="aspect-[16/10] rounded-2xl bg-muted" />;
  }

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted">
        <CoverImage
          src={current.url}
          alt={current.alt}
          sizes="(max-width: 1024px) 100vw, 680px"
          priority
        />
        {badge && <div className="absolute start-4 top-4">{badge}</div>}
      </div>

      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2">
          {sorted.map((image, imageIndex) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`תמונה ${imageIndex + 1} מתוך ${sorted.length}`}
              aria-current={imageIndex === index}
              className={cn(
                "relative aspect-[4/3] w-20 overflow-hidden rounded-lg border-2 transition",
                imageIndex === index
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <CoverImage src={image.url} alt={image.alt} sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
