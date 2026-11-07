import type { Metadata } from "next";
import { CategoriesView } from "@/components/search/categories-view";

export const metadata: Metadata = {
  title: "כל הקטגוריות",
  description: "כל הקטגוריות ותתי-הקטגוריות באתר.",
};

export default function CategoriesPage() {
  return <CategoriesView />;
}
