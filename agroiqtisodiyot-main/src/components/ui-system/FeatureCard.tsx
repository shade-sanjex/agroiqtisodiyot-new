import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui-system/GlassCard";

interface FeatureCardProps {
  /** Yo'nalish ikonasi (dekorativ) */
  icon: LucideIcon;
  /** Karta sarlavhasi */
  title: string;
  /** Qisqa tavsif matni */
  description: string;
  /** Qo'shimcha klasslar */
  className?: string;
}

/**
 * FeatureCard — Bosh_Sahifadagi "Asosiy Yo'nalishlar" bloklari uchun
 * ikona + sarlavha + tavsif naqshi. Qayta foydalanish uchun GlassCard ustiga
 * quriladi. Faqat Dizayn_Tili token'lari/Tailwind klasslaridan foydalanadi
 * (inline style yo'q).
 */
function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <GlassCard
      interactive
      className={cn("group relative h-full overflow-hidden p-6", className)}
    >
      {/* Dekorativ chap chetdagi gradient accent chiziq */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <h3 className="mb-3 text-base font-bold tracking-tight text-foreground">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </GlassCard>
  );
}

export { FeatureCard };
export type { FeatureCardProps };
