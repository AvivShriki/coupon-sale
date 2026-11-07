import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/data/seed/categories";
import { findByPath } from "@/lib/categories";
import { CategoryView } from "@/components/search/category-view";
import { ResultsSkeleton } from "@/components/listing/results-skeleton";

type Props = { params: Promise<{ slug: string[] }> };

/** כל 81 עמודי הקטגוריות נוצרים מראש בזמן הבנייה */
export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.path.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = findByPath(categories, slug.join("/"));
  if (!category) return { title: "קטגוריה לא נמצאה" };
  return {
    title: category.name,
    description: `מודעות בקטגוריית ${category.name} – פריטים שאנשים רכשו ולא מנצלים.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const path = slug.join("/");
  if (!findByPath(categories, path)) notFound();
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <CategoryView path={path} />
    </Suspense>
  );
}
