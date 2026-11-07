import type { Metadata } from "next";
import { PublishWizard } from "@/components/publish/publish-wizard";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

export const metadata: Metadata = {
  title: "פרסום מודעה",
  description: "פרסמו כרטיס, חופשה, שובר או מנוי שלא תנצלו.",
};

export default function NewListingPage() {
  return (
    <div className="container-page max-w-4xl py-8">
      <Breadcrumbs items={[{ label: "פרסום מודעה" }]} />
      <h1 className="mt-2 mb-6 font-heading text-2xl font-extrabold">פרסום מודעה</h1>
      <PublishWizard />
    </div>
  );
}
