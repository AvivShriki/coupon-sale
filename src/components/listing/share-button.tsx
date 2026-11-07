"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ title }: { title: string }) {
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // המשתמש ביטל את השיתוף — ממשיכים להעתקה ללוח
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("הקישור הועתק");
    } catch {
      toast.error("לא הצלחנו להעתיק את הקישור");
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium transition hover:bg-muted"
    >
      <Share2 className="size-4" />
      שיתוף
    </button>
  );
}
