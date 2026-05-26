import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { Sparkles, BookOpen, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';
import iscadLogo from '@/assets/iscad-logo.png';

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Noto'g'ri email manzil" }),
  password: z.string().min(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" }),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, { message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak" }).max(100),
});

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, resetPassword, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', fullName: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = loginSchema.parse(loginData);
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast.error(error.message.includes('Invalid') ? 'Email yoki parol noto\'g\'ri' : error.message);
        return;
      }
      toast.success('Xush kelibsiz!');
      navigate('/');
    } catch (err) {
      if (err instanceof z.ZodError) err.errors.forEach(e => toast.error(e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = signupSchema.parse(signupData);
      const { error } = await signUp(data.email, data.password, data.fullName);
      if (error) {
        toast.error(error.message.includes('already') ? 'Bu email allaqachon ro\'yxatdan o\'tgan' : error.message);
        return;
      }
      toast.success('Ro\'yxatdan o\'tdingiz!', { description: 'Email manzilingizga tasdiqlash xabari yuborildi.' });
      setSignupData({ email: '', password: '', fullName: '' });
    } catch (err) {
      if (err instanceof z.ZodError) err.errors.forEach(e => toast.error(e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) toast.error('Google orqali kirishda xatolik');
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) { toast.error('Email kiriting'); return; }
    setLoading(true);
    const { error } = await resetPassword(resetEmail);
    if (error) toast.error(error.message);
    else {
      toast.success('Parolni tiklash havolasi yuborildi');
      setShowReset(false);
    }
    setLoading(false);
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 mr-2" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-x-hidden">
      
      {/* Decorative floating Home button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-border/80 bg-background/80 hover:bg-secondary/40 text-xs font-bold uppercase tracking-wider backdrop-blur-md"
      >
        <ArrowLeft className="h-4 w-4" /> Bosh sahifa
      </button>

      {/* Left decorative panel — hidden on mobile */}
      <div className={`hidden lg:flex lg:w-1/2 relative bg-gradient-forest text-left items-center justify-center overflow-hidden border-r border-border/10 auth-transition z-10 ${
        activeTab === 'signup' ? 'lg:blur-md lg:opacity-30 lg:scale-[0.98] pointer-events-none' : 'lg:blur-none lg:opacity-100 lg:scale-100'
      }`}>
        <ParticleBackground className="absolute inset-0 z-0" particleCount={30} />
        
        {/* Abstract glowing layers */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/5 rounded-3xl rotate-45 animate-spin-slow" />
        <div className="absolute bottom-32 left-16 w-24 h-24 border border-white/5 rounded-full animate-float" />

        <div className="relative z-10 text-slate-100 px-16 max-w-xl space-y-8">
          <img
            src={iscadLogo}
            alt="ISCAD"
            className="h-16 w-auto drop-shadow-2xl filter brightness-0 invert"
          />
          
          <div className="space-y-3">
            <h2 className="text-3xl font-serif font-black leading-tight text-white">
              ISCAD Platformasi
            </h2>
            <p className="text-white/50 text-xs md:text-sm font-medium leading-relaxed">
              Oziq-ovqat va Qishloq Xo'jaligi Sohasida Strategik Rivojlanish va Tadqiqotlar Xalqaro Markazi
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {[
              { icon: Sparkles, text: "AI yordamida maqolalarni tahririy tekshirish" },
              { icon: BookOpen, text: "Ilmiy jurnallarning elektron arxivini o'qish" },
              { icon: Shield, text: "Xavfsiz va ishonchli foydalanuvchi kabineti" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary-foreground border border-primary/20 flex-shrink-0">
                  <item.icon className="h-4.5 w-4.5 text-accent" />
                </div>
                <span className="text-white/80 text-xs md:text-sm font-bold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className={`flex-1 lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative auth-transition z-20 ${
        activeTab === 'signup' ? 'lg:-translate-x-1/2' : 'lg:translate-x-0'
      }`}>
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />
        <div className="mesh-gradient-glow top-0 right-0 opacity-40" />
        
        <div className="w-full max-w-md z-10">
          
          {/* Mobile brand header */}
          <div className="lg:hidden text-center mb-8">
            <img src={iscadLogo} alt="ISCAD" className="h-14 w-auto mx-auto mb-3 logo-adaptive" />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tizimga kirish</p>
          </div>

          <Card className="glass-card border border-border/80 shadow-glass-lg p-1 bg-card/90">
            <CardContent className="p-6 md:p-8 text-left">
              {showReset ? (
                /* Password Reset Form */
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-serif font-black mb-1.5">Parolni tiklash</h3>
                    <p className="text-xs text-muted-foreground font-medium">Email manzilingizga parolni tiklash uchun havola yuboramiz</p>
                  </div>
                  <form onSubmit={handleReset} className="space-y-4">
                    <Input
                      type="email"
                      required
                      placeholder="Email manzilingiz"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="rounded-xl h-11 bg-secondary/35 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none text-xs md:text-sm font-semibold"
                    />
                    <Button type="submit" className="w-full rounded-full h-11 font-bold glow-button-primary bg-primary text-primary-foreground uppercase tracking-wider text-xs" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Yuborish
                    </Button>
                    <Button type="button" variant="ghost" className="w-full rounded-full font-bold text-xs uppercase tracking-wider h-11" onClick={() => setShowReset(false)}>
                      Orqaga qaytish
                    </Button>
                  </form>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'login' | 'signup')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 rounded-full bg-secondary p-1 h-12">
                    <TabsTrigger value="login" className="rounded-full text-xs font-bold uppercase tracking-wider">Kirish</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-full text-xs font-bold uppercase tracking-wider">Ro'yxatdan o'tish</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login" className="space-y-5">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</label>
                        <Input
                          type="email"
                          required
                          value={loginData.email}
                          onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="rounded-xl h-11 bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none text-xs md:text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Parol</label>
                          <button
                            type="button"
                            onClick={() => setShowReset(true)}
                            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wide"
                          >
                            Parolni unutdingizmi?
                          </button>
                        </div>
                        <Input
                          type="password"
                          required
                          value={loginData.password}
                          onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="••••••"
                          className="rounded-xl h-11 bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none text-xs md:text-sm font-semibold"
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-full h-11 font-bold glow-button-primary bg-primary text-primary-foreground uppercase tracking-wider text-xs mt-2" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Kirish
                      </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                        <span className="bg-card px-3 text-muted-foreground">yoki</span>
                      </div>
                    </div>

                    {/* Google Sign In */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogle}
                      className="w-full rounded-full h-11 border-border bg-background hover:bg-secondary/40 font-bold text-xs uppercase tracking-wider"
                      disabled={loading}
                    >
                      <GoogleIcon />
                      Google orqali kirish
                    </Button>
                  </TabsContent>

                  {/* Signup Tab */}
                  <TabsContent value="signup" className="space-y-5">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">To'liq ism</label>
                        <Input
                          type="text"
                          required
                          value={signupData.fullName}
                          onChange={e => setSignupData({ ...signupData, fullName: e.target.value })}
                          placeholder="Ismingiz"
                          maxLength={100}
                          className="rounded-xl h-11 bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none text-xs md:text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</label>
                        <Input
                          type="email"
                          required
                          value={signupData.email}
                          onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="rounded-xl h-11 bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none text-xs md:text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Parol</label>
                        <Input
                          type="password"
                          required
                          value={signupData.password}
                          onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                          placeholder="Kamida 6 ta belgi"
                          minLength={6}
                          className="rounded-xl h-11 bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none text-xs md:text-sm font-semibold"
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-full h-11 font-bold glow-button-primary bg-primary text-primary-foreground uppercase tracking-wider text-xs mt-2" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Ro'yxatdan o'tish
                      </Button>
                      <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-wider">
                        Email manzilingizga tasdiqlash xabari yuboriladi
                      </p>
                    </form>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                        <span className="bg-card px-3 text-muted-foreground">yoki</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogle}
                      className="w-full rounded-full h-11 border-border bg-background hover:bg-secondary/40 font-bold text-xs uppercase tracking-wider"
                      disabled={loading}
                    >
                      <GoogleIcon />
                      Google orqali ro'yxatdan o'tish
                    </Button>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;