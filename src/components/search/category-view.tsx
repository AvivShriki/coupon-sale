"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories } from "@/lib/data/hooks";
import { childrenOf, findByPath, pathChain } from "@/lib/categories";
import { ResultsView } from "@/components/listing/results-view";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CategoryIcon } from "@/components/common/category-icon";
import { parseSearchParams, type RawParams } from "@/lib/search-params";

export function CategoryView({ path }: { path: string }) {
  const searchParams = useSearchParams();
  const params: RawParams = Object.fromEntries(searchParams.entries());

  const category = findByPath(categories, path);
  if (!category) return null;

  const chain = pathChain(categories, category.id);
  const children = childrenOf(categories, category.id);
  const query = { ...parseSearchParams(params), categoryId: category.id };

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

      <ResultsView query={query} params={params} basePath={`/c/${path}`} />
    </>
  );
}
