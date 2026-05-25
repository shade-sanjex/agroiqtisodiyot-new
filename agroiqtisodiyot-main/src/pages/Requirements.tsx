import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Type,
  Layout,
  BookOpen,
  Link as LinkIcon,
  CheckCircle2,
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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* ============ PREMIUM HERO ============ */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-border/80 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="mesh-gradient-glow top-[-300px] left-[-300px] opacity-70" />
        
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6">
              <ListChecks className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight">
              Nashr Talablari
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
              "Agroiqtisodiyot" jurnalida maqola chop etish uchun mualliflarga qo'yiladigan asosiy talablar va qoidalar
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ GENERAL RULES & FORMATTING ============ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* General Rules */}
            <ScrollReveal direction="left">
              <div className="space-y-6 text-left">
                <h2 className="text-2xl font-serif font-black text-foreground">
                  Umumiy Qoidalar
                </h2>
                <div className="space-y-4">
                  {generalRules.map((rule, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl border border-border/85 bg-card items-start hover:border-primary/25 transition-all">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm font-medium text-foreground/90 leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Formatting */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="space-y-6 text-left">
                <h2 className="text-2xl font-serif font-black text-foreground">
                  Matnni Rasmiylashtirish
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formattingRules.map((rule, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col gap-4 hover:border-primary/25 transition-all">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <rule.icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm mb-1.5 tracking-tight">{rule.title}</h4>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{rule.desc}</p>
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
      <section className="py-20 section-alt border-y border-border/80">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-black mb-4">Maqola Tuzilishi (IMRAD)</h2>
              <p className="text-muted-foreground text-xs md:text-sm font-medium">Jahon standartlari asosida maqolalar quyidagi tartibda yozilishi talab etiladi</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border border-border/80 bg-card rounded-2xl px-2">
                <AccordionTrigger className="text-sm md:text-base font-bold px-4 py-4 hover:no-underline uppercase tracking-wide">
                  1. Title, Abstract va Keywords
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-left text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-foreground">Sarlavha (Title):</strong> Qisqa, aniq va maqola mazmunini to'liq ochib beruvchi (ko'pi bilan 12 so'z).</li>
                    <li><strong className="text-foreground">Annotatsiya (Abstract):</strong> Tadqiqot maqsadi, metodi, natijalari va xulosasini o'z ichiga olgan 150-250 so'zlik qisqa matn.</li>
                    <li><strong className="text-foreground">Kalit so'zlar (Keywords):</strong> Maqola mazmunini yorituvchi 5-7 ta so'z.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border/80 bg-card rounded-2xl px-2">
                <AccordionTrigger className="text-sm md:text-base font-bold px-4 py-4 hover:no-underline uppercase tracking-wide">
                  2. Introduction (Kirish)
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-left text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">
                  Tadqiqotning dolzarbligi, o'rganilayotgan muammoning qisqacha tavsifi, ilgari qilingan ishlarning qisqacha tahlili (adabiyotlar sharhi) va ushbu tadqiqotning maqsadi aniq yoritilishi kerak.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border/80 bg-card rounded-2xl px-2">
                <AccordionTrigger className="text-sm md:text-base font-bold px-4 py-4 hover:no-underline uppercase tracking-wide">
                  3. Methods (Metodologiya)
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-left text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">
                  Tadqiqot qanday usullar yordamida o'tkazilganligi tushuntirilari. Ma'lumotlar qayerdan olinganligi, qanday statistik yoki iqtisodiy modellar qo'llanilgani batafsil yozilishi kerak.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border/80 bg-card rounded-2xl px-2">
                <AccordionTrigger className="text-sm md:text-base font-bold px-4 py-4 hover:no-underline uppercase tracking-wide">
                  4. Results and Discussion (Natijalar va Muhokama)
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-left text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">
                  Olingan asosiy natijalar aniq, jadvallar va grafiklar bilan taqdim etiladi. Shu bilan birga, bu natijalarning amaliy va nazariy ahamiyati, boshqa tadqiqotchilar natijalari bilan taqqoslanishi (Discussion) keltiriladi.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border/80 bg-card rounded-2xl px-2">
                <AccordionTrigger className="text-sm md:text-base font-bold px-4 py-4 hover:no-underline uppercase tracking-wide">
                  5. Conclusion (Xulosa)
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-left text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">
                  Tadqiqot Natijalari asosida qilingan qisqa, aniq xulosalar. Muammoni hal qilish bo'yicha amaliy taklif va tavsiyalar berilishi zarur.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-border/80 bg-card rounded-2xl px-2">
                <AccordionTrigger className="text-sm md:text-base font-bold px-4 py-4 hover:no-underline uppercase tracking-wide">
                  6. References (Foydalanilgan adabiyotlar)
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-left text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">
                  Manbalar ro'yxati APA (American Psychological Association) uslubida shakllantirilishi lozim. Eng kamida 10-15 ta manba bo'lishi va ularning 50% dan ortig'i so'nggi 5 yilda nashr etilgan bo'lishi tavsiya qilinadi.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ PREMIUM AI CHECKER PROMO ============ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollReveal>
            <Card className="glass-card border-primary/30 bg-primary/5 p-2 rounded-2xl">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border/80 flex items-center justify-center mx-auto shadow-sm text-primary">
                  <Cpu className="h-8 w-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-black">
                  Maqolangiz talablarga mosligini tekshiring
                </h3>
                <p className="text-muted-foreground max-w-xl mx-auto text-xs md:text-sm font-medium leading-relaxed">
                  Bizning Sun'iy Intellekt tizimimiz maqolangizni qabul qilishdan oldin avtomatik ravishda barcha tahririyat talablariga mosligini, imlo xatolarini va plagiat elementlarini tekshirib beradi.
                </p>
                <div className="pt-2">
                  <Link to="/article-checker">
                    <Button size="lg" className="rounded-full px-8 h-12 font-bold glow-button-primary bg-primary text-primary-foreground uppercase tracking-wider text-xs">
                      AI Tekshiruvdan O'tkazish
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
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
