import { useEffect, useState, useRef, useCallback } from 'react';
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
  ArrowUpDown,
  ChevronDown,
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

type SortMode = 'newest' | 'oldest' | 'az' | 'za';

// Mouse-tracking tilt effect hook
function useTilt(ref: React.RefObject<HTMLDivElement | null>) {
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * -8; // max 4deg
      const tiltY = (x - 0.5) * 8;
      el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    },
    [ref]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, handleMouseMove, handleMouseLeave]);
}

// Individual journal card component with tilt
function JournalCard({
  journal,
  index,
  isFeatured,
  isNew,
  onSelect,
  formatDate,
}: {
  journal: Journal;
  index: number;
  isFeatured?: boolean;
  isNew?: boolean;
  onSelect: (j: Journal) => void;
  formatDate: (d: string) => string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef);

  const colors = [
    'from-blue-900 to-slate-900',
    'from-emerald-900 to-slate-900',
    'from-purple-900 to-slate-900',
    'from-amber-900 to-slate-900',
    'from-teal-900 to-slate-900',
  ];

  return (
    <div
      className={`journal-grid-item ${isFeatured ? 'journal-card-featured' : ''}`}
      style={{ animationDelay: `${index * 0.05 + 0.05}s` }}
    >
      <div
        ref={cardRef}
        className="journal-card cursor-pointer h-full"
        onClick={() => onSelect(journal)}
        style={{ transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease' }}
      >
        {/* Cover */}
        {journal.cover_image_url ? (
          <div className="journal-card-cover">
            <img
              src={journal.cover_image_url}
              alt={journal.title}
              loading="lazy"
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              {isNew && <span className="journal-badge-new">Yangi</span>}
            </div>

            {/* Info overlay */}
            <div className="journal-card-info">
              <h3 className="font-serif font-bold text-white text-sm md:text-base line-clamp-2 mb-1 drop-shadow-lg">
                {journal.title}
              </h3>
              <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(journal.created_at)}</span>
              </div>

              {/* Action buttons */}
              <div className="journal-card-actions flex items-center gap-2">
                <Button
                  size="sm"
                  className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 text-xs h-8 px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(journal);
                  }}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  Batafsil
                </Button>
                <Button
                  size="sm"
                  className="rounded-full bg-white text-slate-900 hover:bg-white/90 text-xs h-8 px-4 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(journal.pdf_url, '_blank');
                  }}
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Yuklab olish
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder cover */
          <div
            className={`journal-card-placeholder bg-gradient-to-br ${colors[index % colors.length]}`}
          >
            <div className="relative z-10 space-y-4">
              {isNew && <span className="journal-badge-new">Yangi</span>}
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
                <BookOpen className="h-7 w-7 text-white/60" />
              </div>
              <div>
                <p className="text-[8px] tracking-[0.25em] text-amber-300/60 font-bold uppercase mb-2">
                  AGROIQTISODIYOT
                </p>
                <h3 className="font-serif font-bold text-white/90 text-sm md:text-base line-clamp-4 leading-snug">
                  {journal.title}
                </h3>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-white/40 text-[10px]">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(journal.created_at)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Journals = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [sortOpen, setSortOpen] = useState(false);

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

  // Close sort dropdown on click outside
  useEffect(() => {
    if (!sortOpen) return;
    const close = () => setSortOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [sortOpen]);

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

  const filtered = journals
    .filter(
      (j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortMode) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Check if journal is "new" (within last 30 days)
  const isNew = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    return diff < 30 * 24 * 60 * 60 * 1000;
  };

  const sortLabels: Record<SortMode, string> = {
    newest: 'Eng yangi',
    oldest: 'Eng eski',
    az: 'A → Z',
    za: 'Z → A',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute bottom-10 right-10 w-40 h-40 border border-white/5 rounded-3xl rotate-12 animate-spin-slow" />
        <div className="absolute top-8 left-16 w-24 h-24 border border-white/5 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 animate-fade-in-up">
            Ilmiy Jurnallar
          </h1>
          <p
            className="text-white/70 max-w-lg mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            "AGROIQTISODIYOT" ilmiy jurnalining barcha sonlarini ko'ring, o'qing va yuklab oling
          </p>
        </div>
      </section>

      {/* Search & Sort Bar */}
      <section className="py-4 border-b border-border bg-background/80 backdrop-blur-lg sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            {/* Search */}
            <div className="relative flex-1">
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

            {/* Sort Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-11 px-4 gap-2 border-border/50"
                onClick={(e) => {
                  e.stopPropagation();
                  setSortOpen(!sortOpen);
                }}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-sm">{sortLabels[sortMode]}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </Button>

              {sortOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in-up">
                  {(Object.keys(sortLabels) as SortMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setSortMode(mode);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted ${
                        sortMode === mode
                          ? 'text-primary font-semibold bg-primary/5'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {sortLabels[mode]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              {filtered.length} ta jurnal topildi
            </p>
          )}
        </div>
      </section>

      {/* Main Content — Magazine Grid */}
      <section className="py-10 md:py-16 flex-1 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            /* Shimmer Loading Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-[3/4] w-full" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            /* Magazine Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((journal, i) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  index={i}
                  isFeatured={i === 0 && !search}
                  isNew={isNew(journal.created_at)}
                  onSelect={setSelectedJournal}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
                <FileX className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="font-serif font-bold text-xl mb-2">
                {search ? 'Natija topilmadi' : 'Hozircha jurnallar mavjud emas'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {search
                  ? "Boshqa kalit so'z bilan qidiring yoki barcha jurnallarni ko'ring"
                  : "Tez orada yangi jurnallar qo'shiladi"}
              </p>
              {search && (
                <Button
                  variant="outline"
                  className="mt-4 rounded-full"
                  onClick={() => setSearch('')}
                >
                  Filterni tozalash
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============ JOURNAL DETAIL MODAL ============ */}
      {selectedJournal && (
        <div
          className="journal-modal-backdrop"
          onClick={() => setSelectedJournal(null)}
        >
          <div
            className="journal-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover Image */}
            {selectedJournal.cover_image_url ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-[1.25rem]">
                <img
                  src={selectedJournal.cover_image_url}
                  alt={selectedJournal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Close button over image */}
                <button
                  onClick={() => setSelectedJournal(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all border border-white/10"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Title over image */}
                <div className="absolute bottom-4 left-5 right-5">
                  <h2 className="font-serif font-bold text-white text-xl md:text-2xl leading-tight drop-shadow-lg">
                    {selectedJournal.title}
                  </h2>
                </div>
              </div>
            ) : (
              /* No cover — header with close */
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
              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(selectedJournal.created_at)}</span>
                </div>
                {isNew(selectedJournal.created_at) && (
                  <span className="journal-badge-new">Yangi</span>
                )}
              </div>

              {/* Divider */}
              <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedJournal.description ||
                  "Ushbu nashr uchun qo'shimcha tavsif kiritilmagan. Nashrdagi barcha materiallar agrosanoat kompleksi, barqaror qishloq xo'jaligi iqtisodiyoti, agrotexnologiyalar va oziq-ovqat xavfsizligini ta'minlash yo'nalishlaridagi original ilmiy-tadqiqot ishlarini o'z ichiga oladi."}
              </p>

              {/* Type tag */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <BookOpen className="h-3 w-3" />
                  Ilmiy Nashr
                </span>
              </div>

              {/* Action Buttons */}
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
                    <Sparkles className="h-4 w-4 mr-2 text-amber-500 animate-pulse" />
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