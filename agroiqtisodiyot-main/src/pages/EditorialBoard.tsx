import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Crown, Award, BookOpen, Compass } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Member {
  id: string;
  name: string;
  position: string;
  order_index: number;
}

const EditorialBoard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await supabase
        .from('editorial_board')
        .select('*')
        .order('order_index', { ascending: true });
      setMembers(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const chief = members.find(m => m.position === 'Bosh Muharrir');
  const editors = members.filter(m => m.position !== 'Bosh Muharrir');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* ============ PREMIUM HERO BANNER ============ */}
      <section className="relative h-[250px] md:h-[320px] flex items-center justify-center overflow-hidden bg-mesh-light dark:bg-mesh-dark border-b border-border/40">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

        {/* Colorful Aurora Blobs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/25 blur-3xl animate-float-slow -z-10" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-500/10 dark:bg-emerald-500/25 blur-3xl animate-float-delayed -z-10" />

        <div className="absolute top-10 left-20 w-32 h-32 border border-primary/5 dark:border-white/5 rounded-full animate-spin-slow -z-10" />
        
        <div className="relative text-center z-10 space-y-3 px-4">
          <ScrollReveal>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20 dark:border-emerald-500/30">
              <Users className="h-3.5 w-3.5" />
              ILMIY KENGASH
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-black mt-3 text-foreground dark:text-white drop-shadow-sm">
              Tahrir Hay'ati
            </h1>
            <p className="text-muted-foreground dark:text-white/70 text-xs md:text-sm max-w-xl mx-auto font-light leading-relaxed mt-2">
              "AGROIQTISODIYOT" ilmiy jurnalining xalqaro va milliy ekspert-olimlaridan iborat tarkibi
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ MAIN MEMBERS SECTION ============ */}
      <section className="py-16 md:py-24 bg-mesh-light dark:bg-mesh-dark flex-1">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-glass bg-card/50">
                  <CardContent className="p-6 text-center space-y-4">
                    <Skeleton className="w-16 h-16 rounded-full mx-auto" />
                    <Skeleton className="h-5 w-40 mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              
              {/* Chief Editor Section (OVERHAULED) */}
              {chief && (
                <ScrollReveal>
                  <Card className="border-2 border-amber-500/30 shadow-glow-gold bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/[0.01] rounded-2xl overflow-hidden backdrop-blur-md relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform" />
                    
                    <CardContent className="p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center gap-6 md:gap-10">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0 animate-float-slow">
                        <Crown className="h-10 w-10 text-white" />
                      </div>
                      
                      <div className="space-y-3 flex-1">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                          <Award className="h-3 w-3" />
                          Nashriyot rahbari
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif font-black text-foreground">
                          {chief.name}
                        </h2>
                        <p className="text-base font-semibold text-amber-600 dark:text-amber-400">
                          {chief.position}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                          Markaz ilmiy yo'nalishlarini belgilash, jurnallarning dolzarb mavzularda chop etilishi hamda ilmiy maqolalarning yuqori sifat standartlariga muvofiqligini nazorat qiluvchi bosh muharrir.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}

              {/* Members grid (OVERHAULED) */}
              {editors.length > 0 && (
                <div className="space-y-8">
                  <ScrollReveal className="text-center">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full tracking-wide mb-2">
                      TAHRIR KENGASHI A'ZOLARI
                    </span>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-muted-foreground">
                      Tahrir Hay'ati Olimlari
                    </h3>
                  </ScrollReveal>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {editors.map((member, i) => (
                      <ScrollReveal key={member.id} delay={i * 0.05}>
                        <Card className="card-lift border border-border/70 shadow-sm bg-card/50 backdrop-blur-md group h-full transition-all duration-300 hover:border-emerald-500/25">
                          <CardContent className="p-6 text-center space-y-4">
                            
                            {/* Initials badge */}
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto text-white font-bold text-sm shadow-md group-hover:scale-110 group-hover:shadow-emerald-500/20 transition-all duration-300">
                              {getInitials(member.name)}
                            </div>
                            
                            <div className="space-y-1">
                              <h3 className="font-serif font-bold text-sm md:text-base text-foreground leading-tight">
                                {member.name}
                              </h3>
                              <div className="w-8 h-0.5 bg-border rounded-full mx-auto group-hover:w-16 transition-all duration-300" />
                              <p className="text-xs text-muted-foreground font-medium pt-1">
                                {member.position}
                              </p>
                            </div>

                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}

              {members.length === 0 && (
                <div className="text-center py-20 bg-card/40 border border-dashed border-border rounded-2xl">
                  <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">Tahrir hay'ati a'zolari hali qo'shilmagan</p>
                </div>
              )}

            </div>
          )}

        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default EditorialBoard;
