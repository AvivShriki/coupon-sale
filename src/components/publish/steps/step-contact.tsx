"use client";

import { Field, inputClass } from "@/components/publish/form-field";
import type { ContactMethod } from "@/lib/data/types";
import type { Errors, ListingDraft } from "@/lib/validation/listing";

const methods: { value: ContactMethod; label: string }[] = [
  { value: "whatsapp", label: "וואטסאפ" },
  { value: "phone", label: "שיחת טלפון" },
  { value: "email", label: "אימייל" },
];

export function StepContact({
  draft,
  errors,
  set,
}: {
  draft: ListingDraft;
  errors: Errors;
  set: <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-lg font-bold">פרטי יצירת קשר</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          הקונים יפנו אליכם ישירות. המספר מוצג במודעה, אז אל תשתמשו במספר שאתם לא
          רוצים לחשוף.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="שם ליצירת קשר" required error={errors.contactName}>
          <input
            value={draft.contactName}
            onChange={(event) => set("contactName", event.target.value)}
            aria-invalid={Boolean(errors.contactName)}
            className={inputClass}
          />
        </Field>

        <Field label="טלפון / וואטסאפ" required error={errors.whatsapp}>
          <input
            type="tel"
            inputMode="tel"
            dir="ltr"
            value={draft.whatsapp}
            onChange={(event) => set("whatsapp", event.target.value)}
            aria-invalid={Boolean(errors.whatsapp)}
            className={`${inputClass} text-start`}
            placeholder="052-5550147"
          />
        </Field>

        <Field label="אימייל" error={errors.email} hint="לא חובה">
          <input
            type="email"
            dir="ltr"
            value={draft.email}
            onChange={(event) => set("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            className={`${inputClass} text-start`}
            placeholder="name@example.com"
          />
        </Field>

        <Field label="דרך יצירת הקשר המועדפת">
          <div className="flex gap-2">
            {methods.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => set("preferred", method.value)}
                className={`h-11 flex-1 rounded-lg border text-sm transition ${
                  draft.preferred === method.value
                    ? "border-primary bg-primary-soft font-semibold text-primary"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}
