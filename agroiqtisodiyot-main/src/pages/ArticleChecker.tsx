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
  AlertTriangle,
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

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-primary';
    if (score >= 60) return 'text-amber-500';
    return 'text-destructive';
  };

  const getScoreBgColor = (score: number) => {
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
              <Cpu className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6 text-foreground tracking-tight">
              AI Maqola Tekshirish
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
              Maqolangizni imlo xatolari, grammatika va jurnal talablariga mosligi bo'yicha sun'iy intellekt yordamida tekshiring
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="py-16 md:py-24 section-alt flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
            
            {/* Input Panel */}
            <ScrollReveal direction="left">
              <Card className="iscad-card border-border shadow-sm h-full bg-background">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    Maqolani yuklang
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-6">
                  <Tabs defaultValue="text" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-lg bg-slate-100 dark:bg-slate-900 mb-6 p-1">
                      <TabsTrigger value="text" className="rounded-md">Matn</TabsTrigger>
                      <TabsTrigger value="file" className="rounded-md">Fayl</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text" className="mt-0">
                      <Textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Maqola matnini shu yerga kiriting yoki joylang..."
                        rows={12}
                        className="resize-none bg-slate-50 dark:bg-slate-900 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none rounded-lg p-4 font-mono text-sm"
                      />
                    </TabsContent>
                    
                    <TabsContent value="file" className="mt-0">
                      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center h-[312px]">
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm font-medium mb-1">.docx, .pdf yoki .txt faylni tanlang</p>
                        <p className="text-xs text-muted-foreground mb-6">Maksimal hajm: 10 MB</p>
                        <Input
                          type="file"
                          accept=".docx,.doc,.pdf,.txt"
                          onChange={e => setFile(e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {file && (
                          <p className="mt-4 text-sm text-primary font-medium">{file.name}</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {isChecking && (
                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>Tahlil qilinmoqda...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5 rounded-full" />
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      onClick={handleCheck}
                      disabled={isChecking || (!text && !file)}
                      className="w-full rounded-lg h-12 text-base font-medium"
                      size="lg"
                    >
                      {isChecking ? (
                        <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Jarayonda...</>
                      ) : (
                        <><Cpu className="h-5 w-5 mr-2" /> Tahlil qilish</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Results Panel */}
            <ScrollReveal direction="right">
              {result ? (
                <div className="space-y-6 animate-page-enter">
                  {/* Score */}
                  <Card className={`iscad-card ${getScoreBgColor(result.overallScore)}`}>
                    <CardContent className="p-8 text-center">
                      <div className="text-5xl font-serif font-black mb-2">
                        <span className={getScoreColor(result.overallScore)}>{result.overallScore}</span>
                        <span className="text-2xl text-muted-foreground font-sans font-medium">/100</span>
                      </div>
                      <p className={`text-sm font-medium ${getScoreColor(result.overallScore)}`}>
                        {getScoreLabel(result.overallScore)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Summary */}
                  <Card className="iscad-card bg-background">
                    <CardContent className="p-6">
                      <h3 className="font-serif font-bold mb-3">Xulosa</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
                    </CardContent>
                  </Card>

                  {/* Requirements */}
                  {result.requirementChecks.length > 0 && (
                    <Card className="iscad-card bg-background">
                      <CardContent className="p-6">
                        <h3 className="font-serif font-bold mb-4">Talablar Tekshiruvi</h3>
                        <div className="space-y-3">
                          {result.requirementChecks.map((check, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border">
                              {check.passed ? (
                                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-foreground">{check.name}</p>
                                <p className={`text-xs mt-1 ${check.passed ? 'text-muted-foreground' : 'text-destructive/80'}`}>
                                  {check.details}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Spelling/Grammar/Suggestions Minimalized */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.spellingErrors.length > 0 && (
                      <Card className="iscad-card bg-background">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <XCircle className="h-4 w-4 text-destructive" />
                            <h3 className="font-bold text-sm">Imlo xatolari</h3>
                          </div>
                          <ul className="space-y-2 text-sm">
                            {result.spellingErrors.slice(0, 3).map((err, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-destructive line-through decoration-destructive/30">{err.word}</span>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-primary font-medium">{err.suggestion}</span>
                              </li>
                            ))}
                            {result.spellingErrors.length > 3 && (
                              <li className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                                + yana {result.spellingErrors.length - 3} ta xato
                              </li>
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {result.suggestions.length > 0 && (
                      <Card className="iscad-card bg-background">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            <h3 className="font-bold text-sm">Tavsiyalar</h3>
                          </div>
                          <ul className="space-y-3">
                            {result.suggestions.slice(0, 2).map((sugg, i) => (
                              <li key={i} className="text-xs text-muted-foreground leading-relaxed">
                                • {sugg}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[500px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-900/20">
                  <Cpu className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="font-serif font-bold text-lg mb-2 text-muted-foreground/70">Kutish Rejimi</h3>
                  <p className="text-sm text-muted-foreground/50 max-w-sm">
                    Tahlilni boshlash uchun maqolangizni yuklang yoki matn maydoniga kiriting
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
