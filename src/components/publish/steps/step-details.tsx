"use client";

import { Field, inputClass, textareaClass } from "@/components/publish/form-field";
import { DynamicFields } from "@/components/publish/dynamic-fields";
import { discountPercent } from "@/lib/utils/format";
import type { CategoryField } from "@/lib/categories/category-fields";
import type { Errors, ListingDraft } from "@/lib/validation/listing";

export function StepDetails({
  draft,
  errors,
  fields,
  locations,
  set,
  setAttribute,
}: {
  draft: ListingDraft;
  errors: Errors;
  fields: CategoryField[];
  locations: string[];
  set: <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) => void;
  setAttribute: (key: string, value: string) => void;
}) {
  const saving = discountPercent(Number(draft.price) || 0, Number(draft.originalPrice) || null);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-lg font-bold">פרטי המודעה</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          ככל שהפרטים מדויקים יותר, כך גדל הסיכוי למצוא קונה.
        </p>
      </div>

      <Field
        label="כותרת"
        required
        error={errors.title}
        hint="לדוגמה: 2 כרטיסים להופעה של עדן חסון, 25 בנובמבר"
      >
        <input
          value={draft.title}
          onChange={(event) => set("title", event.target.value)}
          maxLength={80}
          aria-invalid={Boolean(errors.title)}
          className={inputClass}
          placeholder="מה אתם מוכרים?"
        />
      </Field>

      <Field
        label="תיאור"
        required
        error={errors.description}
        hint="מה בדיוק כלול, למה אתם מעבירים, ואיך מתבצעת ההעברה בפועל"
      >
        <textarea
          value={draft.description}
          onChange={(event) => set("description", event.target.value)}
          rows={5}
          maxLength={4000}
          aria-invalid={Boolean(errors.description)}
          className={textareaClass}
          placeholder="פרטו על הפריט, התנאים וההעברה"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="מחיר מבוקש" required error={errors.price}>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={draft.price}
              onChange={(event) => set("price", event.target.value)}
              aria-invalid={Boolean(errors.price)}
              className={`${inputClass} num pe-10`}
              placeholder="0"
            />
            <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₪
            </span>
          </div>
        </Field>

        <Field
          label="מחיר מקורי"
          error={errors.originalPrice}
          hint={saving !== null ? `הקונה חוסך ${saving}%` : "לא חובה – אבל מגדיל את האטרקטיביות"}
        >
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={draft.originalPrice}
              onChange={(event) => set("originalPrice", event.target.value)}
              aria-invalid={Boolean(errors.originalPrice)}
              className={`${inputClass} num pe-10`}
              placeholder="כמה שילמתם"
            />
            <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₪
            </span>
          </div>
        </Field>

        <Field label="מיקום" hint="אם הפריט דיגיטלי אפשר להשאיר ריק">
          <input
            list="locations"
            value={draft.location}
            onChange={(event) => set("location", event.target.value)}
            className={inputClass}
            placeholder="עיר או אזור"
          />
          <datalist id="locations">
            {locations.map((location) => (
              <option key={location} value={location} />
            ))}
          </datalist>
        </Field>

        <Field label="כמות" required error={errors.quantity}>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={50}
            value={draft.quantity}
            onChange={(event) => set("quantity", event.target.value)}
            aria-invalid={Boolean(errors.quantity)}
            className={`${inputClass} num`}
          />
        </Field>

        <Field label="תאריך האירוע" hint="רק אם מדובר באירוע עם תאריך קבוע">
          <input
            type="date"
            value={draft.eventDate}
            onChange={(event) => set("eventDate", event.target.value)}
            className={`${inputClass} num`}
          />
        </Field>

        <Field label="תאריך תפוגה" error={errors.expiresAt} hint="עד מתי אפשר לממש את הפריט">
          <input
            type="date"
            value={draft.expiresAt}
            onChange={(event) => set("expiresAt", event.target.value)}
            aria-invalid={Boolean(errors.expiresAt)}
            className={`${inputClass} num`}
          />
        </Field>
      </div>

      {fields.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <h3 className="mb-3 text-sm font-bold">פרטים לפי הקטגוריה שבחרתם</h3>
          <DynamicFields
            fields={fields}
            values={draft.attributes}
            errors={errors}
            onChange={setAttribute}
          />
        </div>
      )}
    </div>
  );
}
