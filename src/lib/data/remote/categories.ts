import { categories as seedCategories } from "@/data/seed/categories";
import { getSupabase } from "@/lib/supabase/client";
import { withDescendantIds } from "@/lib/categories";
import type { Category } from "@/lib/data/types";

/**
 * במסד הנתונים לכל קטגוריה יש מזהה uuid, ובממשק המשתמש עובדים עם המסלול
 * (entertainment/concerts) שגם מופיע בכתובת. כאן מתורגם בין השניים פעם אחת,
 * וכל שאר הקוד ממשיך לעבוד עם המסלולים כמו קודם.
 */

interface Maps {
  idByPath: Map<string, string>;
  pathById: Map<string, string>;
}

let promise: Promise<Maps> | null = null;

async function load(): Promise<Maps> {
  const { data, error } = await getSupabase().from("categories").select("id, path");
  if (error) throw new Error(`טעינת הקטגוריות נכשלה: ${error.message}`);

  const idByPath = new Map<string, string>();
  const pathById = new Map<string, string>();
  for (const row of data ?? []) {
    idByPath.set(row.path as string, row.id as string);
    pathById.set(row.id as string, row.path as string);
  }
  return { idByPath, pathById };
}

export function categoryMaps(): Promise<Maps> {
  promise ??= load();
  return promise;
}

export async function uuidForPath(path: string): Promise<string | null> {
  return (await categoryMaps()).idByPath.get(path) ?? null;
}

export async function pathForUuid(id: string): Promise<string> {
  return (await categoryMaps()).pathById.get(id) ?? "";
}

/** הקטגוריה וכל מה שמתחתיה, כמזהי מסד נתונים */
export async function uuidsForSubtree(path: string): Promise<string[]> {
  const { idByPath } = await categoryMaps();
  return withDescendantIds(seedCategories, path)
    .map((childPath) => idByPath.get(childPath))
    .filter((id): id is string => Boolean(id));
}

export function categoryByPath(path: string): Category | null {
  return seedCategories.find((category) => category.path === path) ?? null;
}
