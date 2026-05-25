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

const About = () => {
  const tasks = [
    {
      icon: LineChart,
      title: 'Iqtisodiy Tahlil',
      desc: "Agrar sohadagi iqtisodiy jarayonlarni modellashtirish va prognozlashtirish."
    },
    {
      icon: Lightbulb,
      title: 'Innovatsiyalar',
      desc: "Sohaga raqamli texnologiyalar va sun'iy intellekt yechimlarini joriy etish."
    },
    {
      icon: Microscope,
      title: 'Ilmiy Tadqiqot',
      desc: "Oziq-ovqat xavfsizligi bo'yicha fundamental ilmiy izlanishlar olib borish."
    },
    {
      icon: Globe2,
      title: 'Xalqaro Integratsiya',
      desc: "Xorijiy tajribani o'rganish va O'zbekiston sharoitiga moslashtirish."
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
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-border/80 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="mesh-gradient-glow top-[-300px] left-[-300px] opacity-70" />
        
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight">
              Tashkilot Haqida
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {tasks.map((task, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="group p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all duration-300 flex gap-5 items-start relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-11 h-11 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <task.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-2 text-foreground tracking-tight">{task.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
                      {task.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="py-20 section-alt border-t border-border/80">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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