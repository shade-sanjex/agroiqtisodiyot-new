import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import iscadLogo from '@/assets/iscad-logo.png';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, LogOut, User, Sparkles, X, ChevronRight } from 'lucide-react';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const location = useLocation();
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close desktop menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          navRef.current && !navRef.current.contains(e.target as Node)) {
        setDesktopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll handler: collapse when scrolling down past threshold, expand at top
  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;

    if (currentY <= 30) {
      // At top: always expanded, with entrance animation
      setCollapsed(false);
      setDesktopMenuOpen(false);
    } else if (currentY > 80) {
      // Scrolled down: collapse
      setCollapsed(true);
    }

    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close desktop menu on route change
  useEffect(() => {
    setDesktopMenuOpen(false);
  }, [location.pathname]);

  const toggleDesktopMenu = () => {
    setDesktopMenuOpen(prev => !prev);
  };

  return (
    <>
      {/* Main Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-3 md:px-5 pt-3 pointer-events-none">
        <nav
          ref={navRef}
          className={`navbar-glass mx-auto max-w-7xl w-full pointer-events-auto rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            collapsed
              ? 'navbar-collapsed px-4 py-2'
              : 'navbar-expanded px-5 py-2.5'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
              <img
                src={iscadLogo}
                alt="ISCAD Logo"
                className={`logo-adaptive transition-all duration-500 group-hover:scale-105 ${
                  collapsed ? 'h-7 md:h-8' : 'h-8 md:h-10'
                }`}
              />
            </Link>

            {/* Desktop: Inline Navigation Links (visible when NOT collapsed) */}
            <div
              className={`hidden lg:flex items-center gap-0.5 xl:gap-1 bg-secondary/30 dark:bg-secondary/15 p-1 rounded-xl border border-border/15 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                collapsed
                  ? 'opacity-0 scale-90 max-w-0 overflow-hidden pointer-events-none mx-0 p-0 border-0'
                  : 'opacity-100 scale-100 max-w-[900px] mx-2'
              }`}
            >
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-2.5 xl:px-3 py-1.5 text-[10px] xl:text-[11px] font-bold uppercase tracking-wide transition-all duration-300 rounded-lg whitespace-nowrap nav-link-item ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/60 dark:hover:bg-background/20'
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <span className="flex items-center gap-1">
                      {link.label}
                      {link.badge && (
                        <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 text-[7px] font-black rounded-full leading-none animate-pulse ${
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          <Sparkles className="h-1.5 w-1.5" />
                          AI
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {/* Desktop: Hamburger button (visible only when collapsed) */}
              <button
                onClick={toggleDesktopMenu}
                className={`hidden lg:flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-xl ${
                  collapsed
                    ? 'opacity-100 w-8 h-8 scale-100 bg-secondary/40 dark:bg-secondary/25 hover:bg-secondary/60 dark:hover:bg-secondary/40 border border-border/20'
                    : 'opacity-0 w-0 h-0 scale-0 overflow-hidden pointer-events-none'
                }`}
                aria-label="Menyuni ochish"
              >
                <div className={`hamburger-icon ${desktopMenuOpen ? 'is-active' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>

              <ThemeToggle />

              {/* Desktop auth */}
              <div className={`hidden lg:flex items-center gap-2 transition-all duration-500 ${
                collapsed ? 'opacity-0 max-w-0 overflow-hidden' : 'opacity-100 max-w-xs'
              }`}>
                {user ? (
                  <div className="flex items-center gap-1.5">
                    {isAdmin && (
                      <Link to="/admin">
                        <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-bold border-primary/20 hover:border-primary/50 h-7 px-3">
                          Admin
                        </Button>
                      </Link>
                    )}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-secondary/80 dark:bg-secondary/40 border border-border/40 text-[10px] font-bold text-foreground/95">
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <span className="max-w-[70px] truncate">
                        {profile?.full_name || 'Muallif'}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={signOut} className="rounded-full h-7 w-7 hover:bg-destructive/10 hover:text-destructive">
                      <LogOut className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button size="sm" className="rounded-xl px-4 h-7 text-[10px] font-bold glow-button-primary bg-primary hover:bg-primary/95 text-primary-foreground">
                      Kirish
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile hamburger */}
              <div className="lg:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-border/80 bg-background/50 shadow-sm hover:bg-secondary/40">
                      <Menu className="h-4.5 w-4.5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px] sm:w-[310px] p-0 border-l border-border/80 bg-background/95 backdrop-blur-xl">
                    <div className="flex flex-col h-full">
                      {/* Drawer Header */}
                      <div className="p-6 border-b border-border/50 flex items-center">
                        <img src={iscadLogo} alt="ISCAD" className="h-9 logo-adaptive" />
                      </div>

                      {/* Nav Links */}
                      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                        {navLinks.map(link => {
                          const isActive = location.pathname === link.to;
                          return (
                            <Link
                              key={link.to}
                              to={link.to}
                              onClick={() => setMobileOpen(false)}
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
                              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block w-full">
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
                              onClick={() => { signOut(); setMobileOpen(false); }}
                              className="w-full rounded-2xl font-bold"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Chiqish
                            </Button>
                          </>
                        ) : (
                          <Link to="/auth" onClick={() => setMobileOpen(false)} className="block w-full">
                            <Button className="w-full rounded-2xl font-bold glow-button-primary bg-primary text-primary-foreground">Kirish</Button>
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

        {/* Desktop Dropdown Menu (when collapsed & hamburger clicked) */}
        <div
          ref={menuRef}
          className={`hidden lg:block mx-auto max-w-7xl w-full pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            desktopMenuOpen && collapsed
              ? 'opacity-100 translate-y-0 scale-100 mt-2'
              : 'opacity-0 -translate-y-3 scale-95 pointer-events-none mt-0 h-0'
          }`}
        >
          <div className="navbar-dropdown-glass rounded-2xl p-2.5 overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setDesktopMenuOpen(false)}
                    className={`dropdown-link-item relative px-3 py-2 text-[10px] xl:text-[11px] font-bold uppercase tracking-wide transition-all duration-300 rounded-xl text-center whitespace-nowrap ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/60 dark:hover:bg-white/5'
                    }`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <span className="flex items-center justify-center gap-1">
                      {link.label}
                      {link.badge && (
                        <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 text-[7px] font-black rounded-full leading-none animate-pulse ${
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          <Sparkles className="h-1.5 w-1.5" />
                          AI
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}

              <div className="h-4 w-px bg-border/40 mx-1.5 hidden md:block" />

              {/* Auth action in dropdown */}
              {user ? (
                <div className="flex items-center justify-center gap-1.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-secondary/80 dark:bg-secondary/40 border border-border/40 text-[10px] font-bold text-foreground/95">
                    <User className="h-2.5 w-2.5 text-primary" />
                    <span className="max-w-[70px] truncate">{profile?.full_name || 'Muallif'}</span>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDesktopMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="rounded-xl text-[10px] h-7 px-3 font-bold border-primary/20 hover:border-primary/50">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="icon" onClick={signOut} className="rounded-full h-7 w-7 hover:bg-destructive/10 hover:text-destructive">
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setDesktopMenuOpen(false)}
                  className="flex items-center justify-center px-1"
                >
                  <Button size="sm" className="rounded-xl px-5 h-8 text-[10px] font-bold glow-button-primary bg-primary text-primary-foreground">
                    Kirish
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to push page contents down */}
      <div className="h-16 lg:h-20" />
    </>
  );
}