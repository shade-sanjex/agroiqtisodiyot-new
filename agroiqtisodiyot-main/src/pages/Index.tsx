import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/layout/PageShell';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/ui-system/SectionHeading';
import { FeatureCard } from '@/components/ui-system/FeatureCard';
import { StatStrip } from '@/components/ui-system/StatStrip';
import { GlassCard } from '@/components/ui-system/GlassCard';
import {
  BookOpen,
  Target,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Activity,
  Check,
  Cpu,
  FolderOpen,
} from 'lucide-react';
import iscadLogo from '@/assets/iscad-logo.png';
import heroBg from '@/assets/hero-agriculture.webp';

const Index = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 3D mouse tracking for hero cover (signature hero moment — softened tilt)
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

  // Statistik qiymatlarning yagona manbasi (R4 — izchillik, qo'lda takrorlanmaydi)
  const stats = [
    { value: 500, suffix: '+', label: 'Ilmiy nashrlar' },
    { value: 24, suffix: '+', label: "Tahrir a'zolari" },
    { value: 7, suffix: '+', label: 'Yillik tajriba' },
    { value: 15, suffix: '+', label: 'Xalqaro hamkorlar' },
  ];

  return (
    <PageShell>
      {/* ============ EDITORIAL HERO — yagona "hero moment": jurnal muqovasi ============ */}
      <section className="relative flex items-center overflow-hidden bg-background min-h-[85vh] lg:min-h-[90vh] py-16 lg:py-20">
        {/* Background image (ken-burns saqlanadi) + bitta nozik gradient overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-[0.5] dark:opacity-[0.8] dark:brightness-[0.5] animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/75 to-background dark:from-background/20 dark:via-background/55 dark:to-background" />
        </div>

        <div className="relative container mx-auto px-6 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left — editorial content */}
            <div className="lg:col-span-7 text-left">
              <ScrollReveal direction="left">
                <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-[0.15em] mb-6">
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  Qishloq xo'jaligi vazirligi huzurida
                </span>

                <h1 className="font-serif font-black tracking-tight leading-[1.05] text-5xl md:text-6xl lg:text-7xl mb-6">
                  <span className="text-foreground">Strategik Rivojlanish va</span>
                  <br />
                  <span className="gradient-text-primary">Tadqiqotlar Xalqaro</span>
                  <br />
                  <span className="gradient-text-gold">Markazi</span>
                </h1>

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mb-10">
                  <span className="font-bold text-foreground">ISCAD</span> — O'zbekiston agrosanoat sektori va oziq-ovqat
                  xavfsizligini ta'minlashda fundamental ilmiy innovatsiyalar, islohotlar va tahlillar olib boruvchi
                  yetakchi davlat tashkilotidir.
                </p>

                {/* CTA tugmalar (yangi token-variantlar) */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <Button
                    asChild
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto rounded-full px-8 h-14 text-xs font-extrabold uppercase tracking-[0.15em]"
                  >
                    <Link to="/journals">Ilmiy Nashrlar</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-full px-8 h-14 text-xs font-extrabold uppercase tracking-[0.15em]"
                  >
                    <Link to="/article-checker">
                      <Cpu className="text-accent" />
                      AI Tahlil Tizimi
                    </Link>
                  </Button>
                </div>

                {/* Jonlantirilgan statistika (StatStrip + AnimatedCounter, R9.5) */}
                <div className="mt-12 pt-2">
                  <StatStrip items={stats.slice(0, 3)} className="grid-cols-3 md:grid-cols-3 max-w-xl" />
                </div>
              </ScrollReveal>
            </div>

            {/* Right — 3D interaktiv jurnal muqovasi (mouse-tilt saqlanadi, nozikroq) */}
            <div
              className="lg:col-span-5 relative mt-4 lg:mt-0 flex justify-center"
              ref={heroRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <ScrollReveal direction="right" delay={0.2} className="relative w-full max-w-[340px] md:max-w-[370px]">

                <div
                  className="journal-cover-realistic cover-shine group/hero bg-slate-950 border border-slate-900 shadow-2xl relative"
                  style={{
                    transform: isMobile
                      ? 'none'
                      : `perspective(1000px) rotateY(${mousePos.x * -6}deg) rotateX(${mousePos.y * 4}deg)`,
                    transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                >
                  {/* Photo overlay with blur */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={heroBg}
                      alt=""
                      aria-hidden="true"
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
                      <div className="px-2.5 py-1 border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm rounded text-xs uppercase tracking-widest text-slate-300 font-bold">
                        ISCAD JOURNAL
                      </div>
                      <img src={iscadLogo} alt="" aria-hidden="true" className="h-6 w-auto opacity-80 filter brightness-0 invert" />
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs text-accent tracking-widest uppercase font-bold">ILMIY NASHR</p>
                      <h3 className="text-2xl md:text-3xl font-serif font-black leading-tight text-white drop-shadow-md">
                        AGROIQTISODIYOT VA BARQAROR RIVOJLANISH
                      </h3>

                      <div className="flex items-center gap-3 pt-6 border-t border-slate-800/80">
                        <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                          <span className="text-xs font-bold text-accent">№1</span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium">
                          <div className="text-xs text-slate-500 uppercase tracking-widest mb-0.5 font-bold">Nashr sanasi</div>
                          May, 2026
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating accent badges */}
                <div className="absolute -top-4 -left-2 sm:-left-6 bg-slate-950 border border-accent/40 px-3.5 py-2.5 rounded-2xl shadow-glow-gold animate-float" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200">AI TAHLIL FAOL</span>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-slate-950 border border-primary/45 p-4 rounded-2xl shadow-glow w-44 sm:w-52 animate-float" style={{ animationDelay: '1500ms' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Yuklab olishlar</p>
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

      {/* ============ MISSION & VISION ============ */}
      <section className="py-24 section-alt border-y border-border/60">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">

            <div className="lg:col-span-6">
              <ScrollReveal>
                <SectionHeading
                  eyebrow="Bizning maqsad"
                  title="Barqaror Qishloq Xo'jaligi va Oziq-ovqat Xavfsizligi"
                  description="ISCAD markazi O'zbekiston agrar sektoridagi davlat islohotlarini ilmiy jihatdan qo'llab-quvvatlash uchun innovatsion prognozlar, tahliliy modellar va yangi mexanizmlarni taqdim etadi."
                />

                <div className="space-y-3.5 pt-8">
                  {[
                    'Ilmiy asoslangan oziq-ovqat xavfsizligi strategiyalari',
                    'Doimiy monitoring va agrar bozorlar tahlili',
                    'Xalqaro ilg\'or tajribalarni mahalliylashtirish',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-semibold text-foreground/80">{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6">
              <ScrollReveal delay={0.2}>
                <StatStrip items={stats} className="md:grid-cols-2" />
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ CORE FEATURES ============ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Faoliyat sohalari"
              title="Asosiy Yo'nalishlar"
              description="Agrosanoat kompleksi tarkibidagi iqtisodiy munosabatlarni ilmiy va raqamli innovatsiyalar orqali yangi bosqichga ko'tarish."
              className="mb-16 max-w-2xl"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.desc} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI CHECKER PROMO (skan animatsiyalari saqlanadi) ============ */}
      <section className="py-24 section-alt border-y border-border/60 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-6xl mx-auto relative z-10">

            <div className="lg:col-span-6">
              <ScrollReveal>
                <SectionHeading
                  eyebrow="AI Tahlil Tizimi"
                  title="Maqolangizni AI yordamida tahlil qiling"
                  description="Innovatsion modelimiz maqolangizni O'zbekistondagi ilmiy uslub, tahririyat qoidalari va imlo mosligini soniyalar ichida tekshirib beradi."
                />

                <div className="pt-8">
                  <Button
                    asChild
                    variant="primary"
                    className="rounded-full px-8 h-12 text-xs font-bold uppercase tracking-[0.15em]"
                  >
                    <Link to="/article-checker">
                      Tekshirishni boshlash
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <ScrollReveal direction="right" delay={0.2} className="w-full max-w-md">
                <GlassCard className="p-6 relative overflow-hidden">
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
                </GlassCard>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-24 section-alt border-t border-border/60 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
            <SectionHeading
              align="center"
              eyebrow="Hamkorlik"
              title="Bog'lanish"
              description="Ilmiy hamkorlik, savollar yoki tahririyat takliflari uchun aloqaga chiqing."
              className="mb-10"
            />
            <div className="flex justify-center">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="rounded-full px-10 h-14 text-xs font-extrabold uppercase tracking-[0.15em]"
              >
                <Link to="/contact">Aloqa sahifasi</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  );
};

export default Index;
