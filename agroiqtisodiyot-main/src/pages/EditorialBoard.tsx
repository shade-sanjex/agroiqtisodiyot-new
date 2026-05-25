import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, Building, Award, User } from 'lucide-react';

const EditorialBoard = () => {
  const editors = [
    { name: "Abduvasikov Abduaziz Abdulazizovich", role: "Rektor", degree: "i.f.d., professor" },
    { name: "Ruzmetov B.R.", role: "A'zo", degree: "i.f.d., professor" },
    { name: "Sultonov B.F.", role: "A'zo", degree: "i.f.d., professor" },
    { name: "Yusupov M.S.", role: "A'zo", degree: "i.f.d., professor" },
    { name: "Ramazonov A.", role: "A'zo", degree: "q.x.f.d., professor" },
    { name: "Abduvaliev A.", role: "A'zo", degree: "q.x.f.d., professor" },
    { name: "Saitov S.", role: "A'zo", degree: "q.x.f.d., professor" },
    { name: "Sultonov M.", role: "A'zo", degree: "i.f.n., professor" },
    { name: "Norboev A.", role: "A'zo", degree: "q.x.f.d., katta ilmiy xodim" },
    { name: "Burxanov A.", role: "A'zo", degree: "q.x.f.n., dotsent" },
    { name: "Botirov A.", role: "A'zo", degree: "i.f.d., (PhD)" },
    { name: "Salohiddinov A.", role: "A'zo", degree: "i.f.d., (PhD)" },
    { name: "Ergashev A.", role: "A'zo", degree: "i.f.d., (PhD)" },
    { name: "Nurmatov S.", role: "A'zo", degree: "i.f.d., (PhD)" }
  ];

  const intEditors = [
    { name: "Yuri N. Gachev", role: "Xalqaro a'zo", degree: "Professor", country: "Rossiya" },
    { name: "Thomas C. B.", role: "Xalqaro a'zo", degree: "Professor", country: "AQSh" },
    { name: "John S. Smith", role: "Xalqaro a'zo", degree: "Professor", country: "Buyuk Britaniya" },
    { name: "Li Wei", role: "Xalqaro a'zo", degree: "Professor", country: "Xitoy" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* ============ MINIMAL HERO ============ */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-border overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
              <Users className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight">
              Tahrir Hay'ati
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
              Jurnalning ilmiy yo'nalishi va sifatini ta'minlovchi mahalliy hamda xalqaro ekspertlar jamoasi
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ CHIEF EDITOR ============ */}
      <section className="py-20 section-alt">
        <div className="container mx-auto px-4 max-w-5xl">
          <ScrollReveal>
            {/* Elegant, clean card for the chief editor without the tacky gold glow */}
            <Card className="iscad-card overflow-hidden bg-background">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                <div className="md:col-span-5 relative">
                  <div className="aspect-[4/5] md:aspect-auto md:h-full relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <User className="w-32 h-32 text-slate-300 dark:text-slate-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
                  </div>
                </div>
                
                <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                    <Award className="h-3.5 w-3.5" /> Bosh Muharrir
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 leading-tight">
                    Shuxrat Teshayev
                  </h2>
                  
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Qishloq xo'jaligi fanlari doktori, professor</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>O'zbekiston Respublikasi Qishloq xo'jaligi vazirligi huzuridagi Oziq-ovqat va qishloq xo'jaligi sohasida strategik rivojlanish va tadqiqotlar xalqaro markazi direktori</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ EDITORIAL BOARD MEMBERS ============ */}
      <section className="py-20 section-base">
        <div className="container mx-auto px-4 max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4">Mahalliy Tahrir A'zolari</h2>
              <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {editors.map((editor, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="p-6 rounded-xl border border-border bg-background hover:border-primary/30 transition-all group">
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{editor.name}</h3>
                  <div className="text-sm text-muted-foreground flex flex-col gap-1">
                    <span className="font-medium text-foreground/80">{editor.role}</span>
                    <span>{editor.degree}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INTERNATIONAL BOARD ============ */}
      <section className="py-20 section-alt border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4">Xalqaro Tahrir A'zolari</h2>
              <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {intEditors.map((editor, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="p-6 rounded-xl border border-border bg-background hover:border-primary/30 transition-all text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 mx-auto mb-4 flex items-center justify-center text-xl">
                    {editor.country === 'Rossiya' ? '🇷🇺' : editor.country === 'AQSh' ? '🇺🇸' : editor.country === 'Buyuk Britaniya' ? '🇬🇧' : '🇨🇳'}
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{editor.name}</h3>
                  <p className="text-xs font-medium text-foreground/80 mb-2">{editor.country}</p>
                  <p className="text-sm text-muted-foreground">{editor.degree}</p>
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

export default EditorialBoard;
