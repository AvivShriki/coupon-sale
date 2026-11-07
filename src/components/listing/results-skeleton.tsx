export function ResultsSkeleton() {
  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
      <div className="hidden h-96 animate-pulse rounded-2xl bg-muted lg:block" />
      <div>
        <div className="mb-5 h-10 w-full animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-border">
              <div className="aspect-[4/3] animate-pulse bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
