"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Stepper } from "@/components/publish/stepper";
import { StepCategory } from "@/components/publish/steps/step-category";
import { StepDetails } from "@/components/publish/steps/step-details";
import { StepImages } from "@/components/publish/steps/step-images";
import { StepContact } from "@/components/publish/steps/step-contact";
import { StepTerms } from "@/components/publish/steps/step-terms";
import { StepPreview } from "@/components/publish/steps/step-preview";
import { createListing } from "@/lib/data/remote";
import { uploadListingImage } from "@/lib/data/remote/storage";
import { newListingSchema } from "@/lib/validation/listing";
import { useAuth } from "@/lib/auth/auth-context";
import { rootOf } from "@/lib/categories";
import { fieldsForRoot } from "@/lib/categories/category-fields";
import {
  emptyDraft,
  normalizePhone,
  validateCategory,
  validateContact,
  validateDetails,
  validateTerms,
  type Errors,
  type ListingDraft,
} from "@/lib/validation/listing";
import { categories, useLocations } from "@/lib/data/hooks";

const steps = ["קטגוריה", "פרטי המודעה", "תמונות", "יצירת קשר", "תנאים", "אישור"];
const DRAFT_KEY = "coupon-sale.draft";

export function PublishWizard() {
  const router = useRouter();
  const locations = useLocations();
  const { user, ready } = useAuth();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ListingDraft>(emptyDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, startTransition] = useTransition();
  const [restored, setRestored] = useState(false);

  // שחזור טיוטה — אשף של שישה שלבים לא אמור לאבד מידע ברענון
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) setDraft({ ...emptyDraft, ...(JSON.parse(raw) as ListingDraft) });
    } catch {
      // טיוטה פגומה — מתחילים מחדש
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // אחסון חסום — ממשיכים בלי שמירה
    }
  }, [draft, restored]);

  useEffect(() => {
    if (!user) return;
    setDraft((current) => ({
      ...current,
      contactName: current.contactName || user.displayName,
      whatsapp: current.whatsapp || (user.phone ?? ""),
      email: current.email || user.email,
    }));
  }, [user]);

  const root = draft.categoryId ? rootOf(categories, draft.categoryId) : null;
  const fields = useMemo(() => fieldsForRoot(root?.slug), [root?.slug]);

  function set<K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function setAttribute(key: string, value: string) {
    setDraft((current) => ({
      ...current,
      attributes: { ...current.attributes, [key]: value },
    }));
  }

  function validateStep(index: number): Errors {
    switch (index) {
      case 0:
        return validateCategory(draft);
      case 1:
        return validateDetails(draft, fields);
      case 3:
        return validateContact(draft);
      case 4:
        return validateTerms(draft);
      default:
        return {};
    }
  }

  function next() {
    const stepErrors = validateStep(step);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      toast.error("יש להשלים את השדות המסומנים");
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit() {
    const allErrors = {
      ...validateCategory(draft),
      ...validateDetails(draft, fields),
      ...validateContact(draft),
      ...validateTerms(draft),
    };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error("יש פרטים חסרים. חזרו אחורה והשלימו אותם.");
      return;
    }
    if (!user) return;

    const phone = normalizePhone(draft.whatsapp);

    const parsed = newListingSchema.safeParse({
      categoryId: draft.categoryId,
      title: draft.title.trim(),
      description: draft.description.trim(),
      price: Number(draft.price),
      originalPrice: draft.originalPrice ? Number(draft.originalPrice) : null,
      location: draft.location.trim() || null,
      eventDate: draft.eventDate || null,
      expiresAt: draft.expiresAt || draft.eventDate || null,
      quantity: Number(draft.quantity),
      attributes: draft.attributes,
      images: draft.images,
      contact: {
        whatsapp: phone,
        phone,
        email: draft.email.trim() || null,
        preferred: draft.preferred,
      },
      transferConfirmed: true as const,
    });

    if (!parsed.success) {
      toast.error("חלק מהפרטים אינם תקינים. בדקו את השדות ונסו שוב.");
      return;
    }

    startTransition(async () => {
      try {
        const data = parsed.data;

        // התמונות הוקטנו בדפדפן; כאן הן עולות לאחסון ומתקבלת כתובת ציבורית
        const uploaded = await Promise.all(
          data.images.map((dataUrl) => uploadListingImage(user.id, dataUrl)),
        );

        await createListing(
          { ...data, images: uploaded.map((url) => ({ url, alt: data.title })) },
          user.id,
        );

        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {
          // אין מה לעשות אם האחסון חסום
        }

        toast.success("המודעה נשלחה לאישור", {
          description: "היא תופיע באתר אחרי שצוות האתר יאשר אותה.",
        });
        router.push("/account/listings");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "פרסום המודעה נכשל");
      }
    });
  }

  if (!ready) {
    return <div className="h-96 animate-pulse rounded-2xl bg-muted" />;
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
          <LogIn className="size-6" />
        </span>
        <h2 className="mt-4 font-heading text-lg font-bold">כדי לפרסם מודעה צריך חשבון</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          החשבון מאפשר לכם לנהל את המודעות שלכם, לערוך אותן ולסמן אותן כנמכרו.
        </p>
        <Link
          href="/login?next=/new"
          className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          התחברות או הרשמה
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <Stepper steps={steps} current={step} onSelect={setStep} />
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7">
        {step === 0 && (
          <StepCategory
            categories={categories}
            value={draft.categoryId}
            onChange={(value) => set("categoryId", value)}
            error={errors.categoryId}
          />
        )}
        {step === 1 && (
          <StepDetails
            draft={draft}
            errors={errors}
            fields={fields}
            locations={locations}
            set={set}
            setAttribute={setAttribute}
          />
        )}
        {step === 2 && (
          <StepImages
            images={draft.images}
            onChange={(images) => set("images", images)}
            fallbackCover={root ? `/covers/${root.slug}-1.svg` : null}
          />
        )}
        {step === 3 && <StepContact draft={draft} errors={errors} set={set} />}
        {step === 4 && <StepTerms draft={draft} errors={errors} set={set} />}
        {step === 5 && (
          <StepPreview draft={draft} categories={categories} sellerName={draft.contactName} />
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-40"
          >
            <ArrowRight className="size-4" />
            חזרה
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex h-11 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
            >
              המשך
              <ArrowLeft className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="flex h-11 items-center gap-2 rounded-full bg-success px-6 text-sm font-semibold text-success-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {pending ? "שולח…" : "שליחת המודעה לאישור"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
