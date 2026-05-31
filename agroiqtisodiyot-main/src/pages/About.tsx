import { PageShell } from '@/components/layout/PageShell';
import { PageHero } from '@/components/ui-system/PageHero';
import { SectionHeading } from '@/components/ui-system/SectionHeading';
import { GlassCard } from '@/components/ui-system/GlassCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import {
  Building2,
  Target,
  Lightbulb,
  Microscope,
  LineChart,
  Globe2,
  Leaf
} from 'lucide-react';
import centerBuilding from '@/assets/center-building.webp';
import economicImg from '@/assets/economic-analysis.webp';
import innovationsImg from '@/assets/agri-innovations.webp';
import researchImg from '@/assets/scientific-research.webp';
import intlImg from '@/assets/intl-integration.webp';

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
    <PageShell>
      {/* ============ HERO ============ */}
      <PageHero
        eyebrow="ISCAD Markazi"
        title="Tashkilot Haqida"
        description="O'zbekiston Respublikasi Qishloq xo'jaligi vazirligi huzuridagi Oziq-ovqat va qishloq xo'jaligi sohasida strategik rivojlanish va tadqiqotlar xalqaro markazi (ISCAD)"
        backgroundImage={centerBuilding}
        icon={Building2}
      />

      {/* ============ MISSION & VISION ============ */}
      <section className="py-20 section-alt">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <ScrollReveal direction="left">
              <GlassCard variant="elevated" interactive className="h-full p-8 lg:p-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
                  <Target className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-serif font-black mb-4 text-foreground tracking-tight">
                  Bizning Missiyamiz
                </h2>
                <p className="text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">
                  Mamlakatimiz agrar tarmog'ini barqaror rivojlantirish, oziq-ovqat xavfsizligini ta'minlash va sohada innovatsion iqtisodiy mexanizmlarni yaratish orqali xalqimiz farovonligiga xizmat qilish.
                </p>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <GlassCard variant="elevated" interactive className="h-full p-8 lg:p-10">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center mb-6 text-accent">
                  <Leaf className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-serif font-black mb-4 text-foreground tracking-tight">
                  Bizning Maqsadimiz
                </h2>
                <p className="text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">
                  Agroiqtisodiyot sohasida Markaziy Osiyodagi eng ilg'or va nufuzli tahliliy-tadqiqot markaziga aylanish hamda jahon ilmiy hamjamiyatida o'z o'rnimizni topish.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============ CORE TASKS ============ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <ScrollReveal>
            <SectionHeading
              align="center"
              eyebrow="Faoliyat Yo'nalishlari"
              title="Asosiy Vazifalarimiz"
              description="Markaz o'z oldiga qo'ygan strategik maqsadlarga erishish uchun quyidagi ustuvor vazifalarni amalga oshiradi"
              className="mb-16"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {tasks.map((task, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <GlassCard
                  interactive
                  className="h-full overflow-hidden group flex flex-col p-0"
                >
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
                      <task.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <h3 className="text-lg font-serif font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
                        {task.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
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
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default About;
