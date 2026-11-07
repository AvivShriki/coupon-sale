import { cn } from "cn";

export function Field({
  label,
  error,
  hint,
  required = false,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-center gap-1 text-sm font-semibold">
        {label}
        {required && <span className="text-destructive">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1 block text-xs font-medium text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10 aria-invalid:border-destructive";

export const textareaClass =
  "w-full rounded-lg border border-border bg-card p-3 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10 aria-invalid:border-destructive";
