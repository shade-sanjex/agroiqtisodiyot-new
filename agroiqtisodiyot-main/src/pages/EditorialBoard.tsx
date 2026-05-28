import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, Building, Award, User } from 'lucide-react';
import editorialHero from '@/assets/editorial-hero.webp';

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* ============ PREMIUM HERO ============ */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 border-b border-border/80 overflow-hidden bg-background flex items-center justify-center min-h-[380px]">
        {/* Background Image with Ken Burns effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={editorialHero} 
            alt="Tahrir Hay'ati background" 
            className="w-full h-full object-cover opacity-[0.55] dark:opacity-[0.85] dark:brightness-[0.5] animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background dark:from-background/10 dark:via-background/50 dark:to-background" />
        </div>

        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-5" />
        <div className="mesh-gradient-glow top-[-300px] left-[-300px] opacity-60 z-5" />
        
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 text-primary mb-6 shadow-md backdrop-blur-sm">
              <Users className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight drop-shadow-sm">
              Tahrir Hay'ati
            </h1>
            <p className="text-sm md:text-base text-foreground/80 dark:text-muted-foreground font-semibold leading-relaxed max-w-3xl mx-auto">
              Jurnalning ilmiy yo'nalishi va tadqiqot sifatini ta'minlovchi mahalliy hamda xalqaro ekspertlar jamoasi
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ CHIEF EDITOR ============ */}
      <section className="py-20 section-alt">
        <div className="container mx-auto px-6 max-w-5xl">
          <ScrollReveal>
            <Card className="glass-card overflow-hidden bg-background border border-border/80 p-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Photo space */}
                <div className="md:col-span-4 relative flex justify-center py-6">
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-secondary/20 flex flex-col items-center justify-center border border-border relative overflow-hidden group/avatar transition-all duration-300">
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                    
                    {/* Academic Icon */}
                    <GraduationCap className="w-20 h-20 text-primary transition-transform duration-500 group-hover/avatar:scale-110 group-hover/avatar:text-accent" />
                    
                    {/* Text badge */}
                    <div className="absolute bottom-4 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full border border-border text-[9px] uppercase tracking-wider font-bold text-muted-foreground group-hover/avatar:text-primary transition-colors">
                      ISCAD
                    </div>
                  </div>
                </div>
                
                {/* Chief info */}
                <div className="md:col-span-8 p-6 md:p-10 flex flex-col justify-center text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-accent/15 border border-accent/25 rounded-full text-accent text-[10px] font-black uppercase tracking-wider mb-6 w-fit">
                    <Award className="h-3.5 w-3.5" /> Bosh Muharrir
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground mb-4 leading-tight">
                    Shuxrat Teshayev
                  </h2>
                  
                  <div className="space-y-4 text-sm font-medium text-muted-foreground">
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-black mb-4">Mahalliy Tahrir A'zolari</h2>
              <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {editors.map((editor, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-sm transition-all duration-300 group text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="font-bold text-foreground mb-3 text-base tracking-tight group-hover:text-primary transition-colors">{editor.name}</h3>
                  <div className="text-xs md:text-sm font-medium text-muted-foreground flex flex-col gap-1">
                    <span className="text-foreground/80 font-bold">{editor.role}</span>
                    <span>{editor.degree}</span>
                  </div>
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
