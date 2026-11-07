import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { prohibitedItems, publishTerms } from "@/lib/policy";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "תנאי שימוש",
  description: "תנאי השימוש באתר, כללי הפרסום והפריטים האסורים.",
};

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-8">
      <Breadcrumbs items={[{ label: "תנאי שימוש" }]} />
      <h1 className="mt-2 font-heading text-2xl font-extrabold">תנאי שימוש</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        מסמך זה הוא טיוטה לגרסת ה-MVP ואינו מהווה ייעוץ משפטי. לפני עלייה לאוויר יש
        להחליף אותו בנוסח שנבדק על ידי עורך דין.
      </p>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-bold">מהות השירות</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {site.offPlatformNotice} האתר אינו צד לעסקה, אינו מחזיק בכספים, אינו מספק
          אחריות למימוש הפריט ואינו גובה עמלה.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-bold">כללי הפרסום</h2>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {publishTerms.map((term) => (
            <li key={term}>• {term}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-bold">פריטים שאסור לפרסם</h2>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {prohibitedItems.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-bold">פרטיות</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          פרטי הקשר שאתם מזינים במודעה מוצגים לכל גולש. אל תפרסמו קודי מימוש,
          ברקודים, מספרי כרטיס או מידע רגיש אחר – לא בטקסט ולא בתמונות.
        </p>
      </section>
    </div>
  );
}
