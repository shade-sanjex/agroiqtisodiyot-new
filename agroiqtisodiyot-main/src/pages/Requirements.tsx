import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, PenTool, Search, CheckCircle, Send, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';

const Requirements = () => {
  const steps = [
    { num: 1, icon: PenTool, title: 'Maqolani tayyorlang', desc: 'Quyidagi talablarga muvofiq maqolangizni tayyorlang. Format, hajm va til bo\'yicha barcha ko\'rsatmalarga amal qiling.' },
    { num: 2, icon: Search, title: 'AI bilan tekshiring', desc: 'Maqolangizni AI tekshirish xizmatimiz orqali imlo, grammatik xatolar va talablarga mosligini tekshiring.' },
    { num: 3, icon: Send, title: 'Tahrir hay\'atiga yuboring', desc: 'Tekshirilgan maqolani tahrir hay\'ati e-pochtasiga (ooqxssrtxm@agro.uz) yuboring.' },
    { num: 4, icon: CheckCircle, title: 'Ko\'rib chiqish va nashr', desc: 'Tahrir hay\'ati maqolani ko\'rib chiqadi, kerak bo\'lsa tuzatishlarni tavsiya etadi va nashr etadi.' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-24 h-24 border border-white/5 rounded-xl rotate-45 animate-float" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 animate-fade-in-up">Jurnal Talablari</h1>
          <p className="text-white/70 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            "AGROIQTISODIYOT" jurnalida maqola chop etish uchun talablar
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Steps */}
          <ScrollReveal>
            <h2 className="text-2xl font-serif font-bold mb-8">Maqola Yuborish Jarayoni</h2>
          </ScrollReveal>

          <div className="relative mb-16">
            {/* Connecting line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            <div className="space-y-6">
              {steps.map((step, i) => (
                <ScrollReveal key={step.num} delay={i * 0.1}>
                  <div className="flex gap-4 md:gap-6 items-start relative">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-glow z-10">
                      {step.num}
                    </div>
                    <Card className="flex-1 border-0 shadow-glass card-lift">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <step.icon className="h-5 w-5 text-primary" />
                          <h3 className="font-serif font-bold">{step.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <ScrollReveal>
            <h2 className="text-2xl font-serif font-bold mb-6">Umumiy Talablar</h2>
          </ScrollReveal>

          <ScrollReveal>
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="format" className="border rounded-xl px-4 shadow-sm">
                <AccordionTrigger className="text-sm font-semibold py-4">📄 Format Talablari</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2 pb-4">
                  <p>• Qog'oz o'lchami: A4 formatda</p>
                  <p>• Shrift: Times New Roman, 14pt</p>
                  <p>• Satrlar oralig'i: 1.5 interval</p>
                  <p>• Chegaralar: barcha tomondan 2 sm</p>
                  <p>• Fayl formati: .doc yoki .docx</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="volume" className="border rounded-xl px-4 shadow-sm">
                <AccordionTrigger className="text-sm font-semibold py-4">📏 Hajm Talablari</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2 pb-4">
                  <p>• Maqola hajmi: kamida 8 bet</p>
                  <p>• Annotatsiya: 150-250 so'z</p>
                  <p>• Kalit so'zlar: 5-8 ta</p>
                  <p>• Adabiyotlar ro'yxati: kamida 10 ta manba</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="language" className="border rounded-xl px-4 shadow-sm">
                <AccordionTrigger className="text-sm font-semibold py-4">🌐 Til Talablari</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2 pb-4">
                  <p>• Asosiy matn: O'zbek, Rus yoki Ingliz tilida</p>
                  <p>• Annotatsiya: uchala tilda (O'zbek, Rus, Ingliz)</p>
                  <p>• Kalit so'zlar: uchala tilda</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="author" className="border rounded-xl px-4 shadow-sm">
                <AccordionTrigger className="text-sm font-semibold py-4">👤 Mualliflar Haqida</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2 pb-4">
                  <p>• Muallif(lar)ning to'liq ismi</p>
                  <p>• Ilmiy daraja va unvoni</p>
                  <p>• Ish joyi va lavozimi</p>
                  <p>• Email manzili va telefon raqami</p>
                  <p>• ORCID identifikatori (tavsiya etiladi)</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refs" className="border rounded-xl px-4 shadow-sm">
                <AccordionTrigger className="text-sm font-semibold py-4">📚 Adabiyotlar Ro'yxati</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2 pb-4">
                  <p>• APA 7 formatida</p>
                  <p>• Kamida 10 ta manba</p>
                  <p>• Matn ichida havolalar: (Familiya, yil)</p>
                  <p>• Xalqaro manbalar ham kiritilishi kerak</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollReveal>

          {/* Warning */}
          <ScrollReveal>
            <Card className="mt-8 border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-5 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Muhim Eslatma</h4>
                  <p className="text-sm text-muted-foreground">
                    Plagiatga yo'l qo'yilmaydi. Maqolaning originallik darajasi kamida 75% bo'lishi kerak.
                    Avval chop etilgan maqolalar qabul qilinmaydi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* AI CTA */}
          <ScrollReveal>
            <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-0 shadow-glass">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg mb-2">Maqolangizni AI bilan tekshiring</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Yuborishdan oldin maqolangizni imlo va talablarga mosligini tekshiring
                </p>
                <Link to="/article-checker">
                  <Button className="rounded-full px-6">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Tekshirish
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
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

export default Requirements;
