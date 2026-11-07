import { db } from "@/lib/data";
import { EditListingForm } from "@/components/account/edit-listing-form";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, locations] = await Promise.all([
    db.getCategories(),
    db.getLocations(),
  ]);

  return <EditListingForm listingId={id} categories={categories} locations={locations} />;
}
