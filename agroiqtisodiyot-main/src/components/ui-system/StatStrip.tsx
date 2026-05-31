import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { AnimatedCounter } from "@/components/AnimatedCounter";
import { GlassCard } from "@/components/ui-system/GlassCard";
import { cn } from "@/lib/utils";

export interface StatItem {
  /** Ko'rsatiladigan raqamli qiymat (AnimatedCounter `end`) */
  value: number;
  /** Statistika yorlig'i (uppercase editorial label) */
  label: string;
  /** Raqam oldidagi prefiks (masalan "$") */
  prefix?: string;
  /** Raqamdan keyingi suffiks (masalan "+", "%") */
  suffix?: string;
  /** Dekorativ ikona (ixtiyoriy) */
  icon?: LucideIcon;
}

export interface StatCardProps extends StatItem {
  className?: string;
}

export interface StatStripProps {
  /** Ko'rsatiladigan statistikalar ro'yxati */
  items: StatItem[];
  className?: string;
}

/**
 * StatCard — bitta statistik ko'rsatkichni `GlassCard` ustida chiqaradi.
 * Katta raqam uchun mavjud `AnimatedCounter` qayta ishlatiladi (R9.5 — logika o'zgarmaydi).
 * Faqat Dizayn_Tili token'lari/Tailwind klasslaridan foydalanadi (inline style yo'q).
 */
function StatCard({
  value,
  label,
  prefix,
  suffix,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <GlassCard
      className={cn(
        "flex flex-col items-start gap-2 p-5 sm:p-6",
        className,
      )}
    >
      {Icon ? (
        <span
          aria-hidden="true"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"
        >
          <Icon className="h-5 w-5" />
        </span>
      ) : null}

      <div className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
        <AnimatedCounter
          end={value}
          prefix={prefix}
          suffix={suffix}
          duration={1500}
        />
      </div>

      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-1">
        {label}
      </span>
    </GlassCard>
  );
}
StatCard.displayName = "StatCard";

/**
 * StatStrip — statistik kartalarni responsive lentaga (grid) joylaydi.
 * Har bir element uchun `StatCard` render qiladi.
 */
function StatStrip({ items, className }: StatStripProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6",
        className,
      )}
    >
      {items.map((item, index) => (
        <StatCard
          key={`${item.label}-${index}`}
          value={item.value}
          label={item.label}
          prefix={item.prefix}
          suffix={item.suffix}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
StatStrip.displayName = "StatStrip";

export { StatStrip, StatCard };
