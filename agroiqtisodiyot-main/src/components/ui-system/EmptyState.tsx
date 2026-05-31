import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /** Dekorativ ikona (ixtiyoriy) */
  icon?: LucideIcon;
  /** Bosh holat sarlavhasi */
  title: string;
  /** Qo'shimcha izoh matni */
  description?: string;
  /** Amal slot'i (masalan "Qidiruvni tozalash" tugmasi) */
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "py-16 md:py-24 text-center flex flex-col items-center",
        className,
      )}
    >
      {Icon ? (
        <div className="w-16 h-16 rounded-full bg-secondary/80 border border-border flex items-center justify-center">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      ) : null}
      <h3 className="mt-6 font-serif font-black text-xl text-foreground">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};
EmptyState.displayName = "EmptyState";

export { EmptyState };
