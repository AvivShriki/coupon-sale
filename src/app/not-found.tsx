import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-7" />
      </span>
      <h1 className="font-heading text-2xl font-extrabold">הדף לא נמצא</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        ייתכן שהמודעה הוסרה, שהקטגוריה שונתה או שהקישור שגוי.
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/"
          className="flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          לדף הבית
        </Link>
        <Link
          href="/search"
          className="flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold transition hover:bg-muted"
        >
          לחיפוש מודעות
        </Link>
      </div>
    </div>
  );
}
