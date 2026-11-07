"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-7" />
      </span>
      <h1 className="font-heading text-2xl font-extrabold">משהו השתבש</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        אירעה שגיאה בטעינת העמוד. אפשר לנסות שוב.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        ניסיון חוזר
      </button>
    </div>
  );
}
