"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, LogIn, Menu, Plus, Search, User, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/common/category-icon";
import { Logo } from "@/components/layout/logo";
import { useAuth } from "@/lib/auth/auth-context";
import type { Category } from "@/lib/data/types";

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-lg" aria-label="תפריט" className="lg:hidden" />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[86%] max-w-sm gap-0 overflow-y-auto p-0"
      >
        <SheetTitle className="sr-only">תפריט ניווט</SheetTitle>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <Logo />
          <Button variant="ghost" size="icon-sm" onClick={close} aria-label="סגירת התפריט">
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          <MenuLink href="/new" onClick={close} icon={<Plus className="size-4" />} highlight>
            פרסום מודעה
          </MenuLink>
          <MenuLink href="/search" onClick={close} icon={<Search className="size-4" />}>
            חיפוש הזדמנויות
          </MenuLink>
          <MenuLink href="/account/favorites" onClick={close} icon={<Heart className="size-4" />}>
            המועדפים שלי
          </MenuLink>
          {user ? (
            <MenuLink href="/account" onClick={close} icon={<User className="size-4" />}>
              האזור האישי
            </MenuLink>
          ) : (
            <MenuLink href="/login" onClick={close} icon={<LogIn className="size-4" />}>
              התחברות / הרשמה
            </MenuLink>
          )}
        </nav>

        <div className="border-t p-3">
          <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground">קטגוריות</p>
          <div className="flex flex-col">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/c/${category.path}`}
                onClick={close}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition hover:bg-muted"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
                  <CategoryIcon name={category.icon} className="size-4" />
                </span>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MenuLink({
  href,
  children,
  icon,
  onClick,
  highlight = false,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        highlight
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "hover:bg-muted"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
