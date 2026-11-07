import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { db } from "@/lib/data";
import { mainCategories } from "@/lib/categories";
import { CategoryIcon } from "@/components/common/category-icon";
import { Logo } from "@/components/layout/logo";
import { SearchBox } from "@/components/layout/search-box";
import { HeaderUserActions } from "@/components/layout/account-link";
import { MobileMenu } from "@/components/layout/mobile-menu";

export async function SiteHeader() {
  const categories = await db.getCategories();
  const roots = mainCategories(categories);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-16 items-center gap-3">
          <Logo />

          <Suspense fallback={<div className="mx-auto hidden h-11 max-w-xl flex-1 rounded-full bg-muted md:block" />}>
            <SearchBox className="mx-auto hidden max-w-xl flex-1 md:flex" />
          </Suspense>

          <div className="ms-auto flex items-center gap-1.5 md:ms-0">
            <Link
              href="/new"
              className="flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-10px_var(--primary)] transition hover:bg-primary/90 active:translate-y-px"
            >
              <Plus className="size-4" />
              <span className="hidden sm:block">פרסום מודעה</span>
              <span className="sm:hidden">פרסום</span>
            </Link>
            <HeaderUserActions />
            <MobileMenu categories={roots} />
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <Suspense fallback={<div className="h-11 rounded-full bg-muted" />}>
            <SearchBox />
          </Suspense>
        </div>
      </div>

      <nav
        aria-label="קטגוריות ראשיות"
        className="hide-scrollbar overflow-x-auto border-t border-border/60 bg-card/60"
      >
        <div className="container-page flex items-center gap-1 py-1.5">
          {roots.map((category) => (
            <Link
              key={category.id}
              href={`/c/${category.path}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.82rem] font-medium whitespace-nowrap text-muted-foreground transition hover:bg-primary-soft hover:text-primary"
            >
              <CategoryIcon name={category.icon} className="size-4" />
              {category.name}
            </Link>
          ))}
          <Link
            href="/c"
            className="ms-1 shrink-0 rounded-full border border-dashed border-border px-3 py-1.5 text-[0.82rem] font-medium whitespace-nowrap text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            כל הקטגוריות
          </Link>
        </div>
      </nav>
    </header>
  );
}
