import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorks } from "@/components/home/how-it-works";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

export const metadata: Metadata = {
  title: "איך זה עובד",
  description: "כך מפרסמים ומוצאים מוצרים, שירותים וזכויות שאנשים רכשו ולא מנצלים.",
};

const faq = [
  {
    q: "האם התשלום עובר דרך האתר?",
    a: "לא. האתר מחבר בין מוכר לקונה בלבד. התשלום והעברת הפריט מתבצעים ישירות בין הצדדים, בדרך שהם מסכימים עליה.",
  },
  {
    q: "האם יש עמלה?",
    a: "אין. הפרסום חינם והעסקה נסגרת מחוץ לאתר.",
  },
  {
    q: "איך יודעים שהפריט באמת ניתן להעברה?",
    a: "המוכר מצהיר על כך בעת הפרסום, אבל האחריות לבדוק מול בית העסק או המפיק היא של שני הצדדים. בכל מודעה מופיעה תזכורת לכך.",
  },
  {
    q: "מה עושים אם מודעה נראית חשודה?",
    a: "בכל עמוד מודעה יש כפתור דיווח. הדיווחים נבדקים ומודעה מפרה מוסרת.",
  },
  {
    q: "אפשר לערוך מודעה אחרי הפרסום?",
    a: "כן. באזור האישי אפשר לערוך, להשהות, לסמן כנמכרה או למחוק כל מודעה שפרסמתם.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <div className="border-b border-border/60 bg-card">
        <div className="container-page py-6">
          <Breadcrumbs items={[{ label: "איך זה עובד" }]} />
          <h1 className="mt-2 font-heading text-2xl font-extrabold">איך זה עובד</h1>
        </div>
      </div>

      <HowItWorks />

      <section className="container-page pb-16">
        <h2 className="font-heading text-xl font-extrabold">שאלות נפוצות</h2>
        <dl className="mt-5 space-y-3">
          {faq.map((item) => (
            <div key={item.q} className="rounded-2xl border border-border bg-card p-5">
              <dt className="font-bold">{item.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/new"
            className="flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            פרסום מודעה
          </Link>
          <Link
            href="/search"
            className="flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold transition hover:bg-muted"
          >
            למציאת הזדמנויות
          </Link>
        </div>
      </section>
    </div>
  );
}
