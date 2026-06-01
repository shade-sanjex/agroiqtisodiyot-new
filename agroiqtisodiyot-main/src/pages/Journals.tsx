import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PageShell } from '@/components/layout/PageShell';
import { PageHero } from '@/components/ui-system/PageHero';
import { EmptyState } from '@/components/ui-system/EmptyState';
import { SkeletonGrid } from '@/components/ui-system/SkeletonGrid';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ImageCard } from '@/components/ImageCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Download,
  Search,
  FileX,
  X,
  Calendar,
  Eye,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import journalsHero from '@/assets/journals-hero.webp';

interface Journal {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  cover_image_url: string | null;
  created_at: string;
}

const getPaginationRange = (currentPage: number, totalPages: number) => {
  // If total pages is 7 or less, show all numbers directly for a cleaner UI
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const delta = 2; // Show 2 pages before and after current page
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l > 2) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

const Journals = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18; // 18 items per page (fits 6 columns grid perfectly)

  useEffect(() => {
    fetchJournals();
  }, []);

  // Reset pagination to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedJournal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedJournal]);

  const fetchJournals = async () => {
    try {
      const { data } = await supabase
        .from('journals')
        .select('*')
        .order('created_at', { ascending: false });

      setJournals(data || []);
    } catch (e) {
      console.error(e);
      setJournals([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = journals.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedJournals = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isNew = (date: string) => {
    return Date.now() - new Date(date).getTime() < 30 * 24 * 60 * 60 * 1000;
  };

  return (
    <PageShell>
      {/* ============ PAGE HERO ============ */}
      <PageHero
        eyebrow="ISCAD Nashrlari"
        title="Ilmiy Jurnallar"
        description={
          "\"AGROIQTISODIYOT\" ilmiy-amaliy nashrining barcha nashr etilgan sonlarini ko'ring va yuklab oling"
        }
        backgroundImage={journalsHero}
        icon={BookOpen}
      />

      {/* ============ STICKY SEARCH BAR (token-bound offset) ============ */}
      <section className="py-5 border-b border-border/60 bg-background/80 backdrop-blur-lg sticky top-[var(--nav-height-mobile)] lg:top-[var(--nav-height-desktop)] z-30 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              placeholder="Jurnal qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-10 rounded-full h-12 bg-secondary/35 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none text-xs md:text-sm font-semibold"
            />
            {search && (
              <button
                type="button"
                aria-label="Qidiruvni tozalash"
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {!loading && (
            <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mt-3.5 font-bold">
              {filtered.length} ta nashr topildi
            </p>
          )}
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="py-16 md:py-24 section-alt">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <SkeletonGrid count={12} aspect="3/4.2" columns={{ base: 2, sm: 2, md: 3, lg: 4 }} />
          ) : filtered.length > 0 ? (
            <div className="space-y-16">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12">
                {paginatedJournals.map((journal, i) => (
                  <ScrollReveal key={journal.id} delay={(i % 6) * 0.05}>
                    <button
                      type="button"
                      onClick={() => setSelectedJournal(journal)}
                      className="group cursor-pointer text-left w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >

                      {/* 3D realistic publication cover with shine (softened) */}
                      <div className="journal-cover-realistic cover-shine relative mb-5 border border-border/80 bg-slate-950 overflow-hidden">
                        {journal.cover_image_url ? (
                          <ImageCard
                            src={journal.cover_image_url}
                            alt={journal.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col justify-between p-6 text-slate-100 text-left">
                            <div className="flex justify-between items-start">
                              <div className="px-2.5 py-0.5 border border-slate-700/50 bg-slate-800/30 rounded text-xs uppercase tracking-widest text-slate-400 font-bold">
                                ISCAD
                              </div>
                              <BookOpen className="h-4.5 w-4.5 text-slate-500" />
                            </div>

                            <div className="space-y-3">
                              <p className="text-xs text-accent tracking-widest uppercase font-bold">AGROIQTISODIYOT</p>
                              <h3 className="text-base font-serif font-black leading-tight text-white line-clamp-4">
                                {journal.title}
                              </h3>
                            </div>
                          </div>
                        )}

                        {isNew(journal.created_at) && (
                          <div className="absolute top-4 left-4 z-20">
                            <span className="journal-badge-premium">Yangi</span>
                          </div>
                        )}

                        {/* Light hover overlay — NOT too dark */}
                        <div className="journal-hover-overlay">
                          <span className="bg-white/95 dark:bg-slate-900/95 text-foreground dark:text-slate-100 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg transition-all scale-90 group-hover:scale-100 flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5 text-primary" />
                            Batafsil
                          </span>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-1.5 px-1">
                        <div className="flex items-center justify-between text-xs font-black text-primary uppercase tracking-widest">
                          <span>№ NASHR</span>
                          <span>{new Date(journal.created_at).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' })}</span>
                        </div>
                        <h4 className="font-serif font-bold text-foreground text-sm md:text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
                          {journal.title}
                        </h4>
                      </div>
                    </button>
                  </ScrollReveal>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 md:gap-1.5 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="rounded-full w-8 h-8 md:w-9 md:h-9 p-0 flex items-center justify-center border-border/80 hover:bg-secondary/40 hover:text-foreground text-xs md:text-sm font-bold animate-in fade-in duration-300"
                  >
                    &lsaquo;
                  </Button>

                  {getPaginationRange(currentPage, totalPages).map((pageNum, idx) => {
                    if (pageNum === '...') {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="w-9 h-9 flex items-center justify-center text-muted-foreground/80 font-black text-sm select-none"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <Button
                        key={`page-${pageNum}`}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum as number)}
                        className={`rounded-full w-8 h-8 md:w-9 md:h-9 p-0 font-bold text-xs transition-all duration-300 ${
                          currentPage === pageNum
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                            : "border-border/80 hover:bg-secondary/45 hover:text-foreground hover:scale-105"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="rounded-full w-8 h-8 md:w-9 md:h-9 p-0 flex items-center justify-center border-border/80 hover:bg-secondary/40 hover:text-foreground text-xs md:text-sm font-bold animate-in fade-in duration-300"
                  >
                    &rsaquo;
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={FileX}
              title={search ? 'Natija topilmadi' : 'Hozircha jurnallar mavjud emas'}
              description={
                search
                  ? "Boshqa so'z bilan qidirib ko'ring"
                  : "Tez orada yangi jurnallar qo'shiladi"
              }
              action={
                search ? (
                  <Button
                    variant="outline"
                    className="rounded-full font-bold text-xs uppercase tracking-wider"
                    onClick={() => setSearch('')}
                  >
                    Qidiruvni tozalash
                  </Button>
                ) : undefined
              }
            />
          )}
        </div>
      </section>

      {/* ============ PREMIUM DETAIL MODAL (3D entrance) ============ */}
      {selectedJournal && createPortal(
        <div className="premium-modal-overlay" onClick={() => setSelectedJournal(null)}>
          <div className="premium-modal-content max-w-[90vw] md:max-w-2xl lg:max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header decoration */}
            <div className="h-1 bg-gradient-to-r from-primary to-accent" />

            <div className="p-6 md:p-8 space-y-6 text-left relative">
              {/* Close button */}
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setSelectedJournal(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground border border-border/60 z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">

                {/* Left column: 3D realistic vertical book cover */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="journal-cover-realistic cover-shine bg-slate-950 border border-slate-900 shadow-2xl relative w-full max-w-[180px] md:max-w-full aspect-[3/4.2] rounded-lg overflow-hidden">
                    {selectedJournal.cover_image_url ? (
                      <ImageCard
                        src={selectedJournal.cover_image_url}
                        alt={selectedJournal.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col justify-between p-4 text-slate-100 text-left bg-slate-900">
                        <div className="flex justify-between items-start">
                          <div className="px-1.5 py-0.5 border border-slate-700/50 bg-slate-800/30 rounded text-xs uppercase tracking-widest text-slate-400 font-bold">
                            ISCAD
                          </div>
                          <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs text-accent tracking-widest uppercase font-bold">AGROIQTISODIYOT</p>
                          <h4 className="text-xs font-serif font-black leading-tight text-white line-clamp-3">
                            {selectedJournal.title}
                          </h4>
                        </div>
                      </div>
                    )}
                    {/* Spine reflection and folding lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0)_2%,rgba(255,255,255,0.05)_3%,rgba(255,255,255,0)_6%,rgba(0,0,0,0.03)_7%,rgba(0,0,0,0)_90%)] pointer-events-none z-10" />
                    <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-black/20 shadow-[1px_0_2px_rgba(0,0,0,0.1)] z-20" />
                  </div>
                </div>

                {/* Right column: Info & actions */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">ILMIY NASHR</p>
                      <h3 className="text-xs font-black text-foreground">AGROIQTISODIYOT</h3>
                    </div>
                  </div>

                  <h2 className="font-serif font-black text-foreground text-lg md:text-xl leading-tight">
                    {selectedJournal.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-black text-muted-foreground uppercase tracking-widest border-y border-border/60 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{formatDate(selectedJournal.created_at)}</span>
                    </div>
                    {isNew(selectedJournal.created_at) && (
                      <span className="text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-full text-xs">Yangi nashr</span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground font-medium leading-relaxed max-h-[140px] overflow-y-auto pr-1">
                    {selectedJournal.description ||
                      "Ushbu nashrda agrosanoat kompleksi, barqaror qishloq xo'jaligi iqtisodiyoti va oziq-ovqat xavfsizligini ta'minlash yo'nalishlaridagi original ilmiy-tadqiqot ishlari taqdim etilgan."}
                  </p>

                  <div className="pt-4">
                    <Button
                      className="w-full rounded-full h-12 font-bold text-sm uppercase tracking-wider glow-button-primary bg-primary text-primary-foreground flex items-center justify-center"
                      onClick={() => {
                        try {
                          let pdfUrl = selectedJournal.pdf_url;
                          if (pdfUrl.includes('/api/file/') && !pdfUrl.split('/api/file/')[1].includes('/')) {
                            const parts = pdfUrl.split('/api/file/');
                            const fileId = parts[1].split('?')[0];
                            const safeTitle = selectedJournal.title.replace(/[^a-zA-Z0-9_а-яА-ЯёЁўЎқҚғҒҳҲоʻоʻгʻгʻ-]/g, '_') || 'journal';
                            pdfUrl = `${parts[0]}/api/file/${fileId}/${encodeURIComponent(safeTitle)}.pdf`;
                          }
                          
                          const url = new URL(pdfUrl);
                          url.searchParams.set('download', 'true');
                          window.open(url.toString(), '_blank');
                        } catch (e) {
                          let pdfUrl = selectedJournal.pdf_url;
                          if (pdfUrl.includes('/api/file/') && !pdfUrl.split('/api/file/')[1].includes('/')) {
                            const parts = pdfUrl.split('/api/file/');
                            const fileId = parts[1].split('?')[0];
                            const safeTitle = selectedJournal.title.replace(/[^a-zA-Z0-9_а-яА-ЯёЁўЎқҚғҒҳҲоʻоʻгʻгʻ-]/g, '_') || 'journal';
                            pdfUrl = `${parts[0]}/api/file/${fileId}/${encodeURIComponent(safeTitle)}.pdf`;
                          }
                          const separator = pdfUrl.includes('?') ? '&' : '?';
                          window.open(`${pdfUrl}${separator}download=true`, '_blank');
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Yuklab olish
                    </Button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </PageShell>
  );
};

export default Journals;
