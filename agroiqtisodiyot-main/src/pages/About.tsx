import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Target, 
  Eye, 
  Heart, 
  BookOpen, 
  Globe, 
  GraduationCap, 
  Lightbulb, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  Award,
  Compass,
  CheckCircle2
} from 'lucide-react';
import centerBuilding from '@/assets/center-building.jpg';

const About = () => {
  const tasks = [
    { icon: BookOpen, title: 'Ilmiy Tadqiqotlar', desc: 'Qishloq xo\'jaligi va oziq-ovqat xavfsizligi bo\'yicha fundamental va amaliy tadqiqotlarni o\'tkazish.' },
    { icon: Target, title: 'Strategik Rejalashtirish', desc: 'Qishloq xo\'jaligi sektorining barqaror rivojlanishi uchun uzoq muddatli dasturlar.' },
    { icon: Lightbulb, title: 'Innovatsiyalar', desc: 'Zamonaviy agrotexnologiyalar va raqamli yechimlarni amaliyotga joriy etish.' },
    { icon: Globe, title: 'Xalqaro Hamkorlik', desc: 'Jahon ilmiy markazlari va xalqaro tashkilotlar bilan tizimli tajriba almashish.' },
    { icon: GraduationCap, title: 'O\'quv dasturlari', desc: 'Agrar soha mutaxassislari va fermerlar uchun o\'quv treninglari va kurslar.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* ============ HERO BANNER ============ */}
      <section className="relative h-[280px] md:h-[380px] flex items-center justify-center overflow-hidden bg-hero-light dark:bg-hero-dark border-b border-border/40">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

        {/* Soft blobs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/6 blur-3xl animate-float-slow -z-10" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-secondary/6 blur-3xl animate-float-delayed -z-10" />

        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.07] dark:opacity-[0.12] mix-blend-luminosity dark:mix-blend-overlay scale-105 transition-opacity duration-300" 
          style={{ backgroundImage: `url(${centerBuilding})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
        <div className="relative text-center z-10 space-y-3 px-4">
          <ScrollReveal>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/15">
              <Compass className="h-3.5 w-3.5" />
              BIZ HAQIMIZDA
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-black mt-3 text-foreground drop-shadow-sm">
              Markaz Faoliyati
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm max-w-xl mx-auto font-light leading-relaxed mt-2">
              O'zbekiston qishloq xo'jaligi va oziq-ovqat xavfsizligi rivojlanishining bosh strategik ilmiy markazi
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ MAIN DESCRIPTION ============ */}
      <section className="py-16 md:py-24 section-alt">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <ScrollReveal>
            <div className="relative pl-6 border-l-4 border-secondary mb-20 space-y-4">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Oziq-ovqat va Qishloq Xo'jaligi Sohasida Strategik Rivojlanish va Tadqiqotlar Xalqaro Markazi (ISCAD)
                O'zbekiston Respublikasi Qishloq xo'jaligi vazirligi huzuridagi yirik davlat ilmiy tashkiloti hisoblanadi.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Markaz qishloq xo'jaligi sektoridagi islohotlarni qo'llab-quvvatlash, oziq-ovqat xavfsizligini ta'minlash, global agrosanoat integratsiyasiga hissa qo'shish va barqaror rivojlanishga erishish maqsadida tashkil etilgan bo'lib, xalqaro miqyosda keng qamrovli ilmiy-tadqiqot ishlarini olib boradi.
              </p>
            </div>
          </ScrollReveal>

          {/* ============ MISSION, VISION, VALUES ============ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {[
              { 
                icon: Target, 
                title: 'Missiyamiz', 
                desc: 'Oziq-ovqat xavfsizligi darajasini ko\'tarish va qishloq xo\'jaligida barqaror iqtisodiy rivojlanish yechimlarini taqdim etish.', 
              },
              { 
                icon: Eye, 
                title: 'Vizyonimiz', 
                desc: 'Markaziy Osiyoda agrosanoat va strategik ilmiy tahlil bo\'yicha yetakchi ekspertiza va bilimlar markaziga aylanish.', 
              },
              { 
                icon: Heart, 
                title: 'Qadriyatlarimiz', 
                desc: 'Tadqiqotlar xolisligi, doimiy innovatsiyalar, professional hamkorlik va ilmiy yondashuv asosiga qurilgan halollik.', 
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <Card className="card-lift h-full border border-border/60 bg-card/80 backdrop-blur-md shadow-sm hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-border/50 shadow-sm flex items-center justify-center mx-auto">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-serif font-bold text-lg">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* ============ TASKS ============ */}
          <div className="space-y-12 mb-24">
            <ScrollReveal className="text-center">
              <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full tracking-wide mb-3">
                VAZIFALARIMIZ
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-black">Markazning Asosiy Vazifalari</h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task, i) => (
                <ScrollReveal key={task.title} delay={i * 0.06}>
                  <Card className="card-lift h-full border border-border/60 bg-card/80 backdrop-blur-md shadow-sm hover:border-primary/20 transition-all duration-300">
                    <CardContent className="p-6 space-y-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center">
                        <task.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-serif font-bold text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{task.desc}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* ============ STATS COUNTER ============ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {[
              { label: 'Ilmiy maqolalar', value: 500, suffix: '+' },
              { label: "Tahrir a'zolari", value: 24, suffix: '' },
              { label: 'Yillik tajriba', value: 7, suffix: '+' },
              { label: 'Xalqaro hamkorlar', value: 15, suffix: '+' },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.08}>
                <Card className="border border-border/60 bg-card/80 backdrop-blur-md text-center p-6 shadow-sm card-lift">
                  <div className="text-3xl font-black gradient-text-primary mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={1500} />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* ============ CONTACT BLOCK ============ */}
          <ScrollReveal>
            <Card className="border border-border/60 bg-card/80 shadow-md rounded-2xl overflow-hidden backdrop-blur-md">
              <CardContent className="p-8 md:p-10 space-y-8">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <h2 className="text-xl md:text-2xl font-serif font-black">Bog'lanish va Hamkorlik</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Manzilimiz</p>
                      <p className="text-xs md:text-sm font-medium leading-relaxed">
                        100140, Toshkent viloyati, Qibray tumani, Universitet ko'chasi, 2-uy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Ishonch telefoni</p>
                      <a href="tel:+998935200565" className="text-xs md:text-sm font-bold text-foreground hover:text-primary transition-colors">
                        +998 93 520 05 65
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Elektron pochta</p>
                      <a href="mailto:ooqxssrtxm@agro.uz" className="text-xs md:text-sm font-bold text-foreground hover:text-primary transition-colors">
                        ooqxssrtxm@agro.uz
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 text-primary">
                      <ExternalLink className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Veb-sayt</p>
                      <a href="https://www.agroiqtisodiyot.uz" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1">
                        www.agroiqtisodiyot.uz
                        <CheckCircle2 className="h-3 w-3 text-secondary" />
                      </a>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default About;