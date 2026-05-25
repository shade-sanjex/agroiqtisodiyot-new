import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { ParticleBackground } from '@/components/ParticleBackground';
import { BackToTop } from '@/components/BackToTop';
import { BookOpen, Target, Users, TrendingUp, ArrowRight, Sparkles, FileText, Download, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
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
      desc: 'Qishloq xo\'jaligi sektorini rivojlantirish bo\'yicha strategiyalar ishlab chiqish va amalga oshirish',
      color: 'from-blue-500/20 to-blue-600/5',
      iconColor: 'text-blue-500',
    },
    {
      icon: BookOpen,
      title: 'Ilmiy Tadqiqotlar',
      desc: 'Oziq-ovqat xavfsizligi va qishloq xo\'jaligi bo\'yicha fundamental va amaliy tadqiqotlar',
      color: 'from-emerald-500/20 to-emerald-600/5',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Users,
      title: 'Kadrlar Tayyorlash',
      desc: 'Qishloq xo\'jaligi mutaxassislari va tadqiqotchilarni tayyorlash hamda malakalarini oshirish',
      color: 'from-amber-500/20 to-amber-600/5',
      iconColor: 'text-amber-500',
    },
    {
      icon: TrendingUp,
      title: 'Xalqaro Hamkorlik',
      desc: 'Xalqaro tashkilotlar va tadqiqot markazlari bilan hamkorlikni rivojlantirish',
      color: 'from-purple-500/20 to-purple-600/5',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <ParticleBackground className="absolute inset-0 z-[1]" particleCount={60} />

        {/* Decorative geometric shapes */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 border border-white/10 rounded-2xl rotate-45 animate-spin-slow" />

        {/* Hero content */}
        <div className="relative container mx-auto px-4 text-center text-white z-10">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-6 md:mb-8 animate-fade-in-down">
              <div className="relative">
                <img
                  src={iscadLogo}
                  alt="ISCAD Logo"
                  className="h-28 md:h-36 lg:h-44 w-auto drop-shadow-2xl"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl -z-10" />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-base md:text-xl lg:text-2xl mb-3 font-light tracking-wide opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Oziq-ovqat va Qishloq Xo'jaligi Sohasida
            </p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Strategik Rivojlanish va Tadqiqotlar
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-transparent">
                Xalqaro Markazi
              </span>
            </h1>

            <p className="text-sm md:text-base lg:text-lg mb-8 md:mb-10 max-w-2xl mx-auto text-white/70 font-light opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              O'zbekiston Respublikasi Qishloq xo'jaligi vazirligi huzuridagi davlat tashkiloti
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <Link to="/journals">
                <Button size="lg" className="text-base md:text-lg bg-white text-navy-800 hover:bg-white/90 shadow-xl shadow-black/20 px-8 rounded-full font-semibold">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Jurnallarni ko'rish
                </Button>
              </Link>
              <Link to="/article-checker">
                <Button size="lg" variant="outline" className="text-base md:text-lg border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white backdrop-blur-sm px-8 rounded-full">
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI Maqola Tekshirish
                </Button>
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce-gentle" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section className="py-0 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16">
            {[
              { label: 'Ilmiy maqolalar', value: 500, suffix: '+' },
              { label: 'Tahrir a\'zolari', value: 24, suffix: '' },
              { label: 'Yillik tajriba', value: 7, suffix: '+' },
              { label: 'Xalqaro hamkorlar', value: 15, suffix: '+' },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="glass-strong rounded-2xl p-6 text-center card-lift shadow-glass">
                  <div className="text-3xl md:text-4xl font-bold gradient-text-primary mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2000} />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MISSION SECTION ============ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4 tracking-wide">
                BIZNING MISSIYAMIZ
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 text-balance">
                Barqaror Qishloq Xo'jaligi va{' '}
                <span className="gradient-text-primary">Oziq-ovqat Xavfsizligi</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ISCAD O'zbekiston qishloq xo'jaligi sektoridagi islohotlarni qo'llab-quvvatlash,
                ilmiy tadqiqotlar, strategik rivojlanish va innovatsion yechimlar taqdim etish orqali
                oziq-ovqat xavfsizligini ta'minlash va barqaror rivojlanishga hissa qo'shadi.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <Card className={`card-lift overflow-hidden border-0 bg-gradient-to-br ${feature.color} dark:from-white/5 dark:to-white/[0.02] h-full`}>
                  <CardContent className="p-6 md:p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-white/10 shadow-lg flex items-center justify-center mb-5 ${feature.iconColor}`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LATEST JOURNALS ============ */}
      {journals.length > 0 && (
        <section className="py-20 md:py-28 bg-muted/50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                <div>
                  <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-semibold rounded-full mb-4 tracking-wide">
                    ILMIY NASHRLAR
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold">
                    So'nggi Jurnallar
                  </h2>
                </div>
                <Link to="/journals" className="mt-4 md:mt-0">
                  <Button variant="outline" className="rounded-full group">
                    Barcha jurnallar
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {journals.slice(0, 6).map((journal, i) => (
                <ScrollReveal key={journal.id} delay={i * 0.1}>
                  <Card className="card-lift overflow-hidden group border-0 shadow-glass h-full">
                    {journal.cover_image_url && (
                      <div className="aspect-[3/4] overflow-hidden bg-muted relative">
                        <img
                          src={journal.cover_image_url}
                          alt={journal.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <h3 className="font-serif font-bold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {journal.title}
                      </h3>
                      {journal.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {journal.description}
                        </p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full group/btn rounded-full"
                        onClick={() => window.open(journal.pdf_url, '_blank')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Yuklab olish
                        <ChevronRight className="ml-auto h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ AI CHECKER CTA ============ */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <ParticleBackground className="absolute inset-0" particleCount={30} />

        {/* Decorative */}
        <div className="absolute top-10 right-20 w-64 h-64 border border-white/5 rounded-full animate-spin-slow" />
        <div className="absolute bottom-10 left-20 w-48 h-48 border border-white/5 rounded-3xl rotate-12 animate-spin-slow" style={{ animationDirection: 'reverse' }} />

        <div className="relative container mx-auto px-4 text-center z-10">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-amber-300" />
                Sun'iy intellekt bilan maqola tekshirish
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 text-white">
                Maqolangizni{' '}
                <span className="bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">
                  AI bilan tekshiring
                </span>
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Imlo xatolarini toping, jurnal talablariga mosligini tekshiring va
                maqolangiz sifatini AI yordamida yaxshilang — barchasi bir necha soniyada
              </p>
              <Link to="/article-checker">
                <Button size="lg" className="bg-white text-navy-800 hover:bg-white/90 shadow-xl px-10 py-6 text-lg rounded-full font-semibold">
                  <FileText className="mr-2 h-5 w-5" />
                  Maqolani tekshirish
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ CONTACT CTA ============ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Biz bilan{' '}
                <span className="gradient-text-primary">bog'laning</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Savollaringiz bormi? Hamkorlik qilmoqchimisiz? Biz yordam berishga tayyormiz!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="rounded-full px-8">
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