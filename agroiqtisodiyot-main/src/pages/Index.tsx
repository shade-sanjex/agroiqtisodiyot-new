import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Activity, 
  Check, 
  Cpu, 
  FolderOpen
} from 'lucide-react';
import iscadLogo from '@/assets/iscad-logo.png';
import heroBg from '@/assets/hero-agriculture.jpg';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 3D mouse tracking for hero cover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

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

  // Parallax offset calculator
  const getParallax = (speed: number, offset = 0) => {
    if (isMobile) return 0;
    return (scrollY - offset) * speed;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* ============ PREMIUM HERO SECTION ============ */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-16 pb-20">
        {/* Background Image with Ken Burns effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={heroBg} 
            alt="Agriculture background" 
            className="w-full h-full object-cover opacity-[0.55] dark:opacity-[0.85] dark:brightness-[0.5] animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background dark:from-background/10 dark:via-background/50 dark:to-background" />
        </div>

        {/* Visual Background Effects with Parallax */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50 dark:opacity-30" style={{ transform: `translateY(${getParallax(0.05)}px)` }} />
        <div className="mesh-gradient-glow top-[-200px] left-[-200px] opacity-70" style={{ transform: `translateY(${getParallax(0.12)}px) scale(${1 + scrollY * 0.0002})` }} />
        <div className="glow-blob bg-primary w-[300px] h-[300px] top-1/4 right-[10%] opacity-10 dark:opacity-20" style={{ transform: `translateY(${getParallax(0.18)}px)` }} />
        <div className="glow-blob bg-accent w-[250px] h-[250px] bottom-10 left-[20%] opacity-10" style={{ transform: `translateY(${getParallax(-0.1)}px)` }} />

        <div className="relative container mx-auto px-6 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Content Column — Slides in from left */}
            <div className="lg:col-span-7 space-y-8 text-left" style={{ transform: `translateY(${getParallax(-0.03)}px)` }}>
              <ScrollReveal direction="left">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  Qishloq xo'jaligi vazirligi huzurida
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.1] mb-6">
                  <span className="text-foreground">Strategik Rivojlanish va</span><br/>
                  <span className="gradient-text-primary">Tadqiqotlar Xalqaro</span><br/>
                  <span className="gradient-text-gold">Markazi</span>
                </h1>
                
                <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-xl mb-10">
                  <span className="font-bold text-foreground">ISCAD</span> — O'zbekiston agrosanoat sektori va oziq-ovqat xavfsizligini ta'minlashda fundamental ilmiy innovatsiyalar, islohotlar va tahlillar olib boruvchi yetakchi davlat tashkilotidir.
                </p>

                {/* Styled CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <Link to="/journals">
                    <Button size="lg" className="w-full sm:w-auto font-extrabold rounded-full px-8 h-14 glow-button-primary bg-primary hover:bg-primary/95 text-primary-foreground text-sm uppercase tracking-wider">
                      Ilmiy Nashrlar
                    </Button>
                  </Link>
                  <Link to="/article-checker">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-border/80 bg-background/50 hover:bg-secondary/40 text-foreground rounded-full px-8 h-14 text-sm uppercase tracking-wider font-extrabold">
                      <Cpu className="mr-2 h-4.5 w-4.5 text-accent" />
                      AI Tahlil Tizimi
                    </Button>
                  </Link>
                </div>

                {/* Trust metrics */}
                <div className="grid grid-cols-3 gap-3 sm:gap-8 pt-10 border-t border-border/60 mt-12 max-w-lg">
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">500+</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Maqolalar</div>
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">24+</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Ekspertlar</div>
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">7+</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Tajriba (yil)</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column — 3D Interactive Magazine Cover */}
            <div 
              className="lg:col-span-5 relative mt-12 lg:mt-0 flex justify-center"
              ref={heroRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transform: `translateY(${getParallax(-0.06)}px)` }}
            >
              <ScrollReveal direction="right" delay={0.2} className="relative w-full max-w-[340px] md:max-w-[370px]">
                
                {/* 3D Book Container with mouse-tracking tilt */}
                <div 
                  className="journal-cover-realistic cover-shine group/hero bg-slate-950 border border-slate-900 shadow-2xl relative"
                  style={{
                    transform: isMobile ? 'none' : `perspective(1000px) rotateY(${mousePos.x * -8}deg) rotateX(${mousePos.y * 5}deg)`,
                    transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                >
                  
                  {/* Photo Overlay with blur */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src={heroBg} 
                      alt="Journal Background" 
                      className="w-full h-full object-cover opacity-60 scale-105 blur-[3px] group-hover/hero:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/50 to-slate-950/30" />
                  </div>
                  {/* Spine reflection and folding lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0)_2%,rgba(255,255,255,0.05)_3%,rgba(255,255,255,0)_6%,rgba(0,0,0,0.03)_7%,rgba(0,0,0,0)_90%)] pointer-events-none z-10" />
                  <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-black/20 shadow-[1px_0_2px_rgba(0,0,0,0.1)] z-20" />
                  
                  {/* Text on realistic cover */}
                  <div className="relative h-full flex flex-col justify-between z-20 text-slate-100 p-8">
                    <div className="flex justify-between items-start">
                      <div className="px-2.5 py-0.5 border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm rounded text-[8px] uppercase tracking-widest text-slate-300 font-bold">
                        ISCAD JOURNAL
                      </div>
                      <img src={iscadLogo} alt="Logo" className="h-6 w-auto opacity-80 filter brightness-0 invert" />
                    </div>

                    <div className="space-y-4">
                      <p className="text-[9px] text-accent tracking-widest uppercase font-bold">ILMIY NASHR</p>
                      <h3 className="text-2xl md:text-3xl font-serif font-black leading-tight text-white drop-shadow-md">
                        AGROIQTISODIYOT VA BARQAROR RIVOJLANISH
                      </h3>
                      
                      <div className="flex items-center gap-3 pt-6 border-t border-slate-800/80">
                        <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                          <span className="text-xs font-bold text-accent">№1</span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium">
                          <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5 font-bold">Nashr sanasi</div>
                          May, 2026
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glowing Floating Badges */}
                <div className="absolute -top-4 -left-2 sm:-left-6 bg-slate-950 border border-accent/40 px-3.5 py-2.5 rounded-2xl shadow-glow-gold animate-float" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6.5 h-6.5 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-200">AI TAHLIL FAOL</span>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-slate-950 border border-primary/45 p-4 rounded-2xl shadow-glow w-44 sm:w-52 animate-float" style={{ animationDelay: '1500ms' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8.5 h-8.5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Activity className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Yuklab olishlar</p>
                      <p className="text-xs font-black text-white">+1,240 ta</p>
                    </div>
                  </div>
                  {/* SVG mini chart */}
                  <div className="h-5 w-full flex items-end gap-1 opacity-70">
                    <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path d="M0,18 Q15,4 30,12 T60,6 T80,14 T100,2" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ MISSION & VISION SECTION (Parallax slide-up) ============ */}
      <section 
        className="py-24 section-alt border-y border-border/60"
        style={{ transform: `translateY(${getParallax(-0.02, 400)}px)` }}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-serif font-black leading-tight">
                  Barqaror Qishloq Xo'jaligi va <br />
                  <span className="gradient-text-primary">Oziq-ovqat Xavfsizligi</span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed mt-4">
                  ISCAD markazi O'zbekiston agrar sektoridagi davlat islohotlarini ilmiy jihatdan qo'llab-quvvatlash uchun innovatsion prognozlar, tahliliy modellar va yangi mexanizmlarni taqdim etadi. 
                </p>

                <div className="space-y-3.5 pt-6">
                  {[
                    "Ilmiy asoslangan oziq-ovqat xavfsizligi strategiyalari",
                    "Doimiy monitoring va agrar bozorlar tahlili",
                    "Xalqaro ilg'or tajribalarni mahalliylashtirish"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-bold text-foreground/80">{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6">
              <ScrollReveal delay={0.2}>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { label: "Ilmiy nashrlar", value: 500, suffix: "+" },
                    { label: "Tahrir a'zolari", value: 24, suffix: "" },
                    { label: "Yillik tajriba", value: 7, suffix: "+" },
                    { label: "Xalqaro hamkorlar", value: 15, suffix: "+" },
                  ].map((stat, idx) => (
                    <div key={idx} className="glass-card bg-background border border-border/80 p-6 rounded-2xl text-left">
                      <div className="text-2xl lg:text-3xl font-black text-foreground mb-1 tracking-tight">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={1500} />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ CORE FEATURES SECTION (Parallax) ============ */}
      <section 
        className="py-24 bg-background"
        style={{ transform: `translateY(${getParallax(-0.015, 900)}px)` }}
      >
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-black mb-4">
                Asosiy Yo'nalishlar
              </h2>
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                Agrosanoat kompleksi tarkibidagi iqtisodiy munosabatlarni ilmiy va raqamli innovatsiyalar orqali yangi bosqichga ko'tarish.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <Card className="glass-card bg-card border border-border/80 h-full p-2 relative overflow-hidden group hover-lift">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold mb-3 text-foreground tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs md:text-sm font-medium leading-relaxed mt-auto">{feature.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI CHECKER SECTION with analyzing animation ============ */}
      <section 
        className="py-24 section-alt border-y border-border/60 relative"
        style={{ transform: `translateY(${getParallax(-0.015, 1400)}px)` }}
      >
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center max-w-6xl mx-auto z-10 relative">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/15 border border-accent/25 rounded-full text-accent text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Tahlil Tizimi
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-black leading-tight">
                  Maqolangizni AI yordamida tahlil qiling
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
                  Innovatsion modelimiz maqolangizni O'zbekistondagi ilmiy uslub, tahririyat qoidalari va imlo mosligini soniyalar ichida tekshirib beradi.
                </p>
                
                <div className="pt-6">
                  <Link to="/article-checker">
                    <Button className="rounded-full px-8 h-12 font-bold glow-button-primary bg-primary text-primary-foreground uppercase tracking-wider text-xs">
                      Tekshirishni boshlash
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <ScrollReveal direction="right" delay={0.2} className="w-full max-w-md">
                <div className="glass-card bg-background border border-border/80 rounded-2xl shadow-lg p-6 relative overflow-hidden">
                  {/* AI Data Stream Background */}
                  <div className="absolute inset-0 ai-data-stream opacity-30 pointer-events-none" />
                  
                  <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center bg-secondary/30 relative overflow-hidden">
                    {/* Laser Scanner Beam */}
                    <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent blur-[1px] animate-scan-laser" />
                    
                    {/* Orbiting particles */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="animate-orbit">
                        <div className="w-2 h-2 rounded-full bg-primary/40 blur-[1px]" />
                      </div>
                    </div>
                    
                    <FolderOpen className="h-10 w-10 text-primary mx-auto mb-3 animate-pulse" />
                    <p className="text-sm font-bold text-foreground">Faylni yuklang</p>
                    <p className="text-xs text-muted-foreground mt-1">.docx, .pdf yoki .txt formatlari</p>
                    
                    {/* Typing dots */}
                    <div className="flex items-center justify-center gap-1.5 mt-4">
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary/60" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary/60" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary/60" />
                    </div>
                  </div>
                  <div className="mt-6 space-y-2.5 pt-6 border-t border-border/50 relative z-10">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">Tahlil natijasi (namuna):</span>
                      <span className="text-primary font-black animate-score-pulse">92% (A'lo)</span>
                    </div>
                    <div className="w-full h-2 bg-border/80 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-progress-sim" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section 
        className="py-24 section-alt border-t border-border/60 text-center relative overflow-hidden"
        style={{ transform: `translateY(${getParallax(-0.01, 1900)}px)` }}
      >
        <div className="mesh-gradient-glow bottom-[-200px] left-1/3 opacity-30" />
        <div className="container mx-auto px-6 z-10 relative">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-serif font-black mb-4">Bog'lanish</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-xs md:text-sm font-medium leading-relaxed">
              Ilmiy hamkorlik, savollar yoki tahririyat takliflari uchun aloqaga chiqing.
            </p>
            <Link to="/contact">
              <Button className="rounded-full px-10 h-14 font-extrabold glow-button-primary bg-primary text-primary-foreground uppercase tracking-wider text-xs">
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