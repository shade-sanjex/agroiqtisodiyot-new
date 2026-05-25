import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { Sparkles, BookOpen, Shield, Loader2 } from 'lucide-react';
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
    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative gradient-hero items-center justify-center overflow-hidden">
        <ParticleBackground className="absolute inset-0" particleCount={40} />

        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-2xl rotate-45 animate-spin-slow" />
        <div className="absolute bottom-32 left-16 w-24 h-24 border border-white/10 rounded-full animate-float" />
        <div className="absolute top-1/3 left-10 w-16 h-16 border border-white/5 rounded-xl rotate-12 animate-float-delayed" />

        <div className="relative z-10 text-center text-white px-12 max-w-lg">
          <img
            src={iscadLogo}
            alt="ISCAD"
            className="h-24 w-auto mx-auto mb-8 drop-shadow-2xl"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <h2 className="text-2xl font-serif font-bold mb-4">
            ISCAD Platformasiga Xush Kelibsiz
          </h2>
          <p className="text-white/60 text-sm mb-8 font-sans">
            Oziq-ovqat va Qishloq Xo'jaligi Sohasida Strategik Rivojlanish va Tadqiqotlar Xalqaro Markazi
          </p>

          <div className="space-y-4 text-left">
            {[
              { icon: Sparkles, text: "AI maqola tekshirish" },
              { icon: BookOpen, text: "Ilmiy jurnallarni yuklab olish" },
              { icon: Shield, text: "Xavfsiz va ishonchli tizim" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm">
                <item.icon className="h-5 w-5 text-emerald-300 flex-shrink-0" />
                <span className="text-white/80 text-sm font-sans">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={iscadLogo} alt="ISCAD" className="h-16 w-auto mx-auto mb-3 logo-adaptive" />
            <p className="text-sm text-muted-foreground">Tizimga kirish yoki ro'yxatdan o'tish</p>
          </div>

          <Card className="border-0 shadow-glass-lg">
            <CardContent className="p-6 md:p-8">
              {showReset ? (
                /* Password Reset Form */
                <div className="animate-fade-in">
                  <h3 className="text-xl font-serif font-bold mb-2">Parolni tiklash</h3>
                  <p className="text-sm text-muted-foreground mb-6">Email manzilingizga parol tiklash havolasi yuboriladi</p>
                  <form onSubmit={handleReset} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email manzilingiz"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="rounded-xl h-11"
                    />
                    <Button type="submit" className="w-full rounded-xl h-11" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Yuborish
                    </Button>
                    <Button type="button" variant="ghost" className="w-full" onClick={() => setShowReset(false)}>
                      Orqaga qaytish
                    </Button>
                  </form>
                </div>
              ) : (
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl h-11">
                    <TabsTrigger value="login" className="rounded-lg">Kirish</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-lg">Ro'yxatdan o'tish</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Email</label>
                        <Input
                          type="email"
                          required
                          value={loginData.email}
                          onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="rounded-xl h-11"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Parol</label>
                          <button
                            type="button"
                            onClick={() => setShowReset(true)}
                            className="text-xs text-primary hover:underline"
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
                          className="rounded-xl h-11"
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-xl h-11 shadow-lg shadow-primary/20" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Kirish
                      </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-3 text-muted-foreground">yoki</span>
                      </div>
                    </div>

                    {/* Google */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogle}
                      className="w-full rounded-xl h-11"
                      disabled={loading}
                    >
                      <GoogleIcon />
                      Google orqali kirish
                    </Button>
                  </TabsContent>

                  {/* Signup Tab */}
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">To'liq ism</label>
                        <Input
                          type="text"
                          required
                          value={signupData.fullName}
                          onChange={e => setSignupData({ ...signupData, fullName: e.target.value })}
                          placeholder="Ismingiz"
                          maxLength={100}
                          className="rounded-xl h-11"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Email</label>
                        <Input
                          type="email"
                          required
                          value={signupData.email}
                          onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="rounded-xl h-11"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Parol</label>
                        <Input
                          type="password"
                          required
                          value={signupData.password}
                          onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                          placeholder="Kamida 6 ta belgi"
                          minLength={6}
                          className="rounded-xl h-11"
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-xl h-11 shadow-lg shadow-primary/20" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Ro'yxatdan o'tish
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Email manzilingizga tasdiqlash xabari yuboriladi
                      </p>
                    </form>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-3 text-muted-foreground">yoki</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogle}
                      className="w-full rounded-xl h-11"
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