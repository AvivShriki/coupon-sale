"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";
import { prohibitedItems, publishTerms } from "@/lib/policy";
import type { Errors, ListingDraft } from "@/lib/validation/listing";

export function StepTerms({
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
        <h2 className="font-heading text-lg font-bold">אישור תנאי הפרסום</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          לפני שמפרסמים, חשוב לוודא שהפריט באמת ניתן להעברה.
        </p>
      </div>

      <section className="rounded-xl border border-destructive/25 bg-destructive/5 p-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-destructive">
          <AlertTriangle className="size-4" />
          מה אסור לפרסם
        </h3>
        <ul className="mt-2.5 space-y-1.5 text-sm text-foreground/80">
          {prohibitedItems.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-destructive" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-muted/40 p-4">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <ShieldCheck className="size-4 text-primary" />
          תנאי הפרסום
        </h3>
        <ul className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
          {publishTerms.map((term) => (
            <li key={term}>• {term}</li>
          ))}
        </ul>
      </section>

      <div className="space-y-2.5">
        <Checkbox
          checked={draft.transferConfirmed}
          onChange={(value) => set("transferConfirmed", value)}
          error={errors.transferConfirmed}
          label="אני מצהיר שאני רשאי להעביר את הפריט או השירות לאדם אחר, ושההעברה אינה מנוגדת לתנאי הספק."
        />
        <Checkbox
          checked={draft.notProhibited}
          onChange={(value) => set("notProhibited", value)}
          error={errors.notProhibited}
          label="הפריט שאני מפרסם אינו נמנה עם הפריטים האסורים לפרסום."
        />
        <Checkbox
          checked={draft.termsAccepted}
          onChange={(value) => set("termsAccepted", value)}
          error={errors.termsAccepted}
          label="קראתי ואני מאשר את תנאי הפרסום, ומבין שהעסקה מתבצעת ישירות מול הקונה."
        />
      </div>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  error,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-sm leading-relaxed transition ${
          error ? "border-destructive/50" : "border-border"
        } has-checked:border-primary has-checked:bg-primary-soft`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
        />
        {label}
      </label>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
