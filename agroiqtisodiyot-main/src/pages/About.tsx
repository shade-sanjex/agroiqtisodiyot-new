import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import {
  Building2,
  Target,
  Lightbulb,
  Microscope,
  LineChart,
  Globe2,
  Leaf
} from 'lucide-react';
import heroAgriculture from '@/assets/hero-agriculture.jpg';
import economicImg from '@/assets/economic-analysis.png';
import innovationsImg from '@/assets/agri-innovations.png';
import researchImg from '@/assets/scientific-research.png';
import intlImg from '@/assets/intl-integration.png';

const About = () => {
  const tasks = [
    {
      icon: LineChart,
      title: 'Iqtisodiy Tahlil',
      desc: "Agrar sohadagi iqtisodiy jarayonlarni modellashtirish va prognozlashtirish.",
      image: economicImg
    },
    {
      icon: Lightbulb,
      title: 'Innovatsiyalar',
      desc: "Sohaga raqamli texnologiyalar va sun'iy intellekt yechimlarini joriy etish.",
      image: innovationsImg
    },
    {
      icon: Microscope,
      title: 'Ilmiy Tadqiot',
      desc: "Oziq-ovqat xavfsizligi bo'yicha fundamental ilmiy izlanishlar olib borish.",
      image: researchImg
    },
    {
      icon: Globe2,
      title: 'Xalqaro Integratsiya',
      desc: "Xorijiy tajribani o'rganish va O'zbekiston sharoitiga moslashtirish.",
      image: intlImg
    }
  ];

  const stats = [
    { label: "Ilmiy xodimlar", value: "40+" },
    { label: "Xalqaro loyihalar", value: "15+" },
    { label: "Chop etilgan maqolalar", value: "500+" },
    { label: "Hamkor tashkilotlar", value: "25+" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* ============ PREMIUM HERO ============ */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 border-b border-border/80 overflow-hidden bg-background flex items-center justify-center min-h-[380px]">
        {/* Background Image with Ken Burns effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={heroAgriculture} 
            alt="Agroiqtisodiyot background" 
            className="w-full h-full object-cover opacity-[0.55] dark:opacity-[0.85] dark:brightness-[0.5] animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background dark:from-background/10 dark:via-background/50 dark:to-background" />
        </div>

        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-5" />
        <div className="mesh-gradient-glow top-[-300px] left-[-300px] opacity-60 z-5" />
        
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 text-primary mb-6 shadow-md backdrop-blur-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight drop-shadow-sm">
              Tashkilot Haqida
            </h1>
            <p className="text-sm md:text-base text-foreground/80 dark:text-muted-foreground font-semibold leading-relaxed max-w-3xl mx-auto">
              O'zbekiston Respublikasi Qishloq xo'jaligi vazirligi huzuridagi Oziq-ovqat va qishloq xo'jaligi sohasida strategik rivojlanish va tadqiqotlar xalqaro markazi (ISCAD)
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ MISSION & VISION ============ */}
      <section className="py-20 section-alt">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <ScrollReveal direction="left">
              <Card className="glass-card h-full border border-border/80 bg-background/90 p-2">
                <CardContent className="p-8 lg:p-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-serif font-black mb-4">Bizning Missiyamiz</h2>
                  <p className="text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">
                    Mamlakatimiz agrar tarmog'ini barqaror rivojlantirish, oziq-ovqat xavfsizligini ta'minlash va sohada innovatsion iqtisodiy mexanizmlarni yaratish orqali xalqimiz farovonligiga xizmat qilish.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <Card className="glass-card h-full border border-border/80 bg-background/90 p-2">
                <CardContent className="p-8 lg:p-10">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center mb-6 text-accent">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-serif font-black mb-4">Bizning Maqsadimiz</h2>
                  <p className="text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">
                    Agroiqtisodiyot sohasida Markaziy Osiyodagi eng ilg'or va nufuzli tahliliy-tadqiqot markaziga aylanish hamda jahon ilmiy hamjamiyatida o'z o'rnimizni topish.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============ CORE TASKS ============ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-black mb-4">Asosiy Vazifalarimiz</h2>
              <p className="text-muted-foreground text-sm font-medium">
                Markaz o'z oldiga qo'ygan strategik maqsadlarga erishish uchun quyidagi ustuvor vazifalarni amalga oshiradi
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {tasks.map((task, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <Card className="glass-card border border-border/80 shadow-md h-full bg-card overflow-hidden group flex flex-col hover-lift">
                  {/* Card Header Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={task.image} 
                      alt={task.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    
                    {/* Floating Icon on top of the image */}
                    <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-primary/90 border border-primary/20 backdrop-blur-md flex items-center justify-center text-primary-foreground shadow-lg transition-transform duration-500 group-hover:scale-110">
                      <task.icon className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <CardContent className="p-6 md:p-8 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <h3 className="text-lg font-serif font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
                        {task.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="py-20 section-alt border-t border-border/80">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-foreground mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default About;