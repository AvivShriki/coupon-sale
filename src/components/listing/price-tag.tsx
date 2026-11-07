import { cn } from "cn";
import { formatPrice } from "@/lib/utils/format";

export function PriceTag({
  price,
  originalPrice,
  discountPercent,
  size = "default",
  className,
}: {
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  size?: "default" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "num font-heading font-extrabold tracking-tight",
          size === "lg" ? "text-3xl" : "text-xl",
        )}
      >
        {formatPrice(price)}
      </span>
      {originalPrice && (
        <span
          className={cn(
            "num text-muted-foreground line-through decoration-muted-foreground/60",
            size === "lg" ? "text-base" : "text-sm",
          )}
        >
          {formatPrice(originalPrice)}
        </span>
      )}
      {discountPercent !== null && (
        <span
          className={cn(
            "rounded-full bg-success-soft px-2 py-0.5 font-bold text-success",
            size === "lg" ? "text-sm" : "text-xs",
          )}
        >
          חיסכון <span className="num">{discountPercent}%</span>
        </span>
      )}
    </div>
  );
}
