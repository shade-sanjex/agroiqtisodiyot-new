import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, Loader2, MessageCircle, SendHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak").max(100),
  email: z.string().trim().email("Noto'g'ri email manzil"),
  message: z.string().trim().min(10, "Xabar kamida 10 ta belgidan iborat bo'lishi kerak").max(2000),
});

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    { icon: MapPin, label: 'Manzil', value: "100140, Toshkent viloyati, Qibray tumani, Universitet ko'chasi, 2-uy" },
    { icon: Phone, label: 'Telefon', value: '+998 90 358 61 64', href: 'tel:+998903586164' },
    { icon: Mail, label: 'Email', value: 'ooqxssrtxm@agro.uz', href: 'mailto:ooqxssrtxm@agro.uz' },
    { icon: Clock, label: 'Ish vaqti', value: 'Dushanba — Juma, 9:00 — 18:00' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validated = contactSchema.parse(formData);
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name: validated.name, email: validated.email, message: validated.message }]);
      if (error) throw error;
      toast.success("Xabaringiz yuborildi!", { description: "Tez orada siz bilan bog'lanamiz." });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => toast.error(err.message));
      } else {
        toast.error("Xabar yuborishda xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* ============ HERO BANNER ============ */}
      <section className="relative h-[250px] md:h-[320px] flex items-center justify-center overflow-hidden bg-hero-light dark:bg-hero-dark border-b border-border/40">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/6 blur-3xl animate-float-slow -z-10" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-secondary/6 blur-3xl animate-float-delayed -z-10" />
        
        <div className="relative text-center z-10 space-y-3 px-4">
          <ScrollReveal>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/15">
              <MessageCircle className="h-3.5 w-3.5" />
              BOG'LANISH
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-black mt-3 text-foreground drop-shadow-sm">
              Biz bilan bog'laning
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm max-w-xl mx-auto font-light leading-relaxed mt-2">
              Loyiha haqida savollaringiz, takliflaringiz yoki ilmiy hamkorlik g'oyalaringiz bormi?
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ MAIN CONTACT DASHBOARD ============ */}
      <section className="py-16 md:py-24 section-alt">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Contact Info */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <ScrollReveal>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full tracking-wide mb-3">
                  MA'LUMOTLAR
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  Aloqa Yo'llari
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-2 mb-8">
                  Quyidagi manzil, telefon va elektron pochta manzili orqali biz bilan bevosita aloqaga chiqishingiz mumkin:
                </p>
              </ScrollReveal>

              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.05}>
                    <Card className="border border-border/60 bg-card/80 backdrop-blur-md shadow-sm card-lift border-l-4 border-l-primary">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 text-primary">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="text-xs md:text-sm font-bold text-foreground hover:text-primary transition-colors">{item.value}</a>
                          ) : (
                            <p className="text-xs md:text-sm font-medium text-foreground">{item.value}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}

                {/* Telegram Bot Card */}
                <ScrollReveal delay={0.2}>
                  <Card className="border border-primary/15 bg-primary/5 backdrop-blur-md shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform" />
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 text-primary">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-xs text-foreground">Telegram botimiz faol</p>
                        <p className="text-[11px] text-muted-foreground">Nashrlarni Telegram orqali yuklash va yangiliklarni olish</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="right">
                <Card className="border border-border/60 shadow-md bg-card/80 backdrop-blur-md rounded-2xl overflow-hidden">
                  <CardContent className="p-6 md:p-10 text-left">
                    <div className="mb-8 space-y-2">
                      <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full tracking-wide">
                        ALOQA SHAKLI
                      </span>
                      <h2 className="text-xl md:text-2xl font-serif font-black text-foreground">Xabar Yuboring</h2>
                      <p className="text-xs text-muted-foreground">Takliflaringiz yoki ilmiy masalalardagi savollaringizni shu yerdan yuborishingiz mumkin:</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Ismingiz</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="To'liq ismingiz"
                          maxLength={100}
                          className="rounded-xl h-11 bg-background/50 border-border/70 focus:border-primary/50 text-xs md:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Email Manzil</label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="rounded-xl h-11 bg-background/50 border-border/70 focus:border-primary/50 text-xs md:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Xabar Matni</label>
                        <Textarea
                          required
                          value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Xabaringizni bu yerga kiriting..."
                          rows={6}
                          maxLength={2000}
                          className="rounded-xl resize-none bg-background/50 border-border/70 focus:border-primary/50 text-xs md:text-sm leading-relaxed"
                        />
                        <p className="text-[11px] text-muted-foreground mt-1 text-right font-mono">{formData.message.length}/2000</p>
                      </div>
                      
                      <div className="pt-2">
                        <Button type="submit" className="w-full rounded-xl h-12 shadow-lg shadow-primary/10 font-bold text-sm" disabled={loading}>
                          {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Yuborilmoqda...</>
                          ) : (
                            <><SendHorizontal className="h-4 w-4 mr-2" /> Xabarni yuborish</>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Contact;