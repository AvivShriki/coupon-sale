"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { ACCEPTED_TYPES, MAX_IMAGES, resizeImage } from "@/lib/utils/image";

export function StepImages({
  images,
  onChange,
  fallbackCover,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  fallbackCover: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      toast.error(`אפשר להעלות עד ${MAX_IMAGES} תמונות`);
      return;
    }

    setBusy(true);
    const next: string[] = [];
    for (const file of Array.from(files).slice(0, room)) {
      try {
        next.push(await resizeImage(file));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "העלאת התמונה נכשלה");
      }
    }
    setBusy(false);
    if (next.length) onChange([...images, ...next]);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-lg font-bold">תמונות</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          תמונה אמיתית מגדילה משמעותית את הסיכוי למכור. עד {MAX_IMAGES} תמונות.
          אל תצלמו ברקודים או קודי מימוש.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={image.slice(-40) + index}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border"
          >
            <Image src={image} alt={`תמונה ${index + 1}`} fill unoptimized className="object-cover" />
            {index === 0 && (
              <span className="absolute start-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[0.65rem] font-bold">
                תמונה ראשית
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, position) => position !== index))}
              aria-label={`הסרת תמונה ${index + 1}`}
              className="absolute end-2 top-2 grid size-7 place-items-center rounded-full bg-background/90 text-destructive transition hover:bg-background"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <ImagePlus className="size-6" />
            )}
            {busy ? "מעבד…" : "הוספת תמונה"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        hidden
        onChange={(event) => void addFiles(event.target.files)}
      />

      {images.length === 0 && fallbackCover && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-lg">
            <Image src={fallbackCover} alt="" fill unoptimized className="object-cover" />
          </span>
          אם לא תעלו תמונה, המודעה תוצג עם תמונת ברירת המחדל של הקטגוריה.
        </div>
      )}
    </div>
  );
}
