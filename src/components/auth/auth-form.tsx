"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Field, inputClass } from "@/components/publish/form-field";
import { useAuth } from "@/lib/auth/auth-context";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const { user, signIn, signUp } = useAuth();
  const next = params.get("next") ?? "/account";

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  function validate(): boolean {
    const found: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) found.email = "כתובת אימייל לא תקינה";
    if (password.length < 6) found.password = "סיסמה של לפחות 6 תווים";
    if (mode === "signup") {
      if (displayName.trim().length < 2) found.displayName = "יש להזין שם";
      if (!/^0\d{1,2}-?\d{7}$/.test(phone.trim())) found.phone = "מספר טלפון לא תקין";
    }
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setPending(true);
    try {
      if (mode === "login") await signIn(email, password);
      else await signUp({ displayName, email, password, phone });
      toast.success(mode === "login" ? "התחברת בהצלחה" : "החשבון נוצר");
      router.replace(next);
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "משהו השתבש, אפשר לנסות שוב";
      setFormError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container-page flex justify-center py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <h1 className="font-heading text-2xl font-extrabold">
            {mode === "login" ? "התחברות" : "הרשמה"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "התחברו כדי לנהל את המודעות והמועדפים שלכם."
              : "פתיחת חשבון לוקחת פחות מדקה."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field label="שם מלא" required error={errors.displayName}>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className={inputClass}
                  autoComplete="name"
                />
              </Field>
            )}

            <Field label="אימייל" required error={errors.email}>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`${inputClass} text-start`}
                autoComplete="email"
              />
            </Field>

            {mode === "signup" && (
              <Field label="טלפון" required error={errors.phone}>
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={`${inputClass} text-start`}
                  placeholder="052-5550147"
                  autoComplete="tel"
                />
              </Field>
            )}

            <Field label="סיסמה" required error={errors.password}>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </Field>

            {formError && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
              >
                {formError}
                {mode === "login" && formError.includes("שגויים") && (
                  <>
                    {" "}
                    <Link href={`/signup?next=${next}`} className="underline">
                      אין לכם עדיין חשבון?
                    </Link>
                  </>
                )}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {mode === "login" ? "התחברות" : "יצירת חשבון"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "login" ? "אין לכם חשבון? " : "כבר יש לכם חשבון? "}
            <Link
              href={mode === "login" ? `/signup?next=${next}` : `/login?next=${next}`}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "login" ? "הרשמה" : "התחברות"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
