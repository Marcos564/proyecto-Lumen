interface SkeletonProps {
  className?: string;
}

/** Bloque base para los estados de carga. */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-slate-200/70 ${className}`}
    />
  );
}
