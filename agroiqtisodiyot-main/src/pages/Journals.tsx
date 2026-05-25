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
  Eye,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    fetchJournals();
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* ============ PREMIUM HERO with Parallax ============ */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-border/80 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" style={{ transform: `translateY(${scrollY * 0.05}px)` }} />
        <div className="mesh-gradient-glow top-[-300px] left-[-300px] opacity-70" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
        
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight">
              Ilmiy Jurnallar
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
              "AGROIQTISODIYOT" ilmiy-amaliy nashrining barcha nashr etilgan sonlarini ko'ring va yuklab oling
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ SEARCH BAR ============ */}
      <section className="py-5 border-b border-border/60 bg-background/80 backdrop-blur-lg sticky top-16 lg:top-20 z-30 shadow-sm">
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
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {!loading && (
            <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground mt-3.5 font-bold">
              {filtered.length} ta nashr topildi
            </p>
          )}
        </div>
      </section>

      {/* ============ MAIN CONTENT with 3D Cards ============ */}
      <section 
        className="py-16 md:py-24 flex-1 section-alt"
        style={{ transform: `translateY(${Math.max(0, (scrollY - 300) * -0.01)}px)` }}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border p-2">
                  <Skeleton className="aspect-[3/4.2] w-full rounded-xl shimmer" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {filtered.map((journal, i) => (
                <ScrollReveal key={journal.id} delay={i * 0.05}>
                  <div className="group cursor-pointer text-left" onClick={() => setSelectedJournal(journal)}>
                    
                    {/* 3D Realistic publication cover with shine */}
                    <div className="journal-cover-realistic cover-shine relative mb-5 border border-border/80 bg-slate-950 overflow-hidden">
                      {journal.cover_image_url ? (
                        <img
                          src={journal.cover_image_url}
                          alt={journal.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col justify-between p-6 text-slate-100 text-left">
                          <div className="flex justify-between items-start">
                            <div className="px-2.5 py-0.5 border border-slate-700/50 bg-slate-800/30 rounded text-[8px] uppercase tracking-widest text-slate-400 font-bold">
                              ISCAD
                            </div>
                            <BookOpen className="h-4.5 w-4.5 text-slate-500" />
                          </div>

                          <div className="space-y-3">
                            <p className="text-[8px] text-accent tracking-widest uppercase font-bold">AGROIQTISODIYOT</p>
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
                        <span className="bg-white/95 dark:bg-slate-900/95 text-foreground dark:text-slate-100 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg transition-all scale-90 group-hover:scale-100 flex items-center gap-2">
                          <Eye className="h-3.5 w-3.5 text-primary" />
                          Batafsil
                        </span>
                      </div>
                    </div>
                    
                    {/* Metadata */}
                    <div className="space-y-1.5 px-1">
                      <div className="flex items-center justify-between text-[9px] font-black text-primary uppercase tracking-widest">
                        <span>№ NASHR</span>
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
              <div className="w-16 h-16 rounded-full bg-secondary/80 flex items-center justify-center mx-auto mb-6 border border-border">
                <FileX className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-serif font-black text-xl mb-2">
                {search ? 'Natija topilmadi' : 'Hozircha jurnallar mavjud emas'}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm font-medium">
                {search ? "Boshqa so'z bilan qidirib ko'ring" : "Tez orada yangi jurnallar qo'shiladi"}
              </p>
              {search && (
                <Button variant="outline" className="mt-6 rounded-full font-bold text-xs uppercase tracking-wider" onClick={() => setSearch('')}>
                  Qidiruvni tozalash
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============ PREMIUM DETAIL MODAL (3D entrance) ============ */}
      {selectedJournal && (
        <div className="premium-modal-overlay" onClick={() => setSelectedJournal(null)}>
          <div className="premium-modal-content max-w-lg bg-card border border-border" onClick={(e) => e.stopPropagation()}>
            
            {/* Header decoration */}
            <div className="h-1 bg-gradient-to-r from-primary to-accent" />

            <div className="p-6 md:p-8 space-y-6 text-left">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <button
                  onClick={() => setSelectedJournal(null)}
                  className="p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground border border-border/60"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Cover Image Preview */}
              {selectedJournal.cover_image_url && (
                <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-border/60">
                  <img 
                    src={selectedJournal.cover_image_url} 
                    alt={selectedJournal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2 className="font-serif font-black text-foreground text-xl md:text-2xl leading-tight">
                {selectedJournal.title}
              </h2>

              <div className="flex items-center gap-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest border-y border-border/60 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>{formatDate(selectedJournal.created_at)}</span>
                </div>
                {isNew(selectedJournal.created_at) && (
                  <span className="text-accent">Yangi nashr</span>
                )}
              </div>

              <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
                {selectedJournal.description ||
                  "Ushbu nashrda agrosanoat kompleksi, barqaror qishloq xo'jaligi iqtisodiyoti va oziq-ovqat xavfsizligini ta'minlash yo'nalishlaridagi original ilmiy-tadqiqot ishlari taqdim etilgan."}
              </p>

              <div className="pt-4">
                <Button
                  className="w-full rounded-full h-12 font-bold text-sm uppercase tracking-wider glow-button-primary bg-primary text-primary-foreground"
                  onClick={() => window.open(selectedJournal.pdf_url, '_blank')}
                >
                  <Download className="h-4.5 w-4.5 mr-2" />
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