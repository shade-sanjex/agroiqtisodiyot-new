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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* ============ PREMIUM HERO ============ */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-border/80 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="mesh-gradient-glow top-[-300px] left-[-300px] opacity-70" />
        
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6">
              <Users className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight">
              Tahrir Hay'ati
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
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
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 flex items-center justify-center border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)] hover:shadow-[0_0_40px_rgba(245,158,11,0.12)] transition-all duration-500 group/emblem">
                    <svg viewBox="0 0 100 100" className="w-full h-full p-4 transition-transform duration-700 ease-out group-hover/emblem:scale-105">
                      <defs>
                        <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#d97706" />
                          <stop offset="35%" stopColor="#fbbf24" />
                          <stop offset="65%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#b45309" />
                        </linearGradient>
                      </defs>
                      
                      {/* Glow background */}
                      <circle cx="50%" cy="50%" r="48" fill="url(#gold-glow)" />
                      
                      {/* Outer decorative ring */}
                      <circle cx="50%" cy="50%" r="41" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" strokeDasharray="3 2" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '40s' }} />
                      
                      {/* Inner ring */}
                      <circle cx="50%" cy="50%" r="36" fill="none" stroke="url(#gold-grad)" strokeWidth="1" opacity="0.4" />
                      
                      {/* Wheat/Laurel leaves decoration (left side of seal) */}
                      <path d="M 32,58 C 30,48 37,38 42,33 C 40,39 36,45 36,51" fill="none" stroke="url(#gold-grad)" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M 34,48 C 31,45 29,46 29,46 C 31,48 33,49 34,48" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                      <path d="M 36,41 C 33,38 31,40 31,40 C 33,42 35,43 36,41" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                      
                      {/* Wheat/Laurel leaves decoration (right side of seal) */}
                      <path d="M 68,58 C 70,48 63,38 58,33 C 60,39 64,45 64,51" fill="none" stroke="url(#gold-grad)" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M 66,48 C 69,45 71,46 71,46 C 69,48 67,49 66,48" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />
                      <path d="M 64,41 C 67,38 69,40 69,40 C 67,42 65,43 64,41" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />

                      {/* Serif Monogram Initials in Center */}
                      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="url(#gold-grad)" fontSize="18" fontFamily="Playfair Display, Georgia, serif" fontWeight="900" letterSpacing="1">
                        ST
                      </text>
                      
                      {/* Bottom decorative academic star */}
                      <polygon points="50,68 51.5,71 54.5,71 52,72.5 53,75.5 50,73.5 47,75.5 48,72.5 45.5,71 48.5,71" fill="url(#gold-grad)" />
                    </svg>
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

      {/* ============ INTERNATIONAL BOARD ============ */}
      <section className="py-20 section-alt border-t border-border/80">
        <div className="container mx-auto px-6 max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-black mb-4">Xalqaro Tahrir A'zolari</h2>
              <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {intEditors.map((editor, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border border-border/80 bg-background hover:border-primary/40 transition-all duration-300 text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary/80 mx-auto mb-4 flex items-center justify-center text-xl">
                    {editor.country === 'Rossiya' ? '🇷🇺' : editor.country === 'AQSh' ? '🇺🇸' : editor.country === 'Buyuk Britaniya' ? '🇬🇧' : '🇨🇳'}
                  </div>
                  <h3 className="font-bold text-foreground mb-1 tracking-tight">{editor.name}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-2">{editor.country}</p>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">{editor.degree}</p>
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
