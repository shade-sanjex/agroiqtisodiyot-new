import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles,
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-mesh-light dark:bg-mesh-dark border-b border-border/40 py-12 md:py-16 overflow-hidden">
        <div className="absolute bottom-10 right-10 w-40 h-40 border border-primary/5 dark:border-white/5 rounded-3xl rotate-12 animate-spin-slow" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 dark:bg-white/10 mb-4 animate-float-slow">
            <BookOpen className="h-8 w-8 text-primary dark:text-emerald-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black mb-4 text-foreground dark:text-white animate-fade-in-up">
            Ilmiy Jurnallar
          </h1>
          <p className="text-muted-foreground dark:text-white/70 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            "AGROIQTISODIYOT" ilmiy jurnalining barcha sonlarini ko'ring va yuklab oling
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-4 border-b border-border bg-background/80 backdrop-blur-lg sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Jurnal qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full h-11 border-border/50 shadow-inner"
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
            <p className="text-center text-xs text-muted-foreground mt-2">
              {filtered.length} ta jurnal topildi
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 md:py-16 flex-1">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-[3/4] w-full" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((journal, i) => (
                <ScrollReveal key={journal.id} delay={i * 0.05}>
                  <div
                    className="journal-card cursor-pointer h-full group/journal border border-border/70 shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 p-4 rounded-2xl flex flex-col justify-between"
                    onClick={() => setSelectedJournal(journal)}
                  >
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900 border border-border/20 shadow-md mb-4">
                      <div className="journal-page-fold" />
                      <div className="journal-cover-shine" />
                      <div className="journal-book-spine" />
                      
                      {journal.cover_image_url ? (
                        <img
                          src={journal.cover_image_url}
                          alt={journal.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover/journal:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 flex flex-col justify-between p-5">
                          <div className="flex justify-between items-start">
                            <BookOpen className="h-5 w-5 text-amber-300/60" />
                            <span className="text-[8px] font-bold text-white/40 tracking-[0.2em] uppercase">ISCAD</span>
                          </div>
                          <div className="space-y-2 text-left">
                            <p className="text-[8px] tracking-[0.2em] text-emerald-400 font-bold uppercase">Agroiqtisodiyot</p>
                            <h4 className="font-serif font-bold text-white/90 text-xs leading-snug line-clamp-3">
                              {journal.title}
                            </h4>
                          </div>
                        </div>
                      )}
                      
                      {/* Top badge */}
                      {isNew(journal.created_at) && (
                        <div className="absolute top-2.5 left-2.5 z-20">
                          <span className="journal-badge-new text-[10px] px-2 py-0.5">Yangi</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Metadata text below cover */}
                    <div className="space-y-1.5 px-1 text-left">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                        <span>№ Nashr</span>
                        <span>{new Date(journal.created_at).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' })}</span>
                      </div>
                      <h4 className="font-serif font-bold text-foreground text-xs md:text-sm line-clamp-2 leading-snug group-hover/journal:text-primary transition-colors duration-200">
                        {journal.title}
                      </h4>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
                <FileX className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="font-serif font-bold text-xl mb-2">
                {search ? 'Natija topilmadi' : 'Hozircha jurnallar mavjud emas'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {search ? "Boshqa kalit so'z bilan qidiring" : "Tez orada yangi jurnallar qo'shiladi"}
              </p>
              {search && (
                <Button variant="outline" className="mt-4 rounded-full" onClick={() => setSearch('')}>
                  Filterni tozalash
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============ DETAIL MODAL ============ */}
      {selectedJournal && (
        <div className="journal-modal-backdrop" onClick={() => setSelectedJournal(null)}>
          <div className="journal-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Cover */}
            {selectedJournal.cover_image_url ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-[1.25rem]">
                <img
                  src={selectedJournal.cover_image_url}
                  alt={selectedJournal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setSelectedJournal(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all border border-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-5 right-5">
                  <h2 className="font-serif font-bold text-white text-xl leading-tight drop-shadow-lg">
                    {selectedJournal.title}
                  </h2>
                </div>
              </div>
            ) : (
              <div className="relative gradient-hero rounded-t-[1.25rem] p-6 pb-8">
                <button
                  onClick={() => setSelectedJournal(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white/70" />
                </div>
                <h2 className="font-serif font-bold text-white text-xl leading-tight">
                  {selectedJournal.title}
                </h2>
              </div>
            )}

            {/* Content */}
            <div className="p-5 md:p-6 space-y-5">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(selectedJournal.created_at)}</span>
                </div>
                {isNew(selectedJournal.created_at) && (
                  <span className="journal-badge-new">Yangi</span>
                )}
              </div>

              <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />

              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedJournal.description ||
                  "Ushbu nashr uchun qo'shimcha tavsif kiritilmagan. Nashrdagi barcha materiallar agrosanoat kompleksi, barqaror qishloq xo'jaligi iqtisodiyoti va oziq-ovqat xavfsizligini ta'minlash yo'nalishlaridagi original ilmiy-tadqiqot ishlarini o'z ichiga oladi."}
              </p>

              <div className="pt-2">
                <Button
                  className="w-full rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/90 text-white font-medium"
                  onClick={() => window.open(selectedJournal.pdf_url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Yuklab olish
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