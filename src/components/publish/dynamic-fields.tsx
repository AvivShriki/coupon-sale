"use client";

import { Field, inputClass } from "@/components/publish/form-field";
import type { CategoryField } from "@/lib/categories/category-fields";

/** מרנדר את השדות הייחודיים לקטגוריה שנבחרה — אותה הגדרה משמשת גם בעמוד המודעה */
export function DynamicFields({
  fields,
  values,
  errors,
  onChange,
}: {
  fields: CategoryField[];
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  if (fields.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => {
        const error = errors[`attr.${field.key}`];
        const value = values[field.key] ?? "";
        return (
          <Field
            key={field.key}
            label={field.label}
            required={field.required}
            error={error}
          >
            {field.type === "select" ? (
              <select
                value={value}
                onChange={(event) => onChange(field.key, event.target.value)}
                aria-invalid={Boolean(error)}
                className={inputClass}
              >
                <option value="">בחרו…</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <input
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                  inputMode={field.type === "number" ? "numeric" : undefined}
                  min={field.type === "number" ? 0 : undefined}
                  value={value}
                  placeholder={field.placeholder}
                  onChange={(event) => onChange(field.key, event.target.value)}
                  aria-invalid={Boolean(error)}
                  className={`${inputClass} ${field.type !== "text" ? "num" : ""} ${field.suffix ? "pe-16" : ""}`}
                />
                {field.suffix && (
                  <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {field.suffix}
                  </span>
                )}
              </div>
            )}
          </Field>
        );
      })}
    </div>
  );
}
