import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/data";
import { childrenOf, pathChain } from "@/lib/categories";
import { ResultsSection } from "@/components/listing/results-section";
import { ResultsSkeleton } from "@/components/listing/results-skeleton";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CategoryIcon } from "@/components/common/category-icon";
import { parseSearchParams, type RawParams } from "@/lib/search-params";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<RawParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.getCategoryByPath(slug.join("/"));
  if (!category) return { title: "קטגוריה לא נמצאה" };
  return {
    title: category.name,
    description: `מודעות בקטגוריית ${category.name} – פריטים שאנשים רכשו ולא מנצלים.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const path = slug.join("/");
  const category = await db.getCategoryByPath(path);
  if (!category) notFound();

  const rawParams = await searchParams;
  const categories = await db.getCategories();
  const chain = pathChain(categories, category.id);
  const children = childrenOf(categories, category.id);

  const query = { ...parseSearchParams(rawParams), categoryId: category.id };

  return (
    <>
      <div className="border-b border-border/60 bg-card">
        <div className="container-page py-6">
          <Breadcrumbs
            items={chain.map((item, index) => ({
              label: item.name,
              href: index < chain.length - 1 ? `/c/${item.path}` : undefined,
            }))}
          />

          <div className="mt-3 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
              <CategoryIcon name={category.icon} className="size-6" />
            </span>
            <h1 className="font-heading text-2xl font-extrabold">{category.name}</h1>
          </div>

          {children.length > 0 && (
            <div className="hide-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
              {children.map((child) => (
                <Link
                  key={child.id}
                  href={`/c/${child.path}`}
                  className="shrink-0 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm whitespace-nowrap transition hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Suspense key={path + JSON.stringify(rawParams)} fallback={<ResultsSkeleton />}>
        <ResultsSection query={query} params={rawParams} basePath={`/c/${path}`} />
      </Suspense>
    </>
  );
}
