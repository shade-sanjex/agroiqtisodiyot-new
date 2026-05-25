import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, Loader2, MessageCircle } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute bottom-10 left-10 w-32 h-32 border border-white/5 rounded-full animate-float" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 animate-fade-in-up">Biz bilan Bog'laning</h1>
          <p className="text-white/70 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Savollaringiz bormi? Biz har doim yordam berishga tayyormiz
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <ScrollReveal direction="left">
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold mb-6">Aloqa Ma'lumotlari</h2>
                {contactInfo.map((item, i) => (
                  <Card key={i} className="glass border-0 shadow-glass card-lift">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Telegram CTA */}
                <Card className="bg-gradient-to-r from-[#229ED9]/10 to-[#229ED9]/5 border-[#229ED9]/20">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#229ED9]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-[#229ED9]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Telegram botimiz</p>
                      <p className="text-xs text-muted-foreground">Jurnallarni Telegram orqali ham yuklab olishingiz mumkin</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal direction="right">
              <Card className="shadow-glass-lg border-0">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-serif font-bold mb-6">Xabar Yuborish</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Ismingiz</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="To'liq ismingiz"
                        maxLength={100}
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Email</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Xabar</label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Xabaringizni yozing..."
                        rows={5}
                        maxLength={2000}
                        className="rounded-xl resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-right">{formData.message.length}/2000</p>
                    </div>
                    <Button type="submit" className="w-full rounded-xl h-11 shadow-lg shadow-primary/20" disabled={loading}>
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Yuborilmoqda...</>
                      ) : (
                        <><Send className="h-4 w-4 mr-2" /> Yuborish</>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Contact;