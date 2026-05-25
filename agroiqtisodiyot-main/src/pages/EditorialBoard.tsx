import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Crown } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-10 left-20 w-32 h-32 border border-white/5 rounded-full animate-spin-slow" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 animate-fade-in-up">Tahrir Hay'ati</h1>
          <p className="text-white/70 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            "AGROIQTISODIYOT" ilmiy jurnali tahrir hay'ati a'zolari
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-glass">
                  <CardContent className="p-6 text-center">
                    <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-5 w-40 mx-auto mb-2" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Chief Editor */}
              {chief && (
                <ScrollReveal>
                  <Card className="mb-10 border-2 border-gold/30 shadow-glow-gold bg-gradient-to-br from-amber-500/5 to-amber-600/[0.02] dark:from-amber-500/10 dark:to-transparent">
                    <CardContent className="p-8 text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-glow-gold">
                        <Crown className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-serif font-bold mb-1">{chief.name}</h2>
                      <p className="text-amber-600 dark:text-amber-400 font-medium">{chief.position}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}

              {/* Members grid */}
              <ScrollReveal>
                <h3 className="text-xl font-serif font-bold mb-6 text-center text-muted-foreground">
                  Tahrir hay'ati a'zolari
                </h3>
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {editors.map((member, i) => (
                  <ScrollReveal key={member.id} delay={i * 0.05}>
                    <Card className="card-lift border-0 shadow-glass group h-full">
                      <CardContent className="p-5 text-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center mx-auto mb-3 text-white font-bold text-sm group-hover:scale-110 transition-transform">
                          {getInitials(member.name)}
                        </div>
                        <h3 className="font-serif font-bold text-sm mb-0.5">{member.name}</h3>
                        <p className="text-xs text-muted-foreground">{member.position}</p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>

              {members.length === 0 && (
                <div className="text-center py-20">
                  <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Tahrir hay'ati a'zolari hali qo'shilmagan</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default EditorialBoard;
