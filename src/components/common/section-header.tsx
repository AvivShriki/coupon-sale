import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SectionHeader({
  title,
  description,
  href,
  linkLabel = "לכל המודעות",
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-xl font-extrabold sm:text-2xl">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition hover:gap-2"
        >
          {linkLabel}
          <ArrowLeft className="size-4 transition-transform" />
        </Link>
      )}
    </div>
  );
}
