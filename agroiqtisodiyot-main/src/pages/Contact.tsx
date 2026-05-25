import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, SendHorizontal, Loader2, MessageCircle } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* ============ PREMIUM HERO ============ */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-border/80 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="mesh-gradient-glow top-[-300px] left-[-300px] opacity-70" />
        
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight">
              Biz Bilan Bog'laning
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
              Loyiha haqida savollaringiz, takliflaringiz yoki ilmiy hamkorlik g'oyalaringiz bo'lsa, quyidagi vositalar orqali murojaat qiling.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ CONTACT CONTENT ============ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column Contact Details */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <ScrollReveal>
                <h2 className="text-2xl font-serif font-black text-foreground mb-8">
                  Aloqa Ma'lumotlari
                </h2>
              </ScrollReveal>

              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.05}>
                    <div className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 flex items-start gap-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                        <item.icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="font-bold text-[9px] text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-xs md:text-sm font-bold text-foreground hover:text-primary transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-xs md:text-sm font-bold text-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}

                {/* Telegram Bot Card */}
                <ScrollReveal delay={0.2}>
                  <div className="mt-8 p-6 rounded-2xl border border-border/80 bg-secondary/20 flex items-center gap-5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary border border-primary/20">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Telegram botimiz</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-medium">Nashrlarni yuklash va yangiliklar kanali</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Right Column Contact Form */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="right">
                <Card className="glass-card border border-border/80 shadow-md p-2 md:p-4 bg-card">
                  <CardContent className="p-6 md:p-8 text-left">
                    <h2 className="text-2xl font-serif font-black text-foreground mb-8">
                      Xabar Yuborish
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ismingiz</label>
                          <Input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="To'liq ism"
                            maxLength={100}
                            className="h-12 bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none rounded-xl text-xs md:text-sm font-medium"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</label>
                          <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@example.com"
                            className="h-12 bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none rounded-xl text-xs md:text-sm font-medium"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Xabar Matni</label>
                        <Textarea
                          required
                          value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Qanday yordam bera olamiz?"
                          rows={6}
                          maxLength={2000}
                          className="resize-none bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none rounded-xl p-4 text-xs md:text-sm font-medium"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1 text-right font-mono">{formData.message.length}/2000</p>
                      </div>
                      
                      <Button type="submit" className="w-full rounded-full h-12 font-bold glow-button-primary bg-primary text-primary-foreground uppercase tracking-wider text-xs" disabled={loading}>
                        {loading ? (
                          <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Yuborilmoqda...</>
                        ) : (
                          <><SendHorizontal className="h-4 w-4 mr-2" /> Xabarni yuborish</>
                        )}
                      </Button>
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