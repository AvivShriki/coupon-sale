import type { Category } from "@/lib/data/types";

export function mainCategories(all: Category[]): Category[] {
  return all.filter((c) => c.parentId === null).sort((a, b) => a.order - b.order);
}

export function childrenOf(all: Category[], parentId: string): Category[] {
  return all.filter((c) => c.parentId === parentId).sort((a, b) => a.order - b.order);
}

export function findByPath(all: Category[], path: string): Category | null {
  return all.find((c) => c.path === path) ?? null;
}

export function findById(all: Category[], id: string): Category | null {
  return all.find((c) => c.id === id) ?? null;
}

/** שרשרת מהקטגוריה הראשית ועד הקטגוריה המבוקשת */
export function pathChain(all: Category[], id: string): Category[] {
  const chain: Category[] = [];
  let current = findById(all, id);
  while (current) {
    chain.unshift(current);
    current = current.parentId ? findById(all, current.parentId) : null;
  }
  return chain;
}

/** הקטגוריה עצמה וכל מה שמתחתיה — לסינון מודעות */
export function withDescendantIds(all: Category[], id: string): string[] {
  const ids = [id];
  for (const child of childrenOf(all, id)) {
    ids.push(...withDescendantIds(all, child.id));
  }
  return ids;
}

/** הקטגוריה הראשית שאליה שייך מזהה כלשהו */
export function rootOf(all: Category[], id: string): Category | null {
  return pathChain(all, id)[0] ?? null;
}
