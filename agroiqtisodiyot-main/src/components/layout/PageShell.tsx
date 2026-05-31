import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { cn } from '@/lib/utils';

interface PageShellProps {
  children: React.ReactNode;
  /** Footer'ni yashirish kerak bo'lsa (masalan Telegram ilova) */
  hideFooter?: boolean;
  /** BackToTop tugmasini ko'rsatish (standart: true) */
  showBackToTop?: boolean;
  /** main konteyneriga qo'shimcha klasslar */
  className?: string;
}

/**
 * PageShell — barcha sahifalar uchun yagona tartib wrapper'i.
 *
 * Mas'uliyati: `<Navbar/>` + `<main>` (slot) + `<Footer/>` + `<BackToTop/>`
 * ni izchil tartibda chiqarish (R3.12, R5.2).
 *
 * Eslatma: Navbar o'z spacer'ini (`<div className="h-16 lg:h-20" />`) ichida
 * render qiladi, shuning uchun PageShell qo'shimcha spacer qo'shmaydi.
 */
export function PageShell({
  children,
  hideFooter,
  showBackToTop,
  className,
}: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <main className={cn('flex-1', className)}>{children}</main>
      {!hideFooter && <Footer />}
      {showBackToTop !== false && <BackToTop />}
    </div>
  );
}
