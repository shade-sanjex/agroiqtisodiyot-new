import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import iscadLogo from '@/assets/iscad-logo.png';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, LogOut, User, Sparkles, ChevronRight, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/about', label: 'Markaz' },
  { to: '/editorial-board', label: "Tahririyat" },
  { to: '/journals', label: 'Jurnallar' },
  { to: '/requirements', label: 'Talablar' },
  { to: '/article-checker', label: 'AI Tahlil', badge: true },
  { to: '/contact', label: 'Aloqa' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 24);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-3 md:px-6 pt-3 md:pt-4 pointer-events-none">
        <nav
          ref={navRef}
          className={`mx-auto max-w-7xl w-full pointer-events-auto rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled ? 'navbar-glass px-4 md:px-5 py-2.5' : 'px-4 md:px-5 py-3 bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo + wordmark */}
            <Link to="/" className={`flex items-center gap-2.5 group shrink-0 rounded-xl ${focusRing}`}>
              <img
                src={iscadLogo}
                alt="ISCAD Logo"
                className="logo-adaptive h-8 md:h-9 w-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-serif font-black text-base text-foreground tracking-tight">ISCAD</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary mt-0.5">Agroiqtisodiyot</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5 rounded-full border border-border/50 bg-secondary/30 dark:bg-secondary/15 backdrop-blur-md p-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-3.5 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all duration-300 ${focusRing} ${
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-primary shadow-glow-green" aria-hidden="true" />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      {link.label}
                      {link.badge && (
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-black rounded-full leading-none ${
                          isActive ? 'bg-accent/90 text-accent-foreground' : 'bg-accent/15 text-accent'
                        }`}>
                          <Sparkles className="h-2 w-2" />
                          AI
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <div className="hidden lg:flex items-center gap-2">
                {user ? (
                  <div className="flex items-center gap-1.5">
                    {isAdmin && (
                      <Link to="/admin">
                        <Button variant="outline" size="sm" className="rounded-full text-xs font-bold border-primary/30 hover:border-primary/50 h-8 px-3.5">
                          Admin
                        </Button>
                      </Link>
                    )}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-secondary/80 dark:bg-secondary/40 border border-border/40 text-xs font-bold text-foreground/90">
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <span className="max-w-[80px] truncate">{profile?.full_name || 'Muallif'}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={signOut} className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                      <LogOut className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button size="sm" className="rounded-full px-5 h-9 text-xs font-bold glow-button-primary bg-primary hover:bg-primary/95 text-primary-foreground group">
                      Kirish
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile trigger */}
              <div className="lg:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-border/60 bg-background/50">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] p-0 border-l border-border/60 bg-background/95 backdrop-blur-2xl">
                    <div className="flex flex-col h-full">
                      <div className="p-6 border-b border-border/40 flex items-center gap-3">
                        <img src={iscadLogo} alt="ISCAD" className="h-9 logo-adaptive" />
                        <div className="flex flex-col leading-none">
                          <span className="font-serif font-black text-foreground">ISCAD</span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary mt-0.5">Agroiqtisodiyot</span>
                        </div>
                      </div>

                      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                        {navLinks.map((link) => {
                          const isActive = location.pathname === link.to;
                          return (
                            <Link
                              key={link.to}
                              to={link.to}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${focusRing} ${
                                isActive
                                  ? 'bg-primary/10 text-primary border border-primary/20'
                                  : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {link.label}
                                {link.badge && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-black bg-accent/20 text-accent rounded-full">
                                    <Sparkles className="h-2 w-2" />
                                    AI
                                  </span>
                                )}
                              </span>
                              <ChevronRight className="h-4 w-4 opacity-40" />
                            </Link>
                          );
                        })}
                      </nav>

                      <div className="p-6 border-t border-border/40 space-y-3">
                        {user ? (
                          <>
                            {isAdmin && (
                              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block w-full">
                                <Button variant="outline" className="w-full rounded-xl font-bold border-primary/30 text-primary">
                                  Admin Panel
                                </Button>
                              </Link>
                            )}
                            <div className="flex items-center gap-3 px-4 py-2.5 bg-secondary/50 rounded-xl border border-border/40">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm font-bold truncate">{profile?.full_name || 'Tadqiqotchi'}</span>
                            </div>
                            <Button variant="destructive" onClick={() => { signOut(); setMobileOpen(false); }} className="w-full rounded-xl font-bold">
                              <LogOut className="h-4 w-4 mr-2" />
                              Chiqish
                            </Button>
                          </>
                        ) : (
                          <Link to="/auth" onClick={() => setMobileOpen(false)} className="block w-full">
                            <Button className="w-full rounded-xl font-bold glow-button-primary bg-primary text-primary-foreground">Kirish</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer */}
      <div className="h-[var(--nav-height-mobile)] lg:h-[var(--nav-height-desktop)]" />
    </>
  );
}
