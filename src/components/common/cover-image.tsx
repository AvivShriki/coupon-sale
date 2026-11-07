import Image from "next/image";

/**
 * עטיפה ל-next/image. עטיפות הקטגוריות הן SVG מקומיים שאין טעם לעבד,
 * ולכן הם מוגשים כמו שהם. כשיתווספו תמונות אמיתיות מ-Supabase Storage
 * הן יעברו דרך האופטימיזציה הרגילה.
 */
export function CoverImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith(".svg") || src.startsWith("data:")}
      className={`object-cover ${className}`}
    />
  );
}
