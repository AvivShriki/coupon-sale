"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { useFavorites } from "@/lib/favorites";

export function FavoriteButton({
  listingId,
  title,
  variant = "floating",
}: {
  listingId: string;
  title: string;
  variant?: "floating" | "inline";
}) {
  const { has, toggle, ready } = useFavorites();
  const active = ready && has(listingId);

  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const added = toggle(listingId);
    toast.success(added ? "נשמר במועדפים" : "הוסר מהמועדפים", {
      description: title,
    });
  }

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition",
          active
            ? "border-destructive/30 bg-destructive/10 text-destructive"
            : "border-border bg-card hover:bg-muted",
        )}
      >
        <Heart className={cn("size-4", active && "fill-current")} />
        {active ? "שמור במועדפים" : "שמירה למועדפים"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? `הסרת ${title} מהמועדפים` : `שמירת ${title} למועדפים`}
      aria-pressed={active}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition hover:bg-background",
        active && "text-destructive",
      )}
    >
      <Heart className={cn("size-4.5", active && "fill-current")} />
    </button>
  );
}
