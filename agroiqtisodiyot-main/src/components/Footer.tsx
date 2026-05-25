import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, Globe } from 'lucide-react';
import iscadLogo from '@/assets/iscad-logo.png';

const footerLinks = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/about', label: 'Markaz haqida' },
  { to: '/editorial-board', label: "Tahrir hay'ati" },
  { to: '/contact', label: 'Aloqa' },
];

const journalLinks = [
  { to: '/journals', label: 'Ilmiy jurnallar' },
  { to: '/requirements', label: 'Jurnal talablari' },
  { to: '/article-checker', label: 'AI maqola tekshirish' },
  { to: '/auth', label: 'Tizimga kirish' },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/80">
      {/* Decorative Gradient Line */}
      <div className="h-[3px] bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="bg-slate-950 dark:bg-black text-slate-300">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-1 space-y-6">
              <Link to="/" className="inline-block">
                <img
                  src={iscadLogo}
                  alt="ISCAD Logo"
                  className="h-10 w-auto filter brightness-0 invert"
                />
              </Link>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed font-medium">
                Oziq-ovqat va Qishloq Xo'jaligi Sohasida Strategik Rivojlanish va
                Tadqiqotlar Xalqaro Markazi huzuridagi "Agroiqtisodiyot" ilmiy-amaliy nashri.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://www.agro.uz" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-white transition-all">
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest border-l-2 border-primary pl-3">
                Havolalar
              </h4>
              <ul className="space-y-3">
                {footerLinks.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-white/50 text-sm hover:text-white hover:translate-x-1 inline-block transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Journals & Services */}
            <div className="space-y-6">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest border-l-2 border-accent pl-3">
                Nashrlar
              </h4>
              <ul className="space-y-3">
                {journalLinks.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-white/50 text-sm hover:text-white hover:translate-x-1 inline-block transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest border-l-2 border-primary pl-3">
                Aloqa
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                  <span className="text-white/50 text-xs md:text-sm leading-relaxed">
                    100140, Toshkent viloyati, Qibray tumani, Universitet ko'chasi, 2-uy
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                  <a href="tel:+998903586164" className="text-white/50 text-xs md:text-sm hover:text-white transition-colors">
                    +998 90 358 61 64
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                  <a href="mailto:ooqxssrtxm@agro.uz" className="text-white/50 text-xs md:text-sm hover:text-white transition-colors">
                    ooqxssrtxm@agro.uz
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-accent" />
                  <a
                    href="https://www.agroiqtisodiyot.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 text-xs md:text-sm hover:text-accent transition-colors"
                  >
                    www.agroiqtisodiyot.uz
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 bg-slate-950/50 py-6">
          <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs text-center sm:text-left">
              &copy; {new Date().getFullYear()} ISCAD. Barcha huquqlar himoyalangan.
            </p>
            <p className="text-white/20 text-[10px] uppercase tracking-wider font-semibold text-center sm:text-right">
              O'zbekiston Respublikasi Qishloq xo'jaligi vazirligi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}