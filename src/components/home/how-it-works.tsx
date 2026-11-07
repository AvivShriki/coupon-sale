import { Handshake, HeartHandshake, Megaphone } from "lucide-react";
import { site } from "@/lib/site";

const steps = [
  {
    icon: Megaphone,
    title: "מפרסמים את מה שלא מנצלים",
    body: "בוחרים קטגוריה, ממלאים את הפרטים ומעלים תמונה. הפרסום לוקח שתי דקות.",
  },
  {
    icon: HeartHandshake,
    title: "מוצאים קונה מתאים",
    body: "המודעה מוצגת למי שמחפש בדיוק את זה, והקונים פונים אליכם ישירות בווטסאפ.",
  },
  {
    icon: Handshake,
    title: "סוגרים עסקה ישירות ביניכם",
    body: "מתאמים את התשלום ואת העברת הפריט בין הצדדים, בלי עמלות ובלי מתווכים.",
  },
];

export function HowItWorks() {
  return (
    <section className="container-page py-14">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-10">
        <h2 className="font-heading text-xl font-extrabold sm:text-2xl">איך זה עובד?</h2>
        <p className="mt-1 text-sm text-muted-foreground">שלושה שלבים, בלי בירוקרטיה.</p>

        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                <step.icon className="size-5" />
              </span>
              <h3 className="mt-4 flex items-center gap-2 font-heading text-base font-bold">
                <span className="num text-primary">{index + 1}.</span>
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 rounded-xl bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          {site.offPlatformNotice}
        </p>
      </div>
    </section>
  );
}
