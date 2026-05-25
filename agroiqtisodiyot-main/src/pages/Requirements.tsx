import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  FileText, 
  PenTool, 
  Search, 
  CheckCircle, 
  Send, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle,
  BookOpen,
  Scale
} from 'lucide-react';

const Requirements = () => {
  const steps = [
    { num: 1, icon: PenTool, title: 'Maqolani tayyorlang', desc: 'Quyidagi talablarga muvofiq maqolangizni tayyorlang. Format, hajm va til bo\'yicha barcha ko\'rsatmalarga amal qiling.', color: 'border-l-blue-500 bg-blue-500/5' },
    { num: 2, icon: Search, title: 'AI bilan tekshiring', desc: 'Maqolangizni AI tekshirish xizmatimiz orqali imlo, grammatik xatolar va talablarga mosligini tekshiring.', color: 'border-l-emerald-500 bg-emerald-500/5' },
    { num: 3, icon: Send, title: 'Tahrir hay\'atiga yuboring', desc: 'Tekshirilgan maqolani tahrir hay\'ati e-pochtasiga (ooqxssrtxm@agro.uz) yuboring.', color: 'border-l-amber-500 bg-amber-500/5' },
    { num: 4, icon: CheckCircle, title: 'Ko\'rib chiqish va nashr', desc: 'Tahrir hay\'ati maqolani ko\'rib chiqadi, kerak bo\'lsa tuzatishlarni tavsiya etadi va nashr etadi.', color: 'border-l-purple-500 bg-purple-500/5' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* ============ PREMIUM HERO BANNER ============ */}
      <section className="relative h-[250px] md:h-[320px] flex items-center justify-center overflow-hidden bg-mesh-dark">
        <div className="absolute top-20 left-10 w-24 h-24 border border-white/5 rounded-xl rotate-45 animate-float -z-10" />
        <div className="absolute bottom-10 right-10 w-36 h-36 rounded-full bg-emerald-500/5 blur-2xl animate-float-slow -z-10" />
        
        <div className="relative text-center text-white z-10 space-y-3 px-4">
          <ScrollReveal>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
              <FileText className="h-3.5 w-3.5" />
              TARTIB VA QOIDALAR
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-black mt-3 text-white drop-shadow-md">
              Jurnal Talablari
            </h1>
            <p className="text-white/70 text-xs md:text-sm max-w-xl mx-auto font-light leading-relaxed mt-2">
              "AGROIQTISODIYOT" ilmiy jurnalida maqola chop etish uchun belgilangan barcha rasmiy talablar
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ MAIN PROCESS SECTION ============ */}
      <section className="py-16 md:py-24 bg-mesh-light dark:bg-mesh-dark">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Steps section */}
          <ScrollReveal className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full tracking-wide mb-2">
              BOSQICHMA-BOSQICH
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              Maqola Yuborish Jarayoni
            </h2>
          </ScrollReveal>

          <div className="relative mb-20">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border hidden md:block" />

            <div className="space-y-6">
              {steps.map((step, i) => (
                <ScrollReveal key={step.num} delay={i * 0.08}>
                  <div className="flex gap-4 md:gap-6 items-start relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/95 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md z-10 animate-float-slow" style={{ animationDelay: `${i * 0.5}s` }}>
                      {step.num}
                    </div>
                    <Card className={`flex-1 border-0 border-l-4 ${step.color} shadow-sm bg-card/50 backdrop-blur-md card-lift`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <step.icon className="h-4.5 w-4.5 text-primary" />
                          <h3 className="font-serif font-bold text-sm md:text-base">{step.title}</h3>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* ============ DETAILED REQUIREMENTS ============ */}
          <div className="space-y-6">
            <ScrollReveal className="text-center mb-4">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full tracking-wide mb-2">
                TEXNIK PARAMETRLAR
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                Umumiy Texnik Talablar
              </h2>
            </ScrollReveal>

            <ScrollReveal>
              <Accordion type="single" collapsible className="space-y-3">
                
                <AccordionItem value="format" className="border border-border/80 rounded-xl px-5 bg-card/45 backdrop-blur-md shadow-sm">
                  <AccordionTrigger className="text-xs md:text-sm font-bold py-4 hover:text-primary transition-colors">
                    📄 Format Talablari
                  </AccordionTrigger>
                  <AccordionContent className="text-xs md:text-sm text-muted-foreground space-y-2 pb-4 pt-1 leading-relaxed border-t border-border/40 text-left">
                    <p>• <strong>Qog'oz o'lchami:</strong> A4 formatda, chetlari barcha tomondan 2 sm.</p>
                    <p>• <strong>Shrift va o'lcham:</strong> Times New Roman, 14pt (ilmiy matn uchun standart).</p>
                    <p>• <strong>Satrlar oralig'i:</strong> 1.5 intervalda joylashtirilishi lozim.</p>
                    <p>• <strong>Fayl shakli:</strong> Maqola faqat Microsoft Word formatida (.docx) qabul qilinadi.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="volume" className="border border-border/80 rounded-xl px-5 bg-card/45 backdrop-blur-md shadow-sm">
                  <AccordionTrigger className="text-xs md:text-sm font-bold py-4 hover:text-primary transition-colors">
                    📏 Hajm Talablari
                  </AccordionTrigger>
                  <AccordionContent className="text-xs md:text-sm text-muted-foreground space-y-2 pb-4 pt-1 leading-relaxed border-t border-border/40 text-left">
                    <p>• <strong>Maqola hajmi:</strong> Kamida 8 betdan iborat bo'lishi talab etiladi.</p>
                    <p>• <strong>Annotatsiya (Abstract):</strong> O'zbek, rus va ingliz tillarida 150-250 so'zdan iborat qisqacha kirish.</p>
                    <p>• <strong>Kalit so'zlar:</strong> Uch tilda 5 tadan 8 tagacha asosiy iboralar.</p>
                    <p>• <strong>Adabiyotlar:</strong> Maqolada kamida 10 ta ilmiy manbaga havolalar bo'lishi kerak.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="language" className="border border-border/80 rounded-xl px-5 bg-card/45 backdrop-blur-md shadow-sm">
                  <AccordionTrigger className="text-xs md:text-sm font-bold py-4 hover:text-primary transition-colors">
                    🌐 Til Talablari
                  </AccordionTrigger>
                  <AccordionContent className="text-xs md:text-sm text-muted-foreground space-y-2 pb-4 pt-1 leading-relaxed border-t border-border/40 text-left">
                    <p>• <strong>Asosiy til:</strong> Maqolalar o'zbek, rus yoki ingliz tillarida taqdim etilishi mumkin.</p>
                    <p>• <strong>Annotatsiya va kalit so'zlar:</strong> Har bir maqola uchun uchta tilda (O'zbek, Rus, Ingliz) kiritilishi shart.</p>
                    <p>• <strong>Ilmiy terminologiya:</strong> Matnda tushunarli, aniq va professional ilmiy uslub qo'llanilishi kerak.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="author" className="border border-border/80 rounded-xl px-5 bg-card/45 backdrop-blur-md shadow-sm">
                  <AccordionTrigger className="text-xs md:text-sm font-bold py-4 hover:text-primary transition-colors">
                    👤 Mualliflar Haqida
                  </AccordionTrigger>
                  <AccordionContent className="text-xs md:text-sm text-muted-foreground space-y-2 pb-4 pt-1 leading-relaxed border-t border-border/40 text-left">
                    <p>• Muallif(lar)ning to'liq F.I.Sh., ilmiy daraja va unvonlari.</p>
                    <p>• Ish joyi (tashkilot nomi), lavozimi hamda aloqa ma'lumotlari (pochta, telefon).</p>
                    <p>• Muallifning ORCID identifikator raqami ilova qilinishi tavsiya etiladi.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="refs" className="border border-border/80 rounded-xl px-5 bg-card/45 backdrop-blur-md shadow-sm">
                  <AccordionTrigger className="text-xs md:text-sm font-bold py-4 hover:text-primary transition-colors">
                    📚 Adabiyotlar Ro'yxati
                  </AccordionTrigger>
                  <AccordionContent className="text-xs md:text-sm text-muted-foreground space-y-2 pb-4 pt-1 leading-relaxed border-t border-border/40 text-left">
                    <p>• <strong>Havola formati:</strong> Foydalanilgan manbalar ro'yxati APA 7-nashri talablariga mos tuzilishi kerak.</p>
                    <p>• <strong>Manbalar sifati:</strong> Adabiyotlar ro'yxatida nufuzli ilmiy jurnallar va xalqaro tadqiqotlar bo'lishi maqsadga muvofiq.</p>
                    <p>• <strong>Matn ichidagi havolalar:</strong> Gap yakunida qavs ichida, masalan (Familiya, yil) ko'rinishida yoziladi.</p>
                  </AccordionContent>
                </AccordionItem>
                
              </Accordion>
            </ScrollReveal>
          </div>

          {/* Warning */}
          <ScrollReveal>
            <Card className="mt-10 border-amber-500/30 bg-amber-500/5 backdrop-blur-md">
              <CardContent className="p-6 flex items-start gap-4 text-left">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-foreground mb-1">Muhim Eslatma (Plagiat & Originallik)</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Barcha maqolalar plagiat (antiplagiat) tizimida tekshiriladi. Maqolaning originallik darajasi **kamida 75%** bo'lishi kerak. Avval boshqa joyda chop etilgan yoki bir vaqtda boshqa nashriyotga yuborilgan ishlar rad etiladi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* AI checker promo banner */}
          <ScrollReveal>
            <Card className="mt-10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 shadow-glass rounded-2xl overflow-hidden backdrop-blur-md">
              <CardContent className="p-8 text-center space-y-4">
                <Sparkles className="h-8 w-8 text-emerald-500 mx-auto animate-pulse" />
                <h3 className="font-serif font-black text-lg text-foreground">Maqolangizni AI bilan bepul tekshiring</h3>
                <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Tahririyatga yuborishdan oldin, maqolani imlo, grammatika va jurnalimiz format talablariga mosligini AI yordamida tekshirib oling.
                </p>
                <div className="pt-2">
                  <Link to="/article-checker">
                    <Button className="rounded-full px-8 shadow-md">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Tekshirishga o'tish
                      <ArrowRight className="h-4 w-4 ml-2" />
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
