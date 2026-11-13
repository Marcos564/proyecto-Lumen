import { Skeleton } from "./Skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

/** Placeholder con la forma de una tabla mientras carga su chunk o sus datos. */
export function TableSkeleton({ rows = 6, columns = 4 }: TableSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border border-slate-300 bg-white shadow-md ring-1 ring-slate-900/5"
    >
      <div className="bg-teal-600 px-4 py-3">
        <Skeleton className="h-3 w-24 bg-teal-500/60" />
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 border-b border-slate-200 px-4 py-3 last:border-0"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <Skeleton key={columnIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Placeholder para los formularios que se cargan dentro de un modal. */
export function FormSkeleton() {
  return (
    <div aria-hidden="true" className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

/** Placeholder para las tabs de una ficha que esperan datos. */
export function CardsSkeleton() {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, cardIndex) => (
        <div
          key={cardIndex}
          className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6"
        >
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((__, rowIndex) => (
              <div key={rowIndex} className="flex flex-col gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
