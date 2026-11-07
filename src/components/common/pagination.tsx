import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RawParams } from "@/lib/search-params";

export function Pagination({
  page,
  pageCount,
  basePath,
  params,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  params: RawParams;
}) {
  if (pageCount <= 1) return null;

  function href(target: number): string {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      const single = Array.isArray(value) ? value[0] : value;
      if (single && key !== "page") search.set(key, single);
    }
    if (target > 1) search.set("page", String(target));
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (candidate) =>
      candidate === 1 ||
      candidate === pageCount ||
      Math.abs(candidate - page) <= 1,
  );

  return (
    <nav aria-label="ניווט בין עמודים" className="mt-10 flex items-center justify-center gap-1.5">
      <PageLink href={href(page - 1)} disabled={page === 1} label="לעמוד הקודם">
        <ChevronRight className="size-4" />
      </PageLink>

      {pages.map((candidate, index) => (
        <span key={candidate} className="flex items-center gap-1.5">
          {index > 0 && candidate - pages[index - 1] > 1 && (
            <span className="px-1 text-muted-foreground">…</span>
          )}
          <Link
            href={href(candidate)}
            aria-current={candidate === page ? "page" : undefined}
            className={`num grid size-9 place-items-center rounded-lg border text-sm font-medium transition ${
              candidate === page
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            {candidate}
          </Link>
        </span>
      ))}

      <PageLink href={href(page + 1)} disabled={page === pageCount} label="לעמוד הבא">
        <ChevronLeft className="size-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled
        className="grid size-9 place-items-center rounded-lg border border-border bg-muted/50 text-muted-foreground/50"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-border bg-card transition hover:bg-muted"
    >
      {children}
    </Link>
  );
}
