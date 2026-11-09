"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heart, LayoutList, LogOut, ShieldCheck, User } from "lucide-react";
import { cn } from "cn";
import { useAuth } from "@/lib/auth/auth-context";

const links = [
  { href: "/account", label: "סקירה", icon: LayoutList, exact: true },
  { href: "/account/listings", label: "המודעות שלי", icon: LayoutList },
  { href: "/account/favorites", label: "מועדפים", icon: Heart },
  { href: "/account/profile", label: "פרופיל", icon: User },
];

export function AccountShell({ children }: { children: React.ReactNode }) {
  const { user, ready, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${pathname}`);
  }, [ready, user, router, pathname]);

  if (!ready || !user) {
    return (
      <div className="container-page py-16">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[230px_1fr]">
      <aside>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {user.displayName.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user.displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <nav className="mt-3 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="flex shrink-0 items-center gap-2 rounded-lg bg-primary-soft px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
              >
                <ShieldCheck className="size-4" />
                פאנל ניהול
              </Link>
            )}
            {links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-primary-soft font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <link.icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-destructive"
            >
              <LogOut className="size-4" />
              התנתקות
            </button>
          </nav>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
