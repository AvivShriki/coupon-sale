"use client";

import Link from "next/link";
import { Heart, LogIn, User } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { useFavorites } from "@/lib/favorites";

export function HeaderUserActions() {
  const { user, ready } = useAuth();
  const { ids, ready: favoritesReady } = useFavorites();

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/account/favorites"
        aria-label="המועדפים שלי"
        className="relative hidden size-10 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground sm:grid"
      >
        <Heart className="size-5" />
        {favoritesReady && ids.length > 0 && (
          <span className="num absolute -end-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.65rem] font-bold text-accent-foreground">
            {ids.length}
          </span>
        )}
      </Link>

      {/* עד שה-localStorage נקרא מוצג מצב ניטרלי, כדי שלא יהיה הבהוב בין אורח למחובר */}
      {!ready ? (
        <span className="hidden h-10 w-24 animate-pulse rounded-full bg-muted sm:block" />
      ) : user ? (
        <Link
          href="/account"
          className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pe-3 ps-1 text-sm font-medium transition hover:border-primary/30 hover:bg-primary-soft"
        >
          <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {user.displayName.trim().charAt(0) || <User className="size-4" />}
          </span>
          <span className="hidden max-w-24 truncate sm:block">{user.displayName}</span>
        </Link>
      ) : (
        <Link
          href="/login"
          className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <LogIn className="size-4" />
          <span className="hidden sm:block">התחברות</span>
        </Link>
      )}
    </div>
  );
}
