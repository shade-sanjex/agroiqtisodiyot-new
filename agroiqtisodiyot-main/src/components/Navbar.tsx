import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import iscadLogo from '@/assets/iscad-logo.png';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { Menu, LogOut, User, Phone, Mail, Sparkles, X } from 'lucide-react';

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
      {/* Top Bar */}
      <div className="hidden lg:block bg-slate-900 dark:bg-black/40 text-white/80 text-xs py-1.5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+998903586164" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="h-3 w-3" />
              +998 90 358 61 64
            </a>
            <a href="mailto:ooqxssrtxm@agro.uz" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="h-3 w-3" />
              ooqxssrtxm@agro.uz
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] dark:shadow-black/20 border-b border-border/50'
          : 'bg-background/50 backdrop-blur-sm border-b border-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src={iscadLogo}
                alt="ISCAD Logo"
                className="h-10 md:h-12 w-auto logo-adaptive transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-muted ${
                    location.pathname === link.to
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-gold text-white rounded-full leading-none">
                        <Sparkles className="h-2.5 w-2.5" />
                        AI
                      </span>
                    )}
                  </span>
                  {/* Active indicator */}
                  {location.pathname === link.to && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="rounded-full text-xs">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-medium max-w-[100px] truncate">
                      {profile?.full_name || 'Foydalanuvchi'}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={signOut} className="rounded-full h-8 w-8">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20">
                    Kirish
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-border">
                      <img src={iscadLogo} alt="ISCAD" className="h-10 logo-adaptive" />
                    </div>

                    {/* Nav links */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                      {navLinks.map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                            location.pathname === link.to
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {link.label}
                          {link.badge && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-gold text-white rounded-full">
                              <Sparkles className="h-2.5 w-2.5" />
                              AI
                            </span>
                          )}
                        </Link>
                      ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-border space-y-3">
                      {user ? (
                        <>
                          {isAdmin && (
                            <Link to="/admin" onClick={() => setOpen(false)}>
                              <Button variant="outline" className="w-full rounded-xl">
                                Admin Panel
                              </Button>
                            </Link>
                          )}
                          <div className="flex items-center gap-3 px-4 py-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium truncate">
                              {profile?.full_name || 'Foydalanuvchi'}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => { signOut(); setOpen(false); }}
                            className="w-full rounded-xl"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Chiqish
                          </Button>
                        </>
                      ) : (
                        <Link to="/auth" onClick={() => setOpen(false)}>
                          <Button className="w-full rounded-xl">Kirish</Button>
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
    </>
  );
}