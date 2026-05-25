import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Type,
  Layout,
  BookOpen,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ArrowRight,
  ListChecks,
} from 'lucide-react';

const Requirements = () => {
  const generalRules = [
    "Maqolalar faqat elektron shaklda, MS Word (.doc, .docx) formatida qabul qilinadi.",
    "Maqola tili: O'zbek, Rus yoki Ingliz tillarida.",
    "Maqola hajmi: 5 dan 15 betgacha (A4 formati).",
    "Originallik: Maqola oldin boshqa joyda chop etilmagan va antiplagiat tizimida kamida 75% o'ziga xoslikka ega bo'lishi shart."
  ];

  const formattingRules = [
    { icon: Type, title: "Shrift", desc: "Times New Roman, 12 pt o'lchamda." },
    { icon: Layout, title: "Qator orasi", desc: "1.15 interval, matn har ikki tomondan tekislangan (Justify)." },
    { icon: BookOpen, title: "Hoshiyalar", desc: "Barcha tomonlardan 2 sm (Yuqori, Past, Chap, O'ng)." },
    { icon: LinkIcon, title: "Havolalar", desc: "Iqtiboslar kvadrat qavs ichida [1, p. 15] ko'rinishida beriladi." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* ============ MINIMAL HERO ============ */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-border overflow-hidden bg-background">
        {/* Subtle grid pattern and elegant glow */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-15 dark:opacity-5 bg-primary/30 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
              <ListChecks className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight">
              Nashr Talablari
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
              "Agroiqtisodiyot" jurnalida maqola chop etish uchun mualliflarga qo'yiladigan asosiy talablar va qoidalar
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ GENERAL RULES & FORMATTING ============ */}
      <section className="py-20 section-base">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* General Rules */}
            <ScrollReveal direction="left">
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  Umumiy Qoidalar
                </h2>
                <div className="space-y-4">
                  {generalRules.map((rule, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-border bg-background items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/90 leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Formatting */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  Matnni Rasmiylashtirish
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formattingRules.map((rule, i) => (
                    <div key={i} className="p-5 rounded-xl border border-border bg-background flex flex-col gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <rule.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm mb-1">{rule.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rule.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ============ STRUCTURE ACCORDION ============ */}
      <section className="py-20 section-alt border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">Maqola Tuzilishi (IMRAD)</h2>
              <p className="text-muted-foreground text-sm">Jahon standartlari asosida maqolalar quyidagi tartibda yozilishi talab etiladi</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border border-border bg-background rounded-xl px-2">
                <AccordionTrigger className="text-base font-bold px-4 py-4 hover:no-underline">
                  1. Title, Abstract va Keywords
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed text-sm">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-foreground">Sarlavha (Title):</strong> Qisqa, aniq va maqola mazmunini to'liq ochib beruvchi (ko'pi bilan 12 so'z).</li>
                    <li><strong className="text-foreground">Annotatsiya (Abstract):</strong> Tadqiqot maqsadi, metodi, natijalari va xulosasini o'z ichiga olgan 150-250 so'zlik qisqa matn.</li>
                    <li><strong className="text-foreground">Kalit so'zlar (Keywords):</strong> Maqola mazmunini yorituvchi 5-7 ta so'z.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border bg-background rounded-xl px-2">
                <AccordionTrigger className="text-base font-bold px-4 py-4 hover:no-underline">
                  2. Introduction (Kirish)
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed text-sm">
                  Tadqiqotning dolzarbligi, o'rganilayotgan muammoning qisqacha tavsifi, ilgari qilingan ishlarning qisqacha tahlili (adabiyotlar sharhi) va ushbu tadqiqotning maqsadi aniq yoritilishi kerak.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border bg-background rounded-xl px-2">
                <AccordionTrigger className="text-base font-bold px-4 py-4 hover:no-underline">
                  3. Methods (Metodologiya)
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed text-sm">
                  Tadqiqot qanday usullar yordamida o'tkazilganligi tushuntiriladi. Ma'lumotlar qayerdan olinganligi, qanday statistik yoki iqtisodiy modellar qo'llanilgani batafsil yozilishi kerak.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border bg-background rounded-xl px-2">
                <AccordionTrigger className="text-base font-bold px-4 py-4 hover:no-underline">
                  4. Results and Discussion (Natijalar va Muhokama)
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed text-sm">
                  Olingan asosiy natijalar aniq, jadvallar va grafiklar bilan taqdim etiladi. Shu bilan birga, bu natijalarning amaliy va nazariy ahamiyati, boshqa tadqiqotchilar natijalari bilan taqqoslanishi (Discussion) keltiriladi.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border bg-background rounded-xl px-2">
                <AccordionTrigger className="text-base font-bold px-4 py-4 hover:no-underline">
                  5. Conclusion (Xulosa)
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed text-sm">
                  Tadqiqot natijalari asosida qilingan qisqa, aniq xulosalar. Muammoni hal qilish bo'yicha amaliy taklif va tavsiyalar berilishi zarur.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-border bg-background rounded-xl px-2">
                <AccordionTrigger className="text-base font-bold px-4 py-4 hover:no-underline">
                  6. References (Foydalanilgan adabiyotlar)
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed text-sm">
                  Manbalar ro'yxati APA (American Psychological Association) uslubida shakllantirilishi lozim. Eng kamida 10-15 ta manba bo'lishi va ularning 50% dan ortig'i so'nggi 5 yilda nashr etilgan bo'lishi tavsiya qilinadi.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ CLEAN AI CHECKER PROMO ============ */}
      <section className="py-20 section-base">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <Card className="iscad-card border-primary/20 bg-primary/5">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Cpu className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">
                  Maqolangiz talablarga mosligini tekshiring
                </h3>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm leading-relaxed">
                  Bizning Sun'iy Intellekt tizimimiz maqolangizni qabul qilishdan oldin avtomatik ravishda barcha tahririyat talablariga mosligini, imlo xatolarini va plagiat elementlarini tekshirib beradi.
                </p>
                <Link to="/article-checker">
                  <Button size="lg" className="rounded-lg px-8 font-medium">
                    AI Tekshiruvdan O'tkazish
                    <ArrowRight className="ml-2 h-4 w-4" />
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
