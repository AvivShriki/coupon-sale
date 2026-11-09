import { Suspense } from "react";
import { EditListingPanel } from "@/components/account/edit-listing-panel";

export default function EditListingPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
      <EditListingPanel />
    </Suspense>
  );
}
