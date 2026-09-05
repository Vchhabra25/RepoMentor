import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-surface-hover", className)} />;
}

export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3 rounded", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass rounded-xl2 p-6", className)}>
      <Skeleton className="h-4 w-1/3 mb-4" />
      <TextSkeleton lines={3} />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass rounded-xl2 p-6">
      <Skeleton className="w-10 h-10 rounded-xl mb-4" />
      <Skeleton className="h-6 w-2/3 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

/** Full-page loading state — used at the top of any repo-scoped route while its context loads. */
export function PageSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <CardSkeleton />
    </div>
  );
}
