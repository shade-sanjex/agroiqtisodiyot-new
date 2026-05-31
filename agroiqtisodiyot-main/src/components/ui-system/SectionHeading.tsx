import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Kicker/yorliq — kichik uppercase editorial label */
  eyebrow?: string;
  /** Asosiy sarlavha (serif display) */
  title: string;
  /** Ixtiyoriy tavsif matni */
  description?: string;
  /** Tekislash: chap (default) yoki markaz */
  align?: "left" | "center";
  /** Semantik daraja (a11y) — default 'h2' */
  as?: "h1" | "h2" | "h3";
  /** Qo'shimcha klasslar */
  className?: string;
}

/**
 * SectionHeading — bo'lim sarlavhalari uchun izchil editorial blok.
 * Eyebrow + serif sarlavha + ixtiyoriy tavsif; chap yoki markaz tekislash bilan.
 * Faqat Dizayn_Tili token'lari/Tailwind klasslaridan foydalanadi (inline style yo'q).
 */
function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as = "h2",
  className,
}: SectionHeadingProps) {
  const Heading = as ?? "h2";
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isCenter ? "items-center text-center mx-auto" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground",
          )}
        >
          <span aria-hidden="true" className="h-px w-6 bg-accent/70" />
          {eyebrow}
        </span>
      ) : null}

      <Heading className="font-serif font-black tracking-tight text-3xl md:text-4xl text-foreground">
        {title}
      </Heading>

      {description ? (
        <p
          className={cn(
            "text-base text-muted-foreground leading-relaxed max-w-2xl",
            isCenter && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { SectionHeading };
export type { SectionHeadingProps };
