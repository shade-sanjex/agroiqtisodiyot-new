import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const glassCardVariants = cva(
  "rounded-2xl border backdrop-blur-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card/85 dark:bg-card/75 border-border/80 shadow-glass",
        elevated: "bg-card border-border/60 shadow-glass-lg",
        outline: "bg-transparent border-border",
        subtle: "bg-secondary/40 border-border/40",
      },
      interactive: {
        true: "hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/30 cursor-default",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
    },
  },
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  variant?: "default" | "elevated" | "outline" | "subtle";
  interactive?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, interactive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassCardVariants({ variant, interactive, className }))}
        {...props}
      />
    );
  },
);
GlassCard.displayName = "GlassCard";

export { GlassCard, glassCardVariants };
