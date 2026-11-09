"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Field, inputClass } from "@/components/publish/form-field";
import { useAuth } from "@/lib/auth/auth-context";

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName);
    setEmail(user.email);
    setPhone(user.phone ?? "");
    setCity(user.city ?? "");
  }, [user]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const found: Record<string, string> = {};
    if (displayName.trim().length < 2) found.displayName = "יש להזין שם";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) found.email = "כתובת אימייל לא תקינה";
    if (phone && !/^0\d{1,2}-?\d{7}$/.test(phone.trim())) found.phone = "מספר טלפון לא תקין";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    updateProfile({
      displayName: displayName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      city: city.trim() || null,
    });
    toast.success("הפרטים נשמרו");
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-extrabold">פרופיל</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        הפרטים האלה מופיעים במודעות שלכם ומשמשים את הקונים ליצירת קשר.
      </p>

      <form
        onSubmit={submit}
        className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
      >
        <Field label="שם מלא" required error={errors.displayName}>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="אימייל" required error={errors.email}>
          <input
            type="email"
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`${inputClass} text-start`}
          />
        </Field>

        <Field label="טלפון" error={errors.phone}>
          <input
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={`${inputClass} text-start`}
            placeholder="052-5550147"
          />
        </Field>

        <Field label="עיר">
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className={inputClass}
          />
        </Field>

        <button
          type="submit"
          className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          שמירת שינויים
        </button>
      </form>
    </div>
  );
}
