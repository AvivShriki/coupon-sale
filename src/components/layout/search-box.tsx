"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "cn";

export function SearchBox({
  className,
  placeholder = "חפשו כרטיס, חופשה, שובר או מנוי…",
  size = "default",
}: {
  className?: string;
  placeholder?: string;
  size?: "default" | "lg";
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const query = value.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className={cn("relative flex w-full items-center", className)}
    >
      <Search
        className={cn(
          "pointer-events-none absolute start-3.5 text-muted-foreground",
          size === "lg" ? "size-5" : "size-4",
        )}
        aria-hidden
      />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="חיפוש מודעות"
        className={cn(
          "w-full rounded-full border border-border bg-card ps-10 pe-24 text-foreground shadow-sm transition placeholder:text-muted-foreground/80 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 focus:outline-none",
          size === "lg" ? "h-14 text-base ps-12" : "h-11 text-sm",
        )}
      />
      <button
        type="submit"
        className={cn(
          "absolute end-1.5 rounded-full bg-primary px-4 font-medium text-primary-foreground transition hover:bg-primary/90 active:translate-y-px",
          size === "lg" ? "h-11 text-sm" : "h-8 text-[0.8rem]",
        )}
      >
        חיפוש
      </button>
    </form>
  );
}
