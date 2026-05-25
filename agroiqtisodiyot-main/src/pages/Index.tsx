import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { BackToTop } from '@/components/BackToTop';
import { 
  BookOpen, 
  Target, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Download, 
  Activity, 
  Check, 
  Cpu, 
  FolderOpen
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

const Index = () => {
  const [journals, setJournals] = useState<Journal[]>([]);

  useEffect(() => {
    fetchLatestJournals();
  }, []);

  const fetchLatestJournals = async () => {
    try {
      const { data } = await supabase
        .from('journals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      setJournals(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const features = [
    {
      icon: Target,
      title: 'Strategik Rivojlanish',
      desc: 'Qishloq xo\'jaligi sektorini rivojlantirish bo\'yicha uzoq muddatli dasturlar va strategiyalar ishlab chiqish',
    },
    {
      icon: BookOpen,
      title: 'Ilmiy Tadqiqotlar',
      desc: 'Oziq-ovqat xavfsizligi va agrar iqtisodiyot sohasida fundamental va amaliy tadqiqotlarni o\'tkazish',
    },
    {
      icon: Users,
      title: 'Kadrlar Tayyorlash',
      desc: 'Sohadagi tadqiqotchi va mutaxassislarni tayyorlash hamda ularning malakalarini tizimli oshirish',
    },
    {
      icon: TrendingUp,
      title: 'Xalqaro Hamkorlik',
      desc: 'Dunyo miqyosidagi yetakchi ilmiy markazlar bilan agrosanoat sohasida tajriba almashish',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* ============ MINIMAL HERO SECTION ============ */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-20">
        {/* Subtle grid pattern only */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />

        <div className="relative container mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <ScrollReveal direction="left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Qishloq xo'jaligi vazirligi huzurida
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight leading-none mb-4 text-foreground">
                  ISCAD
                </h1>
                
                <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-foreground/90 leading-tight max-w-2xl mb-4">
                  Oziq-ovqat va Qishloq Xo'jaligi Sohasida Strategik Rivojlanish Markazi
                </h2>

                <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed max-w-xl mb-10">
                  O'zbekiston agrosanoat sektori va oziq-ovqat xavfsizligini ta'minlashda fundamental ilmiy innovatsiyalar, islohotlar va tahlillar olib boruvchi yetakchi tashkilot.
                </p>

                {/* Clean CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <Link to="/journals">
                    <Button size="lg" className="w-full sm:w-auto font-medium rounded-lg px-8 h-12">
                      Ilmiy Nashrlar
                    </Button>
                  </Link>
                  <Link to="/article-checker">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-border text-foreground rounded-lg px-8 h-12">
                      <Cpu className="mr-2 h-4 w-4" />
                      AI Tahlil Tizimi
                    </Button>
                  </Link>
                </div>

                {/* Minimal Trust metrics */}
                <div className="grid grid-cols-3 gap-8 pt-10 border-t border-border mt-12 max-w-lg">
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground">500+</div>
                    <div className="text-xs text-muted-foreground mt-1">Ilmiy maqolalar</div>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground">24+</div>
                    <div className="text-xs text-muted-foreground mt-1">Ekspertlar</div>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground">7+</div>
                    <div className="text-xs text-muted-foreground mt-1">Yillik tajriba</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right — Clean Minimal Journal Card */}
            <div className="lg:col-span-5 relative mt-12 lg:mt-0 flex justify-center">
              <ScrollReveal direction="right" delay={0.2} className="relative w-full max-w-[340px] md:max-w-[380px]">
                
                {/* Clean Journal Cover Mockup */}
                <div className="relative w-full aspect-[3/4.2] rounded-xl bg-slate-900 shadow-2xl p-6 overflow-hidden group/hero transition-transform duration-500 hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
                  <div className="journal-page-fold" />
                  <div className="journal-book-spine" />
                  
                  {/* Inside card content */}
                  <div className="relative h-full flex flex-col justify-between z-10 text-slate-100">
                    <div className="flex justify-between items-start">
                      <div className="px-2 py-0.5 border border-slate-700 text-[10px] uppercase tracking-widest text-slate-400">
                        ISCAD JOURNAL
                      </div>
                      <img src={iscadLogo} alt="Logo" className="h-6 w-auto opacity-50 filter brightness-0 invert" />
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] text-slate-500 tracking-widest uppercase">ILMIY NASHR</p>
                      <h3 className="text-2xl font-serif font-black leading-tight text-white">
                        AGROIQTISODIYOT VA BARQAROR RIVOJLANISH
                      </h3>
                      
                      <div className="flex items-center gap-3 pt-6 border-t border-slate-800">
                        <div className="text-xs text-slate-400">Vol. 1 / May, 2026</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimal Floating Stat */}
                <div className="absolute -bottom-6 -right-6 md:-right-8 bg-background border border-border p-4 rounded-xl shadow-lg w-48 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Yuklashlar</p>
                      <p className="text-sm font-bold text-foreground">1,240 ta</p>
                    </div>
                  </div>
                </div>

              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ MINIMAL MISSION SECTION ============ */}
      <section className="py-24 section-alt">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-6xl mx-auto">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                  Barqaror Qishloq Xo'jaligi va <br />
                  <span className="text-primary">Oziq-ovqat Xavfsizligi</span>
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mt-4">
                  ISCAD markazi O'zbekiston agrar sektoridagi davlat islohotlarini qo'llab-quvvatlash uchun strategiyalar, prognozlar, tahliliy modellar va innovatsion yechimlarni taqdim etadi. 
                </p>

                <div className="space-y-3 pt-6">
                  {[
                    "Ilmiy asoslangan oziq-ovqat xavfsizligi strategiyalari",
                    "Doimiy monitoring va agrar bozorlar tahlili",
                    "Xalqaro ilg'or tajribalarni mahalliylashtirish"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground/80">{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6">
              <ScrollReveal delay={0.2}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Ilmiy nashrlar", value: 500, suffix: "+" },
                    { label: "Tahrir a'zolari", value: 24, suffix: "" },
                    { label: "Yillik tajriba", value: 7, suffix: "+" },
                    { label: "Xalqaro hamkorlar", value: 15, suffix: "+" },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-background border border-border p-6 rounded-xl">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={1500} />
                      </div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ CORE FEATURES SECTION ============ */}
      <section className="py-24 section-base">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4">
                Asosiy Yo'nalishlar
              </h2>
              <p className="text-sm text-muted-foreground">
                Agrosanoat kompleksi tarkibidagi iqtisodiy munosabatlarni yangi bosqichga ko'tarishga qaratilgan amaliy ishlar.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <Card className="iscad-card h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <feature.icon className="h-6 w-6 text-primary mb-6" />
                    <h3 className="text-base font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-auto">{feature.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CLEAN AI CHECKER SECTION ============ */}
      <section className="py-24 section-alt border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-6xl mx-auto">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-medium mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Tahlil Tizimi
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                  Maqolangizni AI yordamida tahlil qiling
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Innovatsion modelimiz maqolangizni O'zbekistondagi imlo qoidalari, ilmiy uslub va jurnal talablariga mosligini tekshirib beradi.
                </p>
                
                <div className="pt-6">
                  <Link to="/article-checker">
                    <Button className="rounded-lg px-6 font-medium">
                      Tekshirishni boshlash
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <ScrollReveal direction="right" delay={0.2} className="w-full max-w-md">
                <div className="bg-background border border-border rounded-xl shadow-sm p-6 relative">
                  <div className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center bg-slate-50 dark:bg-slate-900">
                    <FolderOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium">Faylni yuklang</p>
                    <p className="text-xs text-muted-foreground mt-1">.docx, .pdf yoki .txt</p>
                  </div>
                  <div className="mt-6 space-y-2 pt-6 border-t border-border/50">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-muted-foreground">Tahlil natijasi:</span>
                      <span className="text-primary">92% (A'lo)</span>
                    </div>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ LATEST JOURNALS SECTION ============ */}
      {journals.length > 0 && (
        <section className="py-24 section-base">
          <div className="container mx-auto px-4 max-w-6xl">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-serif font-bold">So'nggi Jurnallar</h2>
                </div>
                <Link to="/journals" className="mt-4 md:mt-0">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground -ml-4 md:ml-0">
                    Barchasi <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {journals.slice(0, 3).map((journal, i) => (
                <ScrollReveal key={journal.id} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                    <div className="journal-card mb-4">
                      <div className="relative aspect-[3/4.2]">
                        <div className="journal-page-fold" />
                        <div className="journal-book-spine" />
                        {journal.cover_image_url ? (
                          <img src={journal.cover_image_url} alt={journal.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-900 p-5 flex flex-col">
                            <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-4">ISCAD</div>
                            <h4 className="text-white font-serif text-sm">{journal.title}</h4>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-black rounded-full" onClick={() => window.open(journal.pdf_url, '_blank')}>
                            <Download className="h-4 w-4 mr-2" /> PDF Yuklash
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {new Date(journal.created_at).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })}
                      </div>
                      <h4 className="font-serif font-bold text-sm text-foreground line-clamp-2">
                        {journal.title}
                      </h4>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA SECTION ============ */}
      <section className="py-24 section-alt border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-serif font-bold mb-4">Bog'lanish</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-sm">
              Ilmiy hamkorlik va takliflar uchun ochiqmiz. Biz bilan bog'laning.
            </p>
            <Link to="/contact">
              <Button className="rounded-lg px-8 font-medium">
                Aloqa sahifasi
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;