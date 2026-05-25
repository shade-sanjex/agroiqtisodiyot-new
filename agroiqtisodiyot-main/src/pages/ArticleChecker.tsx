import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  Lightbulb,
  Cpu
} from 'lucide-react';
import { checkArticle, ArticleCheckResult } from '@/lib/ai-checker';

const ArticleChecker = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ArticleCheckResult | null>(null);

  const handleCheck = async () => {
    if (!text && !file) return;

    setIsChecking(true);
    setProgress(0);
    setResult(null);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 10;
      });
    }, 500);

    // Analyze text
    const textToAnalyze = file ? "Fayl mazmuni tahlil qilinmoqda... " + text : text;
    const analysisResult = await checkArticle(textToAnalyze);

    clearInterval(interval);
    setProgress(100);

    setTimeout(() => {
      setResult(analysisResult);
      setIsChecking(false);
    }, 500);
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 85) return 'stroke-primary text-primary';
    if (score >= 60) return 'stroke-amber-500 text-amber-500';
    return 'stroke-destructive text-destructive';
  };

  const getScoreBgColorClass = (score: number) => {
    if (score >= 85) return 'bg-primary/5 border-primary/20';
    if (score >= 60) return 'bg-amber-500/5 border-amber-500/20';
    return 'bg-destructive/5 border-destructive/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Jurnalga yuborish uchun tavsiya etiladi";
    if (score >= 60) return "Kamchiliklarni to'g'rilash talab etiladi";
    return "Maqolani jiddiy qayta ishlash zarur";
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
              <Cpu className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight">
              AI Maqola Tekshirish
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
              Maqolangizni imlo qoidalari, ilmiy uslub va nashr talablariga mosligi bo'yicha sun'iy intellekt yordamida tekshiring
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="py-16 md:py-24 section-alt flex-1">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
            
            {/* Input Panel */}
            <ScrollReveal direction="left">
              <Card className="glass-card border border-border/80 shadow-md h-full bg-card">
                <CardHeader className="border-b border-border/60 pb-4">
                  <CardTitle className="font-serif text-lg flex items-center gap-2 text-left">
                    <FileText className="h-5 w-5 text-primary" />
                    Maqolani yuklang
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-6 text-left">
                  <Tabs defaultValue="text" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-full bg-secondary p-1 h-12 mb-6">
                      <TabsTrigger value="text" className="rounded-full text-xs font-bold uppercase tracking-wider">Matn kiritish</TabsTrigger>
                      <TabsTrigger value="file" className="rounded-full text-xs font-bold uppercase tracking-wider">Fayl yuklash</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text" className="mt-0">
                      <Textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Maqola matnini shu yerga kiriting yoki joylang..."
                        rows={12}
                        className="resize-none bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none rounded-xl p-4 font-mono text-xs md:text-sm font-medium"
                      />
                    </TabsContent>
                    
                    <TabsContent value="file" className="mt-0">
                      <div className="border-2 border-dashed border-border/80 rounded-xl p-12 text-center hover:border-primary/50 transition-colors bg-secondary/20 flex flex-col items-center justify-center h-[312px] relative overflow-hidden group">
                        <Upload className="h-10 w-10 text-primary mb-4 animate-bounce-gentle" />
                        <p className="text-sm font-bold text-foreground mb-1.5">.docx, .pdf yoki .txt faylni tanlang</p>
                        <p className="text-xs text-muted-foreground mb-6 font-medium">Maksimal hajm: 10 MB</p>
                        <Input
                          type="file"
                          accept=".docx,.doc,.pdf,.txt"
                          onChange={e => setFile(e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto text-xs font-bold"
                        />
                        {file && (
                          <p className="mt-4 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">{file.name}</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {isChecking && (
                    <div className="space-y-3.5 pt-4 border-t border-border/50">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <span>Tahlil qilinmoqda...</span>
                        <span className="text-primary font-black">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2 rounded-full" />
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      onClick={handleCheck}
                      disabled={isChecking || (!text && !file)}
                      className="w-full rounded-full h-12 text-xs md:text-sm font-bold glow-button-primary bg-primary text-primary-foreground uppercase tracking-wider"
                      size="lg"
                    >
                      {isChecking ? (
                        <><Loader2 className="h-4.5 w-4.5 animate-spin mr-2" /> Tahlil qilinmoqda...</>
                      ) : (
                        <><Cpu className="h-4.5 w-4.5 mr-2" /> Tahlilni boshlash</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Results Panel */}
            <ScrollReveal direction="right">
              {result ? (
                <div className="space-y-6 animate-page-enter text-left">
                  
                  {/* Circular Score Gauge Card */}
                  <Card className={`glass-card border ${getScoreBgColorClass(result.overallScore)} p-1`}>
                    <CardContent className="p-8 flex flex-col md:flex-row items-center justify-center gap-8">
                      
                      {/* SVG Gauge */}
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="circular-progress-svg w-32 h-32">
                          <circle className="circular-progress-bg" cx="64" cy="64" r="56" strokeWidth="8" />
                          <circle 
                            className={`circular-progress-bar ${getScoreColorClass(result.overallScore)}`} 
                            cx="64" 
                            cy="64" 
                            r="56" 
                            strokeWidth="8" 
                            strokeDasharray="351.8" 
                            strokeDashoffset={351.8 - (351.8 * result.overallScore) / 100}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-serif font-black">{result.overallScore}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">/ 100</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-center md:text-left">
                        <h4 className="font-serif font-black text-lg text-foreground">Maqola reytingi</h4>
                        <p className={`text-xs md:text-sm font-bold leading-relaxed ${getScoreColorClass(result.overallScore)}`}>
                          {getScoreLabel(result.overallScore)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary */}
                  <Card className="glass-card border border-border/80 bg-card">
                    <CardContent className="p-6">
                      <h3 className="font-serif font-black text-base mb-3 border-l-2 border-primary pl-3">Xulosa</h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">{result.summary}</p>
                    </CardContent>
                  </Card>

                  {/* Requirement checks checklist */}
                  {result.requirementChecks.length > 0 && (
                    <Card className="glass-card border border-border/80 bg-card">
                      <CardContent className="p-6">
                        <h3 className="font-serif font-black text-base mb-4 border-l-2 border-accent pl-3">Talablar Tekshiruvi</h3>
                        <div className="space-y-3">
                          {result.requirementChecks.map((check, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/60">
                              {check.passed ? (
                                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                              )}
                              <div>
                                <p className="text-xs md:text-sm font-bold text-foreground">{check.name}</p>
                                <p className={`text-xs font-medium mt-1 leading-relaxed ${check.passed ? 'text-muted-foreground' : 'text-destructive/85'}`}>
                                  {check.details}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Spelling / Recommendations list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.spellingErrors.length > 0 && (
                      <Card className="glass-card border border-border/80 bg-card">
                        <CardContent className="p-5 text-left">
                          <div className="flex items-center gap-2 mb-4 border-b border-border/60 pb-2">
                            <XCircle className="h-4.5 w-4.5 text-destructive" />
                            <h3 className="font-bold text-xs uppercase tracking-widest text-foreground">Imlo xatolari</h3>
                          </div>
                          <ul className="space-y-3.5 text-xs md:text-sm font-medium">
                            {result.spellingErrors.slice(0, 3).map((err, i) => (
                              <li key={i} className="flex gap-2 items-center">
                                <span className="text-destructive font-bold line-through bg-destructive/10 px-2 py-0.5 rounded">{err.word}</span>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{err.suggestion}</span>
                              </li>
                            ))}
                            {result.spellingErrors.length > 3 && (
                              <li className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 pt-2 border-t border-border">
                                + yana {result.spellingErrors.length - 3} ta xato
                              </li>
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {result.suggestions.length > 0 && (
                      <Card className="glass-card border border-border/80 bg-card">
                        <CardContent className="p-5 text-left">
                          <div className="flex items-center gap-2 mb-4 border-b border-border/60 pb-2">
                            <Lightbulb className="h-4.5 w-4.5 text-accent" />
                            <h3 className="font-bold text-xs uppercase tracking-widest text-foreground">Tavsiyalar</h3>
                          </div>
                          <ul className="space-y-3 text-xs font-semibold leading-relaxed text-muted-foreground">
                            {result.suggestions.slice(0, 3).map((sugg, i) => (
                              <li key={i} className="flex gap-2">
                                <span>•</span>
                                <span>{sugg}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[500px] border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-secondary/10">
                  <Cpu className="h-14 w-14 text-primary/30 mb-4 animate-pulse" />
                  <h3 className="font-serif font-black text-xl mb-2 text-muted-foreground/80">Tahlil Kutish Rejimi</h3>
                  <p className="text-xs md:text-sm text-muted-foreground/60 max-w-sm font-medium leading-relaxed">
                    Tahlilni boshlash uchun chap tarafdan maqola matnini yozing yoki uning hujjat faylini yuklang
                  </p>
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default ArticleChecker;
