import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import iscadLogo from '@/assets/iscad-logo.png';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { Menu, LogOut, User, Phone, Mail, Sparkles, X, ChevronRight } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/about', label: 'Markaz haqida' },
  { to: '/editorial-board', label: "Tahrir hay'ati" },
  { to: '/journals', label: 'Jurnallar' },
  { to: '/requirements', label: 'Jurnal talablari' },
  { to: '/article-checker', label: 'AI Tekshirish', badge: true },
  { to: '/contact', label: 'Aloqa' },
];

export function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Main Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4 pointer-events-none">
        <nav className={`mx-auto max-w-7xl w-full pointer-events-auto rounded-full transition-all duration-500 ${
          scrolled
            ? 'bg-background/80 dark:bg-card/75 backdrop-blur-xl shadow-glass border border-border/80 px-6 py-2.5'
            : 'bg-background/40 dark:bg-background/20 backdrop-blur-md border border-transparent px-6 py-3'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src={iscadLogo}
                alt="ISCAD Logo"
                className="h-9 md:h-11 w-auto logo-adaptive transition-all duration-500 group-hover:scale-102"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1.5 bg-secondary/40 dark:bg-secondary/20 p-1.5 rounded-full border border-border/20">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 rounded-full ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50 dark:hover:bg-background/20'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {link.label}
                      {link.badge && (
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[8px] font-black rounded-full leading-none animate-pulse ${
                          isActive 
                            ? 'bg-accent text-accent-foreground' 
                            : 'bg-primary text-primary-foreground'
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

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="rounded-full text-xs font-bold border-primary/20 hover:border-primary/50">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-secondary/80 dark:bg-secondary/40 border border-border/40 text-xs font-bold text-foreground/95">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span className="max-w-[90px] truncate">
                      {profile?.full_name || 'Muallif'}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={signOut} className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button size="sm" className="rounded-full px-6 font-bold glow-button-primary bg-primary hover:bg-primary/95 text-primary-foreground">
                    Kirish
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Actions Container */}
            <div className="lg:hidden flex items-center gap-3">
              <ThemeToggle />
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-border/80 bg-background/50">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[310px] p-0 border-l border-border/80 bg-background/95 backdrop-blur-xl">
                  <div className="flex flex-col h-full">
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-border/50 flex items-center justify-between">
                      <img src={iscadLogo} alt="ISCAD" className="h-9 logo-adaptive" />
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                      {navLinks.map(link => {
                        const isActive = location.pathname === link.to;
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${
                              isActive
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {link.label}
                              {link.badge && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[8px] font-black bg-accent text-accent-foreground rounded-full">
                                  <Sparkles className="h-2 w-2" />
                                  AI
                                </span>
                              )}
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Drawer Footer */}
                    <div className="p-6 border-t border-border/50 space-y-4">
                      {user ? (
                        <>
                          {isAdmin && (
                            <Link to="/admin" onClick={() => setOpen(false)} className="block w-full">
                              <Button variant="outline" className="w-full rounded-2xl font-bold border-primary/30 text-primary">
                                Admin Panel
                              </Button>
                            </Link>
                          )}
                          <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-2xl border border-border/20">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-bold truncate">
                              {profile?.full_name || 'Tadqiqotchi'}
                            </span>
                          </div>
                          <Button
                            variant="destructive"
                            onClick={() => { signOut(); setOpen(false); }}
                            className="w-full rounded-2xl font-bold"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Chiqish
                          </Button>
                        </>
                      ) : (
                        <Link to="/auth" onClick={() => setOpen(false)} className="block w-full">
                          <Button className="w-full rounded-2xl font-bold glow-button-primary bg-primary text-primary-foreground">Kirish</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </div>
      {/* Spacer to push page contents down */}
      <div className="h-16 lg:h-20" />
    </>
  );
}