import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Download,
  Search,
  FileX,
  X,
  Calendar,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import iscadLogo from '@/assets/iscad-logo.png';

interface Journal {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  cover_image_url: string | null;
  created_at: string;
}

const Journals = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);

  useEffect(() => {
    fetchJournals();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const filtered = journals.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description?.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* ============ MINIMAL HERO ============ */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-border overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight">
              Ilmiy Jurnallar
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
              "AGROIQTISODIYOT" ilmiy jurnalining barcha sonlarini ko'ring va yuklab oling
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ SEARCH BAR ============ */}
      <section className="py-6 border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 lg:top-14 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Jurnal qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full h-11 bg-slate-50 dark:bg-slate-900 border-border shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {!loading && (
            <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
              {filtered.length} ta nashr topildi
            </p>
          )}
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="py-16 md:py-24 flex-1 section-alt">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-[3/4.2] w-full" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
              {filtered.map((journal, i) => (
                <ScrollReveal key={journal.id} delay={i * 0.05}>
                  <div className="group cursor-pointer" onClick={() => setSelectedJournal(journal)}>
                    
                    {/* Clean Journal Cover Mockup */}
                    <div className="journal-card relative aspect-[3/4.2] rounded-xl overflow-hidden mb-5">
                      <div className="absolute inset-0 bg-slate-900" />
                      <div className="journal-page-fold" />
                      <div className="journal-book-spine" />
                      
                      {journal.cover_image_url ? (
                        <img
                          src={journal.cover_image_url}
                          alt={journal.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col justify-between p-5 text-slate-100 group-hover:scale-[1.02] transition-transform duration-500">
                          <div className="flex justify-between items-start">
                            <div className="px-2 py-0.5 border border-slate-700 text-[9px] uppercase tracking-widest text-slate-400">
                              ISCAD
                            </div>
                            <BookOpen className="h-4 w-4 opacity-30" />
                          </div>

                          <div className="space-y-3">
                            <p className="text-[9px] text-slate-500 tracking-widest uppercase">AGROIQTISODIYOT</p>
                            <h3 className="text-lg font-serif font-black leading-tight text-white line-clamp-4">
                              {journal.title}
                            </h3>
                          </div>
                        </div>
                      )}
                      
                      {isNew(journal.created_at) && (
                        <div className="absolute top-3 left-3 z-20">
                          <span className="journal-badge-new">Yangi</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <Button variant="secondary" className="rounded-full shadow-lg pointer-events-none">
                          <BookOpen className="h-4 w-4 mr-2" /> O'qish
                        </Button>
                      </div>
                    </div>
                    
                    {/* Minimal Metadata */}
                    <div className="space-y-2 px-1 text-left">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                        <span>№ Nashr</span>
                        <span>{new Date(journal.created_at).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' })}</span>
                      </div>
                      <h4 className="font-serif font-bold text-foreground text-sm md:text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
                        {journal.title}
                      </h4>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-6">
                <FileX className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-serif font-bold text-xl mb-2">
                {search ? 'Natija topilmadi' : 'Hozircha jurnallar mavjud emas'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {search ? "Boshqa so'z bilan qidirib ko'ring" : "Tez orada yangi jurnallar qo'shiladi"}
              </p>
              {search && (
                <Button variant="outline" className="mt-6 rounded-lg" onClick={() => setSearch('')}>
                  Qidiruvni tozalash
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============ MINIMAL MODAL ============ */}
      {selectedJournal && (
        <div className="journal-modal-backdrop" onClick={() => setSelectedJournal(null)}>
          <div className="journal-modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Minimal Header */}
            <div className="relative p-6 pb-0 flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <button
                onClick={() => setSelectedJournal(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <h2 className="font-serif font-bold text-foreground text-xl md:text-2xl leading-tight">
                {selectedJournal.title}
              </h2>

              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(selectedJournal.created_at)}</span>
                </div>
                {isNew(selectedJournal.created_at) && (
                  <span className="text-primary">Yangi nashr</span>
                )}
              </div>

              <div className="w-full h-px bg-border" />

              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedJournal.description ||
                  "Ushbu nashrda agrosanoat kompleksi, barqaror qishloq xo'jaligi iqtisodiyoti va oziq-ovqat xavfsizligini ta'minlash yo'nalishlaridagi original ilmiy-tadqiqot ishlari taqdim etilgan."}
              </p>

              <div className="pt-4">
                <Button
                  className="w-full rounded-lg h-12 font-medium text-base shadow-sm"
                  onClick={() => window.open(selectedJournal.pdf_url, '_blank')}
                >
                  <Download className="h-5 w-5 mr-2" />
                  PDF ni Yuklab olish
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Journals;