import Link from "next/link";
import { db } from "@/lib/data";
import { mainCategories } from "@/lib/categories";
import { Logo } from "@/components/layout/logo";
import { site } from "@/lib/site";

export async function SiteFooter() {
  const categories = await db.getCategories();
  const roots = mainCategories(categories).slice(0, 8);

  return (
    <footer className="mt-20 border-t border-border/70 bg-card">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {site.description}
          </p>
          <p className="mt-4 rounded-xl bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
            {site.offPlatformNotice}
          </p>
        </div>

        <nav aria-label="קטגוריות">
          <h2 className="text-sm font-semibold">קטגוריות פופולריות</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {roots.map((category) => (
              <li key={category.id}>
                <Link href={`/c/${category.path}`} className="transition hover:text-primary">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="קישורים">
          <h2 className="text-sm font-semibold">באתר</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/new" className="transition hover:text-primary">
                פרסום מודעה
              </Link>
            </li>
            <li>
              <Link href="/search?deals=1" className="transition hover:text-primary">
                אזור ההזדמנויות
              </Link>
            </li>
            <li>
              <Link href="/account" className="transition hover:text-primary">
                האזור האישי
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="transition hover:text-primary">
                איך זה עובד
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition hover:text-primary">
                תנאי שימוש
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/70">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. כל הזכויות שמורות.
          </p>
          <p>גרסת MVP – הנתונים באתר הם נתוני הדגמה.</p>
        </div>
      </div>
    </footer>
  );
}
