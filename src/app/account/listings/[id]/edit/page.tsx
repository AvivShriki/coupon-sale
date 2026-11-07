import { EditListingForm } from "@/components/account/edit-listing-form";

/** המזהה נקרא בצד הלקוח, ולכן אין צורך לייצר עמוד לכל מודעה */
export function generateStaticParams() {
  return [{ id: "listing" }];
}

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditListingForm listingId={id} />;
}
