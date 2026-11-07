import { Check } from "lucide-react";
import { cn } from "cn";

export function Stepper({
  steps,
  current,
  onSelect,
}: {
  steps: string[];
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="hide-scrollbar flex gap-1 overflow-x-auto">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => done && onSelect(index)}
              disabled={!done && !active}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition",
                active && "bg-primary text-primary-foreground font-semibold",
                done && "text-primary hover:bg-primary-soft cursor-pointer",
                !active && !done && "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "num grid size-5 place-items-center rounded-full text-[0.7rem] font-bold",
                  active && "bg-primary-foreground text-primary",
                  done && "bg-primary text-primary-foreground",
                  !active && !done && "bg-muted",
                )}
              >
                {done ? <Check className="size-3" /> : index + 1}
              </span>
              <span className="whitespace-nowrap">{label}</span>
            </button>
            {index < steps.length - 1 && (
              <span className="mx-1 h-px w-4 bg-border" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
