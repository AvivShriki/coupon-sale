import type { Metadata } from "next";
import { listings } from "@/data/seed/listings";
import { ListingDetail } from "@/components/listing/listing-detail";

type Props = { params: Promise<{ id: string }> };

/**
 * עמוד לכל מודעה מה-seed נוצר מראש. מודעה שנוצרת בדפדפן מקבלת מזהה חדש
 * שאין לו עמוד סטטי — היא מוצגת דרך דף ה-404 שיודע לזהות כתובת מודעה.
 */
export function generateStaticParams() {
  return listings.map((listing) => ({ id: listing.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = listings.find((item) => item.id === id);
  if (!listing) return { title: "המודעה לא נמצאה" };
  return {
    title: listing.title,
    description: listing.description.slice(0, 155),
  };
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  return <ListingDetail id={id} />;
}
