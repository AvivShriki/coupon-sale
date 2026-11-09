import type { Metadata } from "next";
import { fetchListingsForBuild } from "@/lib/data/build";
import { ListingDetail } from "@/components/listing/listing-detail";

type Props = { params: Promise<{ id: string }> };

/**
 * נוצר עמוד לכל מודעה פעילה בזמן הבנייה. מודעה חדשה יותר מוצגת דרך דף ה-404,
 * שמזהה כתובת של מודעה וטוען אותה בדפדפן.
 * הערך הסתמי נדרש כי ייצוא סטטי מחייב לפחות נתיב אחד.
 */
export async function generateStaticParams() {
  const listings = await fetchListingsForBuild();
  return listings.length > 0
    ? listings.map((listing) => ({ id: listing.id }))
    : [{ id: "none" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = (await fetchListingsForBuild()).find((item) => item.id === id);
  if (!listing) return { title: "מודעה" };
  return {
    title: listing.title,
    description: listing.description.slice(0, 155),
  };
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  return <ListingDetail id={id} />;
}
