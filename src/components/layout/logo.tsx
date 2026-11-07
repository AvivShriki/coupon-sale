import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label={`${site.name} – לדף הבית`}
    >
      <span className="relative grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_var(--primary)] transition-transform group-hover:-translate-y-0.5">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <path
            d="M3.5 8.5A2.5 2.5 0 0 1 6 6h12a2.5 2.5 0 0 1 2.5 2.5v1.2a2.3 2.3 0 0 0 0 4.6v1.2A2.5 2.5 0 0 1 18 18H6a2.5 2.5 0 0 1-2.5-2.5v-1.2a2.3 2.3 0 0 0 0-4.6Z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M9 15l5-6M9.5 10.2h.01M13.8 13.8h.01"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute -end-0.5 -top-0.5 size-2.5 rounded-full bg-accent" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[1.05rem] font-extrabold tracking-tight">
          Coupon<span className="text-primary">Sale</span>
        </span>
        <span className="mt-0.5 text-[0.65rem] font-medium text-muted-foreground">
          מעבירים הלאה
        </span>
      </span>
    </Link>
  );
}
