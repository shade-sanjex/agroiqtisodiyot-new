import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface SkeletonGridColumns {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

export interface SkeletonGridProps {
  /** Skeleton elementlar soni */
  count?: number;
  /** Har bir element aspect-ratio nisbati (jurnal muqovasi uchun) */
  aspect?: string;
  /** Responsive ustunlar soni (breakpoint bo'yicha) */
  columns?: SkeletonGridColumns;
  className?: string;
}

/**
 * Tailwind grid-cols klasslari runtime'da dinamik bo'la olmaydi (purge sababli).
 * Shuning uchun har bir breakpoint uchun aniq (statik) klass map ishlatamiz.
 */
const baseColsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const smColsMap: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

const mdColsMap: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

const lgColsMap: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const DEFAULT_COLUMNS: Required<SkeletonGridColumns> = {
  base: 2,
  sm: 2,
  md: 3,
  lg: 4,
};

const SkeletonGrid = ({
  count = 8,
  aspect = "3/4.2",
  columns,
  className,
}: SkeletonGridProps) => {
  const cols = { ...DEFAULT_COLUMNS, ...columns };

  return (
    <div
      className={cn(
        "grid gap-4 md:gap-6",
        baseColsMap[cols.base] ?? baseColsMap[DEFAULT_COLUMNS.base],
        smColsMap[cols.sm] ?? smColsMap[DEFAULT_COLUMNS.sm],
        mdColsMap[cols.md] ?? mdColsMap[DEFAULT_COLUMNS.md],
        lgColsMap[cols.lg] ?? lgColsMap[DEFAULT_COLUMNS.lg],
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl overflow-hidden bg-card border border-border p-2"
        >
          <Skeleton
            className="w-full rounded-xl shimmer"
            style={{ aspectRatio: aspect }}
          />
        </div>
      ))}
    </div>
  );
};
SkeletonGrid.displayName = "SkeletonGrid";

export { SkeletonGrid };
