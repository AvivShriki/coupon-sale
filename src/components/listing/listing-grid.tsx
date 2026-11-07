import { ListingCard } from "@/components/listing/listing-card";
import type { ListingView } from "@/lib/data/types";

export function ListingGrid({
  listings,
  priorityCount = 0,
  columns = 4,
}: {
  listings: ListingView[];
  priorityCount?: number;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:gap-4 ${
        columns === 4 ? "lg:grid-cols-4" : "md:grid-cols-3"
      }`}
    >
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
