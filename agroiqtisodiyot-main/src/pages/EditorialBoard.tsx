import { PageShell } from '@/components/layout/PageShell';
import { PageHero } from '@/components/ui-system/PageHero';
import { SectionHeading } from '@/components/ui-system/SectionHeading';
import { GlassCard } from '@/components/ui-system/GlassCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Users, GraduationCap, Building, Award } from 'lucide-react';
import editorialHero from '@/assets/editorial-hero.webp';

/** Ismdan initsiallarni (eng ko'pi 2 ta harf) ajratib oladi — initial-avatar uchun. */
const getInitials = (name: string): string => {
  const parts = name
    .split(/[\s.]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const letters = parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
  return letters.slice(0, 2) || '?';
};

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
    <PageShell>
      {/* ============ HERO ============ */}
      <PageHero
        eyebrow="ISCAD Tahririyati"
        title="Tahrir Hay'ati"
        description="Jurnalning ilmiy yo'nalishi va tadqiqot sifatini ta'minlovchi mahalliy hamda xalqaro ekspertlar jamoasi"
        backgroundImage={editorialHero}
        icon={Users}
      />

      {/* ============ CHIEF EDITOR ============ */}
      <section className="py-20 section-alt">
        <div className="container mx-auto px-6 max-w-5xl">
          <ScrollReveal>
            <GlassCard
              interactive
              variant="elevated"
              className="overflow-hidden p-1 group"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                {/* Initial-avatar */}
                <div className="md:col-span-4 relative flex justify-center py-6">
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-secondary/30 flex flex-col items-center justify-center border border-border/80 relative overflow-hidden transition-all duration-500 group-hover:border-primary/40">
                    {/* Nozik glow */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Initsiallar */}
                    <span className="font-serif font-black text-5xl md:text-6xl text-primary tracking-tight transition-transform duration-500 group-hover:scale-105">
                      {getInitials("Shuxrat Teshayev")}
                    </span>

                    {/* Brend yorlig'i */}
                    <div className="absolute bottom-4 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full border border-border/80 text-xs uppercase tracking-wider font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      ISCAD
                    </div>
                  </div>
                </div>

                {/* Bosh muharrir ma'lumoti */}
                <div className="md:col-span-8 p-6 md:p-10 flex flex-col justify-center text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-accent/15 border border-accent/25 rounded-full text-accent text-xs font-black uppercase tracking-wider mb-6 w-fit">
                    <Award className="h-3.5 w-3.5" /> Bosh Muharrir
                  </div>

                  <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground mb-4 leading-tight tracking-tight transition-colors group-hover:text-primary">
                    Shuxrat Teshayev
                  </h2>

                  <div className="space-y-4 text-xs md:text-sm font-medium text-muted-foreground">
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
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ EDITORIAL BOARD MEMBERS ============ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <ScrollReveal>
            <SectionHeading
              align="center"
              eyebrow="Ekspertlar Jamoasi"
              title="Mahalliy Tahrir A'zolari"
              className="mb-16"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {editors.map((editor, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <GlassCard
                  interactive
                  className="h-full p-6 flex items-start gap-4 text-left group"
                >
                  {/* Initial-avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif font-black text-base tracking-tight transition-colors group-hover:bg-primary/15 group-hover:border-primary/40">
                    {getInitials(editor.name)}
                  </div>

                  {/* Ism + lavozim + ilmiy daraja */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground text-base leading-snug tracking-tight transition-colors group-hover:text-primary">
                      {editor.name}
                    </h3>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-accent">
                      {editor.role}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
                      {editor.degree}
                    </p>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default EditorialBoard;
