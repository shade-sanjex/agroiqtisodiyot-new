import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BackToTop } from '@/components/BackToTop';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sparkles, Upload, FileText, CheckCircle, XCircle, AlertTriangle, Lightbulb, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { checkArticle, extractTextFromFile, ArticleCheckResult, getScoreColor, getScoreLabel, getScoreBgColor } from '@/lib/ai-checker';

function ArticleCheckerContent() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<ArticleCheckResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleCheck = async () => {
    let articleText = text;

    if (!articleText.trim() && !file) {
      toast.error('Matn kiriting yoki fayl yuklang');
      return;
    }

    setIsChecking(true);
    setProgress(10);
    setResult(null);

    try {
      if (file && !articleText.trim()) {
        setProgress(20);
        articleText = await extractTextFromFile(file);
        setProgress(40);
      }

      if (!articleText.trim()) {
        toast.error('Fayldan matn ajratib bo\'linmadi');
        return;
      }

      setProgress(50);
      const res = await checkArticle(articleText);
      setProgress(100);
      setResult(res);
      toast.success('Tekshirish yakunlandi!');
    } catch (err: any) {
      toast.error(err.message || 'Xatolik yuz berdi');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-10 right-20 w-32 h-32 border border-white/5 rounded-full animate-spin-slow" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-4 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-amber-300" />
            Sun'iy Intellekt
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
            AI Maqola Tekshirish
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Maqolangizni imlo xatolari, grammatika va jurnal talablariga mosligi bo'yicha AI yordamida tekshiring
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Input panel */}
            <ScrollReveal direction="left">
              <Card className="shadow-glass border-0 h-full">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Maqolangizni yuklang
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="text">
                    <TabsList className="grid w-full grid-cols-2 rounded-xl">
                      <TabsTrigger value="text" className="rounded-lg">Matn kiritish</TabsTrigger>
                      <TabsTrigger value="file" className="rounded-lg">Fayl yuklash</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="mt-4">
                      <Textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Maqola matnini shu yerga kiriting yoki qo'ying..."
                        rows={14}
                        className="rounded-xl resize-none"
                      />
                    </TabsContent>
                    <TabsContent value="file" className="mt-4">
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-3">
                          .txt yoki .pdf faylni tanlang
                        </p>
                        <Input
                          type="file"
                          accept=".txt,.pdf"
                          onChange={e => setFile(e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        {file && (
                          <p className="mt-3 text-sm text-primary font-medium">{file.name}</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {isChecking && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2 rounded-full" />
                      <p className="text-xs text-muted-foreground text-center">Tekshirilmoqda... {progress}%</p>
                    </div>
                  )}

                  <Button
                    onClick={handleCheck}
                    disabled={isChecking}
                    className="w-full rounded-xl h-12 shadow-lg shadow-primary/20 text-base"
                    size="lg"
                  >
                    {isChecking ? (
                      <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Tekshirilmoqda...</>
                    ) : (
                      <><Sparkles className="h-5 w-5 mr-2" /> Tekshirishni boshlash</>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Tekshirish 10-30 soniya davom etishi mumkin
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Results panel */}
            <ScrollReveal direction="right">
              {result ? (
                <div className="space-y-6 animate-fade-in-up">
                  {/* Score */}
                  <Card className={`shadow-glass border-2 ${getScoreBgColor(result.overallScore)}`}>
                    <CardContent className="p-6 text-center">
                      <div className="text-5xl font-bold mb-1">
                        <span className={getScoreColor(result.overallScore)}>{result.overallScore}</span>
                        <span className="text-2xl text-muted-foreground">/100</span>
                      </div>
                      <p className={`text-lg font-semibold ${getScoreColor(result.overallScore)}`}>
                        {getScoreLabel(result.overallScore)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Summary */}
                  <Card className="shadow-glass border-0">
                    <CardContent className="p-5">
                      <h3 className="font-serif font-bold mb-2">Xulosa</h3>
                      <p className="text-sm text-muted-foreground">{result.summary}</p>
                    </CardContent>
                  </Card>

                  {/* Requirements */}
                  {result.requirementChecks.length > 0 && (
                    <Card className="shadow-glass border-0">
                      <CardContent className="p-5">
                        <h3 className="font-serif font-bold mb-3">Talablar tekshiruvi</h3>
                        <div className="space-y-2">
                          {result.requirementChecks.map((check, i) => (
                            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                              {check.passed ? (
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                              )}
                              <div>
                                <p className="text-sm font-medium">{check.name}</p>
                                <p className="text-xs text-muted-foreground">{check.details}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Spelling errors */}
                  {result.spellingErrors.length > 0 && (
                    <Card className="shadow-glass border-0">
                      <CardContent className="p-5">
                        <h3 className="font-serif font-bold mb-3">
                          Imlo xatolari ({result.spellingErrors.length})
                        </h3>
                        <Accordion type="single" collapsible>
                          {result.spellingErrors.slice(0, 20).map((err, i) => (
                            <AccordionItem key={i} value={`err-${i}`}>
                              <AccordionTrigger className="text-sm py-2">
                                <span>
                                  <span className="line-through text-red-500">{err.word}</span>
                                  {' → '}
                                  <span className="text-green-500 font-medium">{err.suggestion}</span>
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-xs text-muted-foreground italic">"{err.context}"</p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  )}

                  {/* Grammar issues */}
                  {result.grammarIssues.length > 0 && (
                    <Card className="shadow-glass border-0">
                      <CardContent className="p-5">
                        <h3 className="font-serif font-bold mb-3">Grammatik muammolar</h3>
                        <ul className="space-y-2">
                          {result.grammarIssues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Suggestions */}
                  {result.suggestions.length > 0 && (
                    <Card className="shadow-glass border-0">
                      <CardContent className="p-5">
                        <h3 className="font-serif font-bold mb-3">Tavsiyalar</h3>
                        <ul className="space-y-2">
                          {result.suggestions.map((sug, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="shadow-glass border-0 h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center p-12">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-serif font-bold text-xl mb-2">Natijalar shu yerda ko'rinadi</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Maqola matnini kiriting va "Tekshirishni boshlash" tugmasini bosing
                    </p>
                  </CardContent>
                </Card>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default function ArticleChecker() {
  return (
    <ProtectedRoute>
      <ArticleCheckerContent />
    </ProtectedRoute>
  );
}
