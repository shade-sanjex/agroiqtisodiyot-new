import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { ScrollReveal } from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  /** Kicker/yorliq — kichik uppercase editorial label */
  eyebrow?: string;
  /** Asosiy sarlavha (serif display) */
  title: string;
  /** Ixtiyoriy tavsif matni */
  description?: string;
  /** Dekorativ fon rasmi (mavjud /assets/*-hero.webp) */
  backgroundImage?: string;
  /** Balandlik/padding shkalasi — default 'md' */
  size?: "sm" | "md" | "lg";
  /** Ixtiyoriy CTA tugmalar */
  actions?: React.ReactNode;
  /** Ixtiyoriy dekorativ ikona */
  icon?: LucideIcon;
  /** Qo'shimcha klasslar */
  className?: string;
}

/**
 * PageHero — ichki sahifalar uchun yagona "hero moment" bloki.
 * Token-asosli, yengil kompozitsiya: bitta nozik gradient overlay + ixtiyoriy
 * ken-burns fon rasmi (dekorativ — alt=""), serif sarlavha va tavsif.
 * Faqat Dizayn_Tili token'lari/Tailwind klasslaridan foydalanadi.
 */
function PageHero({
  eyebrow,
  title,
  description,
  backgroundImage,
  size = "md",
  actions,
  icon: Icon,
  className,
}: PageHeroProps) {
  const sizeClasses = {
    sm: "pt-24 pb-16 min-h-[300px]",
    md: "pt-24 pb-20 lg:pt-32 lg:pb-28 min-h-[380px]",
    lg: "min-h-[70vh] pt-28 pb-24",
  }[size];

  const isSmall = size === "sm";

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background border-b border-border/80",
        "flex items-center justify-center text-center",
        sizeClasses,
        className,
      )}
    >
      {backgroundImage ? (
        <div className="absolute inset-0">
          {/* Dekorativ fon rasmi — alt="" (R7.4) */}
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-[0.55] dark:opacity-[0.85] dark:brightness-[0.5] animate-ken-burns"
          />
          {/* Bitta nozik gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background dark:from-background/10 dark:via-background/50 dark:to-background" />
        </div>
      ) : null}

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <ScrollReveal>
          {Icon ? (
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 text-primary mb-6 shadow-md backdrop-blur-sm">
              <Icon className="h-6 w-6" />
            </div>
          ) : null}

          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
              {eyebrow}
            </p>
          ) : null}

          <h1
            className={cn(
              "font-serif font-black mb-6 text-foreground tracking-tight",
              isSmall
                ? "text-3xl md:text-4xl"
                : "text-4xl md:text-5xl lg:text-6xl",
            )}
          >
            {title}
          </h1>

          {description ? (
            <p className="text-sm md:text-base text-foreground/80 dark:text-muted-foreground font-medium leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          ) : null}

          {actions ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {actions}
            </div>
          ) : null}
        </ScrollReveal>
      </div>
    </section>
  );
}

export { PageHero };
export type { PageHeroProps };
