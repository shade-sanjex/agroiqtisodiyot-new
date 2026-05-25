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
      <section className="gradient-hero text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute bottom-10 right-10 w-40 h-40 border border-white/5 rounded-3xl rotate-12 animate-spin-slow" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 animate-fade-in-up">
            Ilmiy Jurnallar
          </h1>
          <p className="text-white/70 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-[3/4] w-full" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((journal, i) => (
                <ScrollReveal key={journal.id} delay={i * 0.06}>
                  <div
                    className="journal-card cursor-pointer h-full"
                    onClick={() => setSelectedJournal(journal)}
                  >
                    {journal.cover_image_url ? (
                      <div className="journal-card-cover">
                        <img
                          src={journal.cover_image_url}
                          alt={journal.title}
                          loading="lazy"
                        />
                        {/* Badge */}
                        {isNew(journal.created_at) && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="journal-badge-new">Yangi</span>
                          </div>
                        )}

                        {/* Info overlay */}
                        <div className="journal-card-info">
                          <h3 className="font-serif font-bold text-white text-sm line-clamp-2 mb-1 drop-shadow-lg">
                            {journal.title}
                          </h3>
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(journal.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="journal-card-placeholder bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="relative z-10 space-y-3 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white/50" />
                          </div>
                          <h3 className="font-serif font-bold text-white/80 text-sm line-clamp-3 leading-snug">
                            {journal.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(journal.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    )}
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

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className="flex-1 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/90 text-white font-medium"
                  onClick={() => window.open(selectedJournal.pdf_url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Yuklab olish
                </Button>
                <Link to="/article-checker" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-primary/30 text-primary hover:bg-primary/5 hover:text-primary font-medium"
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                    AI Tekshirish
                  </Button>
                </Link>
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