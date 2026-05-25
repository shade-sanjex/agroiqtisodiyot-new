import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { ParticleBackground } from '@/components/ParticleBackground';
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
  Award, 
  ShieldCheck, 
  Check, 
  Cpu, 
  Zap, 
  FolderOpen
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-agriculture.jpg';
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
      color: 'from-blue-500/20 to-blue-600/5',
      iconColor: 'text-blue-400 bg-blue-500/10',
    },
    {
      icon: BookOpen,
      title: 'Ilmiy Tadqiqotlar',
      desc: 'Oziq-ovqat xavfsizligi va agrar iqtisodiyot sohasida fundamental va amaliy tadqiqotlarni o\'tkazish',
      color: 'from-emerald-500/20 to-emerald-600/5',
      iconColor: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      icon: Users,
      title: 'Kadrlar Tayyorlash',
      desc: 'Sohadagi tadqiqotchi va mutaxassislarni tayyorlash hamda ularning malakalarini tizimli oshirish',
      color: 'from-amber-500/20 to-amber-600/5',
      iconColor: 'text-amber-400 bg-amber-500/10',
    },
    {
      icon: TrendingUp,
      title: 'Xalqaro Hamkorlik',
      desc: 'Dunyo miqyosidagi yetakchi ilmiy markazlar bilan agrosanoat sohasida tajriba almashish',
      color: 'from-purple-500/20 to-purple-600/5',
      iconColor: 'text-purple-400 bg-purple-500/10',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* ============ PREMIUM HERO SECTION ============ */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-mesh-light dark:bg-mesh-dark border-b border-border/40 pt-12 pb-20">
        <ParticleBackground className="absolute inset-0 z-[1]" particleCount={40} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

        {/* Background Image Watermark */}
        <div 
          className="absolute inset-0 opacity-[0.1] dark:opacity-[0.18] mix-blend-luminosity dark:mix-blend-overlay pointer-events-none transition-opacity duration-300"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }} 
        />

        {/* Decorative dynamic shapes */}
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-float-slow -z-10" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl animate-float-delayed -z-10" />

        <div className="relative container mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <ScrollReveal direction="left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  Qishloq xo'jaligi vazirligi huzurida
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight leading-none mb-4">
                  <span className="bg-gradient-to-r from-primary via-emerald-600 to-secondary bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300">
                    ISCAD
                  </span>
                </h1>
                
                <h2 className="text-lg md:text-xl lg:text-2xl font-serif font-bold text-foreground dark:text-emerald-300 leading-snug max-w-2xl mb-4">
                  Oziq-ovqat va Qishloq Xo'jaligi Sohasida Strategik Rivojlanish va Tadqiqotlar Xalqaro Markazi
                </h2>

                <p className="text-sm md:text-base text-muted-foreground dark:text-white/70 font-light leading-relaxed max-w-xl mb-8">
                  ISCAD — O'zbekiston agrosanoat sektori va oziq-ovqat xavfsizligini ta'minlashda fundamental ilmiy innovatsiyalar, islohotlar va tahlillar olib boruvchi yetakchi davlat tashkilotidir.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <Link to="/journals">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-full shadow-lg shadow-emerald-950/20 px-8 h-12">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Jurnallarni ko'rish
                    </Button>
                  </Link>
                  <Link to="/article-checker">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 hover:bg-primary/10 dark:hover:bg-white/10 text-primary dark:text-white hover:text-primary-foreground dark:hover:text-white backdrop-blur-md rounded-full px-8 h-12">
                      <Sparkles className="mr-2 h-4 w-4 text-amber-500 dark:text-amber-300 animate-pulse" />
                      AI Maqola Tekshirish
                    </Button>
                  </Link>
                </div>

                {/* Trust metrics */}
                <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border/50 dark:border-white/10 mt-10 max-w-lg">
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white">500+</div>
                    <div className="text-xs text-muted-foreground dark:text-white/55 mt-1 font-medium">Ilmiy maqolalar</div>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white">24+</div>
                    <div className="text-xs text-muted-foreground dark:text-white/55 mt-1 font-medium">Tahrir a'zolari</div>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white">7+</div>
                    <div className="text-xs text-muted-foreground dark:text-white/55 mt-1 font-medium">Yillik tajriba</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Overlapping Dashboard Column */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
              <ScrollReveal direction="right" delay={0.2} className="relative w-full max-w-[340px] md:max-w-[380px]">
                
                {/* Overlapping Main Journal Card */}
                <div className="relative w-full aspect-[3/4.2] rounded-2xl bg-slate-900 border border-white/15 shadow-2xl p-4 overflow-hidden group/hero animate-float-slow">
                  <div className="journal-page-fold" />
                  <div className="journal-cover-shine" />
                  <div className="journal-book-spine" />
                  <img 
                    src={heroImage} 
                    alt="Featured Cover Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay group-hover/hero:scale-105 transition-transform duration-700" 
                  />
                  
                  {/* Inside card content */}
                  <div className="relative h-full flex flex-col justify-between z-10 p-4">
                    <div className="flex justify-between items-start">
                      <div className="px-2.5 py-1 rounded bg-white/15 backdrop-blur-md text-[9px] font-bold text-emerald-300 uppercase tracking-widest border border-white/10">
                        ISCAD JOURNAL
                      </div>
                      <img src={iscadLogo} alt="Logo" className="h-6 w-auto opacity-70 filter brightness-0 invert" />
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] text-amber-300 font-semibold tracking-widest uppercase">ILMIY NASHR</p>
                      <h3 className="text-lg md:text-xl font-serif font-black text-white leading-tight mb-2 drop-shadow-md">
                        AGROIQTISODIYOT VA BARQAROR RIVOJLANISH
                      </h3>
                      
                      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                          №1
                        </div>
                        <div>
                          <p className="text-[10px] text-white/50">Nashr sanasi</p>
                          <p className="text-xs font-medium text-white/90">May, 2026</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stat Card (Offset bottom-right) */}
                <div className="absolute -bottom-6 -right-6 md:-right-8 bg-card/95 dark:bg-slate-950/95 backdrop-blur-xl border border-border dark:border-white/10 p-4 rounded-2xl shadow-2xl w-48 md:w-56 animate-float-fast z-20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground dark:text-white/55">Yuklab olishlar</p>
                      <p className="text-xs font-bold text-foreground dark:text-white">+1,240 ta</p>
                    </div>
                  </div>
                  {/* Mini Sparkline SVG */}
                  <svg className="w-full h-8 text-emerald-600 dark:text-emerald-400" viewBox="0 0 100 30" fill="none">
                    <path d="M0,25 Q15,5 30,20 T60,5 T90,15 T100,10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M0,25 Q15,5 30,20 T60,5 T90,15 T100,10 L100,30 L0,30 Z" fill="url(#sparkline-grad-card)" opacity="0.1" />
                    <defs>
                      <linearGradient id="sparkline-grad-card" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Floating trust badge (Offset top-left) */}
                <div className="absolute -top-6 -left-6 bg-card/95 dark:bg-slate-950/95 backdrop-blur-xl border border-border dark:border-white/10 py-2.5 px-4 rounded-xl shadow-2xl flex items-center gap-2 z-20">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-3 w-3 animate-spin-slow" />
                  </div>
                  <span className="text-[11px] font-bold text-foreground dark:text-white/95">AI Tahlil Faol</span>
                </div>

              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ COHESIVE ASYMMETRIC MISSION & STATS SECTION ============ */}
      <section className="py-20 md:py-28 bg-mesh-light dark:bg-mesh-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Mission side */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <ScrollReveal>
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full tracking-wide">
                  BIZNING MISSIYAMIZ
                </span>
                <h2 className="text-3xl md:text-4.5xl font-serif font-black leading-tight text-balance">
                  Barqaror Qishloq Xo'jaligi va <br />
                  <span className="gradient-text-primary">Oziq-ovqat Xavfsizligi</span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  ISCAD markazi O'zbekiston agrar sektoridagi davlat islohotlarini qo'llab-quvvatlash uchun strategiyalar, prognozlar, tahliliy modellar va innovatsion yechimlarni taqdim etadi. Missiyamiz — barqaror agrar iqtisodiyotga erishishdir.
                </p>

                {/* Features list */}
                <div className="space-y-4 pt-4">
                  {[
                    "Ilmiy asoslangan oziq-ovqat xavfsizligi strategiyalari",
                    "Doimiy monitoring va agrar bozorlar tahlili",
                    "Sohada xalqaro ilg'or tajribalarni mahalliylashtirish"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Stats list */}
            <div className="lg:col-span-6">
              <ScrollReveal delay={0.2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {[
                    { label: "Ilmiy nashrlar ko'lami", value: 500, suffix: "+", desc: "Markazimiz tomonidan tayyorlangan tadqiqot ishlari", color: "border-l-blue-500" },
                    { label: "Tahrir hay'ati tarkibi", value: 24, suffix: "", desc: "Xalqaro va milliy professor-olimlar", color: "border-l-emerald-500" },
                    { label: "Agroiqtisodiyot tajribasi", value: 7, suffix: "+ yil", desc: "Tizimli tadqiqotlar va loyihalar", color: "border-l-amber-500" },
                    { label: "Xalqaro hamkorlik", value: 15, suffix: "+", desc: "Jahon miqyosidagi hamkor tashkilotlar", color: "border-l-purple-500" },
                  ].map((stat, idx) => (
                    <div key={idx} className={`bg-card/40 backdrop-blur-md rounded-2xl p-6 border-l-4 ${stat.color} border border-border/60 shadow-sm card-lift`}>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">{stat.label}</p>
                      <div className="text-3xl font-black mb-1">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={1500} />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{stat.desc}</p>
                    </div>
                  ))}

                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ CORE FEATURES SECTION ============ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-xs font-semibold rounded-full mb-3 tracking-wide">
                ASOSIY FAOLIYATIMIZ
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-black mb-4">
                Yo'nalishlarimiz va Ilmiy Loyihalar
              </h2>
              <p className="text-sm text-muted-foreground">
                ISCAD markazi agrosanoat kompleksi tarkibidagi iqtisodiy munosabatlarni yangi bosqichga ko'tarishga qaratilgan amaliy ishlarni bajaradi.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <Card className={`card-lift overflow-hidden border-0 bg-gradient-to-br ${feature.color} backdrop-blur-md h-full shadow-sm`}>
                  <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full">
                    <div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm ${feature.iconColor}`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-serif font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                    <div className="pt-6">
                      <div className="h-1 w-12 bg-primary/20 rounded-full group-hover:w-full transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HIGH-TECH MOCKUP AI CHECKER SECTION ============ */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-mesh-light dark:bg-mesh-dark border-t border-b border-border/40 text-foreground dark:text-white">
        <ParticleBackground className="absolute inset-0" particleCount={25} />

        <div className="relative container mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left AI Text side */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 dark:bg-white/10 border border-primary/10 dark:border-white/10 rounded-full text-primary dark:text-white/80 text-xs mb-4 backdrop-blur-sm">
                  <Cpu className="h-3.5 w-3.5 text-emerald-600 dark:text-amber-300 animate-pulse" />
                  Sun'iy Intellekt bilan Tekshirish
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-black leading-tight text-foreground dark:text-white">
                  Maqolangizni <br />
                  <span className="bg-gradient-to-r from-primary via-emerald-600 to-secondary bg-clip-text text-transparent dark:from-amber-300 dark:via-amber-200 dark:to-emerald-200">
                    AI yordamida tahlil qiling
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed max-w-xl">
                  Bizning innovatsion modelimiz maqolangizni O'zbekistondagi imlo qoidalari, ilmiy uslub va jurnal talablariga mosligini bir necha soniyada tahlil qilib beradi.
                </p>
                
                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {[
                    "Avtomatik imlo xatolarini topish",
                    "Jurnal talablariga moslik testi",
                    "Matn uslubini yaxshilash choralari",
                    "Tahrirga tayyorlik darajasi (ball)"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-3 w-3" />
                      </div>
                      <span className="text-xs text-foreground/85 dark:text-white/85">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Link to="/article-checker">
                    <Button size="lg" className="bg-primary text-primary-foreground dark:bg-white dark:text-navy-900 hover:bg-primary/90 dark:hover:bg-white/95 shadow-xl font-semibold rounded-full px-8">
                      <FileText className="mr-2 h-4 w-4" />
                      Maqolani tekshirish
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Interactive mock console */}
            <div className="lg:col-span-6 flex justify-center">
              <ScrollReveal direction="right" delay={0.2} className="w-full max-w-[450px]">
                <div className="bg-card dark:bg-slate-900/90 backdrop-blur-xl border border-border dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 relative">
                  
                  {/* Console Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border dark:border-white/15 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 dark:text-white/40 font-mono">ISCAD_AI_ANALYZER.EXE</span>
                  </div>

                  {/* Mock Drag & Drop Box */}
                  <div className="border border-dashed border-primary/25 dark:border-white/20 rounded-xl p-8 text-center relative overflow-hidden bg-muted/40 dark:bg-slate-950/40">
                    
                    {/* Scanner line animation */}
                    <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 dark:via-emerald-400 to-transparent animate-scanline z-10" />

                    <div className="relative z-20 space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center mx-auto border border-primary/10 dark:border-white/10">
                        <FolderOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/80 dark:text-white/80 font-bold">Maqola faylini bu yerga torting</p>
                        <p className="text-[10px] text-muted-foreground/60 dark:text-white/40 mt-1">.docx, .pdf yoki .txt formatlari</p>
                      </div>
                      <div className="pt-2">
                        <span className="inline-block px-3 py-1 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          FAYL YUKLASH
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Results panel */}
                  <div className="mt-6 space-y-3 pt-6 border-t border-border dark:border-white/10">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground dark:text-white/60">Tahlil natijasi:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">92% (A'lo)</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                    </div>
                    <p className="text-[10px] text-muted-foreground/75 dark:text-white/45 italic leading-snug">
                      * Matn 3450 ta so'zdan iborat, annotatsiya va kalit so'zlar aniqlandi. Imlo xatoliklar darajasi past.
                    </p>
                  </div>

                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ PREMIUM LATEST JOURNALS SECTION ============ */}
      {journals.length > 0 && (
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 text-left">
                <div>
                  <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full tracking-wide mb-3">
                    ILMIY NASHRLARIMIZ
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-black">
                    So'nggi Jurnal Nashrlari
                  </h2>
                </div>
                <Link to="/journals" className="mt-4 md:mt-0">
                  <Button variant="outline" className="rounded-full group h-11 border-primary/20 text-primary">
                    Barcha jurnallar
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {journals.slice(0, 6).map((journal, i) => {
                const isNewJournal = Date.now() - new Date(journal.created_at).getTime() < 30 * 24 * 60 * 60 * 1000;
                return (
                  <ScrollReveal key={journal.id} delay={i * 0.1}>
                    <div className="journal-card group h-full flex flex-col justify-between bg-card border border-border/70 rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 p-4">
                      
                      {/* Journal cover aspect ratio container */}
                      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900 border border-border/20 shadow-md mb-5">
                        <div className="journal-page-fold" />
                        <div className="journal-cover-shine" />
                        <div className="journal-book-spine" />

                        {journal.cover_image_url ? (
                          <img
                            src={journal.cover_image_url}
                            alt={journal.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 flex flex-col justify-between p-6">
                            <div className="flex justify-between items-start">
                              <BookOpen className="h-6 w-6 text-amber-300/60" />
                              <span className="text-[8px] font-bold text-white/40 tracking-[0.2em] uppercase">ISCAD</span>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[8px] tracking-[0.2em] text-emerald-400 font-bold uppercase">Agroiqtisodiyot</p>
                              <h4 className="font-serif font-bold text-white/90 text-sm leading-snug line-clamp-3">
                                {journal.title}
                              </h4>
                            </div>
                          </div>
                        )}

                        {/* Top badge */}
                        {isNewJournal && (
                          <div className="absolute top-3 left-3 z-20">
                            <span className="journal-badge-new">Yangi</span>
                          </div>
                        )}

                        {/* Hover Overlay info */}
                        <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-10 text-left">
                          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">NASHRIY MA'LUMOT</p>
                          <div className="space-y-4">
                            <h4 className="font-serif font-bold text-white text-base leading-snug line-clamp-3">
                              {journal.title}
                            </h4>
                            <div className="h-0.5 w-8 bg-emerald-400 rounded-full" />
                            <p className="text-[11px] text-white/60 line-clamp-3 leading-relaxed">
                              {journal.description || "Ushbu nashrda agrosanoat sohasi, bozor islohotlari va barqaror qishloq xo'jaligiga oid eng sara ilmiy maqolalar to'plangan."}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="w-full rounded-full bg-white text-navy-900 hover:bg-white/90 text-xs font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(journal.pdf_url, '_blank');
                            }}
                          >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Yuklab olish (.pdf)
                          </Button>
                        </div>
                      </div>

                      {/* Card footer description */}
                      <div className="space-y-2 px-1 text-left">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                          <span>№{i + 1} Nashr</span>
                          <span>{new Date(journal.created_at).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })}</span>
                        </div>
                        <h4 className="font-serif font-bold text-foreground text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
                          {journal.title}
                        </h4>
                      </div>

                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ CONTACT CTA SECTION ============ */}
      <section className="py-20 md:py-28 bg-background border-t border-border/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                HAMKORLIK
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-black">
                Biz bilan <span className="gradient-text-primary">bog'laning</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Tadqiqotlar bo'yicha savollaringiz bormi yoki ilmiy hamkorlik qilmoqchimisiz? Biz muloqot va takliflar uchun doimo ochiqmiz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/contact">
                  <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                    Aloqa sahifasi
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                    Markaz haqida
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;