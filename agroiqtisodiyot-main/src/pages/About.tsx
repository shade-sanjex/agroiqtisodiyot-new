import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Heart, BookOpen, Globe, GraduationCap, Lightbulb, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import centerBuilding from '@/assets/center-building.jpg';

const About = () => {
  const tasks = [
    { icon: BookOpen, title: 'Ilmiy Tadqiqotlar', desc: 'Qishloq xo\'jaligi va oziq-ovqat xavfsizligi bo\'yicha fundamental va amaliy tadqiqotlar.' },
    { icon: Target, title: 'Strategik Rejalashtirish', desc: 'Qishloq xo\'jaligi sektorining barqaror rivojlanishi uchun uzoq muddatli strategiyalar.' },
    { icon: Lightbulb, title: 'Innovatsion Texnologiyalar', desc: 'Zamonaviy agrotexnologiyalar va raqamli yechimlarni amaliyotga joriy etish.' },
    { icon: Globe, title: 'Xalqaro Hamkorlik', desc: 'Jahon ilmiy markazlari va xalqaro tashkilotlar bilan tajriba almashish.' },
    { icon: GraduationCap, title: "Ta'lim va Malaka Oshirish", desc: 'Mutaxassislar va fermerlar uchun o\'quv dasturlari va treninglar.' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Parallax Hero */}
      <section className="relative h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${centerBuilding})` }} />
        <div className="absolute inset-0 gradient-hero opacity-85" />
        <div className="relative text-center text-white z-10">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 animate-fade-in-up">Markaz Haqida</h1>
          <p className="text-white/70 text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            O'zbekiston qishloq xo'jaligi rivojlanishining yetakchi markazi
          </p>
        </div>
      </section>

      {/* About content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <ScrollReveal>
            <div className="relative pl-6 border-l-4 border-gold mb-16">
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Oziq-ovqat va Qishloq Xo'jaligi Sohasida Strategik Rivojlanish va Tadqiqotlar Xalqaro Markazi (ISCAD)
                O'zbekiston Respublikasi Qishloq xo'jaligi vazirligi huzuridagi davlat tashkiloti hisoblanadi.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Markaz qishloq xo'jaligi sektoridagi islohotlarni qo'llab-quvvatlash, oziq-ovqat xavfsizligini
                ta'minlash va barqaror rivojlanishga erishish maqsadida tashkil etilgan. ISCAD mintaqaviy va xalqaro
                miqyosda ilmiy-tadqiqot faoliyatini olib boradi.
              </p>
            </div>
          </ScrollReveal>

          {/* Vision, Mission, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { icon: Target, title: 'Missiya', desc: 'Oziq-ovqat xavfsizligini ta\'minlash va qishloq xo\'jaligi barqaror rivojlanishiga hissa qo\'shish.', color: 'from-blue-500/20 to-blue-600/5' },
              { icon: Eye, title: 'Vizyon', desc: 'Mintaqada yetakchi ilmiy-tadqiqot va strategik rivojlanish markazi darajasiga erishish.', color: 'from-emerald-500/20 to-emerald-600/5' },
              { icon: Heart, title: 'Qadriyatlar', desc: 'Halollik, innovatsiya, hamkorlik va ilmiy yondashuvga sodiqlik.', color: 'from-amber-500/20 to-amber-600/5' },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <Card className={`card-lift h-full border-0 bg-gradient-to-br ${item.color}`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 shadow-lg mx-auto mb-4 flex items-center justify-center">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-serif font-bold text-xl mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* Tasks */}
          <ScrollReveal><h2 className="text-3xl font-serif font-bold mb-8">Asosiy Vazifalar</h2></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {tasks.map((task, i) => (
              <ScrollReveal key={task.title} delay={i * 0.08}>
                <Card className="card-lift h-full border-0 shadow-glass">
                  <CardContent className="p-6">
                    <task.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-serif font-bold text-lg mb-2">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {[
              { label: 'Ilmiy maqolalar', value: 500, suffix: '+' },
              { label: "Tahrir a'zolari", value: 24, suffix: '' },
              { label: 'Yillik tajriba', value: 7, suffix: '+' },
              { label: 'Xalqaro hamkorlar', value: 15, suffix: '+' },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <Card className="border-0 shadow-glass text-center p-6">
                  <div className="text-3xl font-bold gradient-text-primary mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* Contact */}
          <ScrollReveal>
            <Card className="glass shadow-glass-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif font-bold mb-6">Aloqa Ma'lumotlari</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div><p className="font-medium text-sm">Manzil</p><p className="text-sm text-muted-foreground">100140, Toshkent viloyati, Qibray tumani, Universitet ko'chasi, 2 uy.</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div><p className="font-medium text-sm">Telefon</p><a href="tel:+998935200565" className="text-sm text-muted-foreground hover:text-primary">+998 93 520 05 65</a></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div><p className="font-medium text-sm">Email</p><a href="mailto:ooqxssrtxm@agro.uz" className="text-sm text-muted-foreground hover:text-primary">ooqxssrtxm@agro.uz</a></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ExternalLink className="h-5 w-5 text-primary mt-0.5" />
                    <div><p className="font-medium text-sm">Veb-sayt</p><a href="https://www.agroiqtisodiyot.uz" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">www.agroiqtisodiyot.uz</a></div>
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