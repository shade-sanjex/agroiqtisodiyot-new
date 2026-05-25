import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Download, Search, FileX, Sparkles, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Journal {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  cover_image_url: string | null;
  created_at: string;
}

const getBookStyles = (index: number) => {
  const colors = [
    { bg: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', spine: '#172554' }, // Navy
    { bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)', spine: '#022c22' }, // Green
    { bg: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)', spine: '#450a0a' }, // Crimson
    { bg: 'linear-gradient(135deg, #115e59 0%, #042f2e 100%)', spine: '#042f2e' }, // Teal
    { bg: 'linear-gradient(135deg, #581c87 0%, #3b0764 100%)', spine: '#3b0764' }, // Purple
  ];
  return colors[index % colors.length];
};

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const Journals = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    fetchJournals();
  }, []);

  // Responsive column tracker for bookshelves
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1024) setColumns(4); // lg
      else if (w >= 768) setColumns(3); // md
      else setColumns(2); // sm / xs
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const filtered = journals.filter(j =>
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

  const shelves = chunkArray(filtered, columns);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-zinc-950">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute bottom-10 right-10 w-40 h-40 border border-white/5 rounded-3xl rotate-12 animate-spin-slow" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 animate-fade-in-up">Ilmiy Jurnallar</h1>
          <p className="text-white/70 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            "AGROIQTISODIYOT" ilmiy jurnalining barcha sonlari interaktiv 3D javonda
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-6 border-b border-border bg-background/80 backdrop-blur-lg sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Jurnal qidirish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 rounded-full h-11 border-border/50 shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* 3D Bookshelf Section */}
      <section className="py-16 md:py-24 flex-1">
        <div className="container mx-auto px-4 max-w-5xl">
          {loading ? (
            /* Loading State as Bookshelves */
            <div className="bookshelf-perspective space-y-16">
              {Array.from({ length: 2 }).map((_, shelfIndex) => (
                <div key={shelfIndex} className="mb-16">
                  <div className="flex justify-around items-end px-6 gap-6 h-[220px]">
                    {Array.from({ length: columns }).map((_, i) => (
                      <div key={i} className="w-[120px] md:w-[140px] h-[170px] md:h-[200px] flex-shrink-0">
                        <Skeleton className="w-full h-full rounded-md shadow-lg" />
                      </div>
                    ))}
                  </div>
                  <div className="bookshelf-shelf mt-2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            /* 3D Bookshelf Content */
            <div className="bookshelf-perspective space-y-16">
              {shelves.map((shelfBooks, shelfIndex) => (
                <ScrollReveal key={shelfIndex} delay={shelfIndex * 0.05}>
                  <div className="mb-16">
                    {/* Books on this shelf */}
                    <div className="flex justify-around items-end px-6 gap-6 h-[220px]">
                      {shelfBooks.map((journal) => {
                        const originalIndex = journals.findIndex(j => j.id === journal.id);
                        const styles = getBookStyles(originalIndex !== -1 ? originalIndex : 0);

                        return (
                          <div 
                            key={journal.id} 
                            onClick={() => setSelectedJournal(journal)}
                            className="book-3d-container flex-shrink-0 w-[120px] md:w-[140px] h-[170px] md:h-[200px] cursor-pointer"
                          >
                            <div className="book-3d-card">
                              {/* Front Cover */}
                              {journal.cover_image_url ? (
                                <div 
                                  className="book-3d-front"
                                  style={{ backgroundImage: `url(${journal.cover_image_url})` }}
                                />
                              ) : (
                                <div 
                                  className="book-3d-front flex flex-col justify-between p-2.5 md:p-3 text-white"
                                  style={{ background: styles.bg }}
                                >
                                  <div className="border border-amber-400/30 rounded p-1.5 md:p-2 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[6px] md:text-[7px] tracking-widest text-amber-300 font-bold">ISCAD</span>
                                      <BookOpen className="h-2.5 w-2.5 md:h-3 md:w-3 text-amber-300/80" />
                                    </div>
                                    <p className="font-serif font-bold text-center text-[9px] md:text-xs line-clamp-4 my-auto text-amber-100/90 leading-tight">
                                      {journal.title}
                                    </p>
                                    <div className="text-[6px] md:text-[7px] text-center text-white/40">
                                      ILMIY NASHR
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Spine */}
                              <div className="book-3d-spine" style={{ backgroundColor: styles.spine }}>
                                <div className="book-3d-spine-content">
                                  <span className="book-3d-spine-text">
                                    {journal.title}
                                  </span>
                                </div>
                              </div>

                              {/* Depth planes */}
                              <div className="book-3d-right" />
                              <div className="book-3d-top" />
                              <div className="book-3d-bottom" />
                              <div className="book-3d-back" style={{ backgroundColor: styles.spine }} />
                            </div>
                          </div>
                        );
                      })}

                      {/* Flex fillers to keep layout aligned cleanly when shelf is not full */}
                      {shelfBooks.length < columns && 
                        Array.from({ length: columns - shelfBooks.length }).map((_, i) => (
                          <div key={i} className="w-[120px] md:w-[140px] h-[170px] md:h-[200px] opacity-0 flex-shrink-0" />
                        ))
                      }
                    </div>

                    {/* Shelf Plank */}
                    <div className="bookshelf-shelf mt-2" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <FileX className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif font-bold text-xl mb-2">
                {search ? 'Natija topilmadi' : 'Hozircha jurnallar mavjud emas'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {search ? 'Boshqa kalit so\'z bilan qidiring' : 'Tez orada yangi jurnallar qo\'shiladi'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Book Opener Modal */}
      {selectedJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          {/* Backdrop Click to Close */}
          <div className="absolute inset-0" onClick={() => setSelectedJournal(null)} />

          <div className="relative w-full max-w-3xl overflow-visible z-10 animate-scale-in">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedJournal(null)}
              className="absolute -top-12 right-0 md:-right-12 text-white/80 hover:text-white bg-black/25 hover:bg-black/40 p-2 rounded-full backdrop-blur-md transition-all border border-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* 3D Open Book Layout */}
            <div className="open-book-container flex flex-col md:flex-row">
              {/* Left Page (Cover) */}
              <div className="open-book-left">
                {selectedJournal.cover_image_url ? (
                  <div className="w-[160px] md:w-[200px] aspect-[3/4] rounded-md shadow-2xl overflow-hidden border border-black/10 transition-transform hover:scale-[1.02]">
                    <img 
                      src={selectedJournal.cover_image_url} 
                      alt={selectedJournal.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-[160px] md:w-[200px] aspect-[3/4] rounded-md shadow-2xl overflow-hidden border border-black/10 flex flex-col justify-between p-4 text-white transition-transform hover:scale-[1.02]"
                    style={{ background: getBookStyles(journals.indexOf(selectedJournal)).bg }}
                  >
                    <div className="border border-amber-400/30 rounded p-3 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-[7px] md:text-[8px] tracking-widest text-amber-300 font-bold">ISCAD</span>
                        <BookOpen className="h-3.5 w-3.5 text-amber-300/80" />
                      </div>
                      <p className="font-serif font-bold text-center text-xs md:text-sm line-clamp-5 my-auto text-amber-100/90 leading-snug">
                        {selectedJournal.title}
                      </p>
                      <div className="text-[7px] md:text-[8px] text-center text-white/40">
                        ILMIY NASHR
                      </div>
                    </div>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 mt-4 font-semibold tracking-wider uppercase">ISCAD Kutubxonasi</span>
              </div>

              {/* Right Page (Details) */}
              <div className="open-book-right">
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 text-xs text-primary font-bold tracking-wider uppercase">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Jurnal Tafsiloti</span>
                  </div>
                  
                  <h2 className="text-lg md:text-xl font-serif font-bold text-slate-800 leading-tight">
                    {selectedJournal.title}
                  </h2>
                  <div className="w-12 h-0.5 bg-amber-500" />
                  
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedJournal.description || "Ushbu nashr uchun qo'shimcha tavsif kiritilmagan. Nashrdagi barcha materiallar agrosanoat kompleksi, barqaror qishloq xo'jaligi iqtisodiyoti, agrotexnologiyalar va oziq-ovqat xavfsizligini ta'minlash yo'nalishlaridagi original ilmiy-tadqiqot ishlarini o'z ichiga oladi."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-[10px] md:text-xs text-slate-500">
                    <div>
                      <span className="block text-slate-400">Nashr sanasi:</span>
                      <span className="font-semibold text-slate-700">{formatDate(selectedJournal.created_at)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Turi:</span>
                      <span className="font-semibold text-slate-700">Ilmiy Nashrlar</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button 
                      className="flex-1 rounded-full shadow-md bg-gradient-to-r from-primary to-primary/90 text-white font-medium"
                      onClick={() => window.open(selectedJournal.pdf_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Yuklab olish
                    </Button>
                    <Link to="/article-checker" className="flex-1">
                      <Button variant="outline" className="w-full rounded-full border-primary/30 text-primary hover:bg-primary/5 hover:text-primary font-medium">
                        <Sparkles className="h-4 w-4 mr-2 text-amber-500 animate-pulse" />
                        AI Tekshirish
                      </Button>
                    </Link>
                  </div>
                </div>
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