"use client";

import { useState, useTransition } from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { reportListingAction } from "@/app/listing/[id]/actions";

const reasons = [
  "המודעה מטעה או שקרית",
  "הפריט אסור להעברה או למכירה",
  "מחיר לא סביר / ניסיון הונאה",
  "תוכן פוגעני",
  "המודעה כבר לא רלוונטית",
  "אחר",
];

export function ReportDialog({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await reportListingAction(formData);
      if (result.ok) {
        toast.success(result.message);
        setOpen(false);
        setReason("");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-destructive"
          />
        }
      >
        <Flag className="size-3.5" />
        דיווח על המודעה
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogTitle className="font-heading text-lg font-bold">דיווח על מודעה</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          הדיווח נשלח לצוות האתר ונבדק ידנית. אל תכללו פרטים אישיים.
        </DialogDescription>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <input type="hidden" name="listingId" value={listingId} />

          <fieldset className="space-y-1.5">
            <legend className="mb-2 text-sm font-semibold">סיבת הדיווח</legend>
            {reasons.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm transition has-checked:border-primary has-checked:bg-primary-soft"
              >
                <input
                  type="radio"
                  name="reason"
                  value={item}
                  checked={reason === item}
                  onChange={() => setReason(item)}
                  className="size-4 accent-[var(--primary)]"
                  required
                />
                {item}
              </label>
            ))}
          </fieldset>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">פירוט (לא חובה)</span>
            <textarea
              name="details"
              rows={3}
              maxLength={500}
              className="w-full rounded-lg border border-border bg-card p-3 text-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
              placeholder="מה הבעיה במודעה?"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-10 rounded-lg px-4 text-sm font-medium transition hover:bg-muted"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={pending || !reason}
              className="h-10 rounded-lg bg-destructive px-4 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "שולח…" : "שליחת דיווח"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
