import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
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
    <footer className="relative mt-auto">
      {/* Top gradient line */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

      <div className="bg-navy-900 dark:bg-black/60 text-white/80">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-block mb-4">
                <img
                  src={iscadLogo}
                  alt="ISCAD Logo"
                  className="h-10 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </Link>
              <p className="text-white/50 text-sm leading-relaxed font-sans">
                Oziq-ovqat va Qishloq Xo'jaligi Sohasida Strategik Rivojlanish va
                Tadqiqotlar Xalqaro Markazi
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 font-sans uppercase tracking-wider">
                Havolalar
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-white/50 text-sm hover:text-white transition-colors font-sans"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Journals */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 font-sans uppercase tracking-wider">
                Jurnallar
              </h4>
              <ul className="space-y-2.5">
                {journalLinks.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-white/50 text-sm hover:text-white transition-colors font-sans"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 font-sans uppercase tracking-wider">
                Aloqa
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-white/40" />
                  <span className="text-white/50 text-sm font-sans">
                    100140, Toshkent viloyati, Qibray tumani, Universitet ko'chasi, 2-uy
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 flex-shrink-0 text-white/40" />
                  <a href="tel:+998903586164" className="text-white/50 text-sm hover:text-white transition-colors font-sans">
                    +998 90 358 61 64
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 flex-shrink-0 text-white/40" />
                  <a href="mailto:ooqxssrtxm@agro.uz" className="text-white/50 text-sm hover:text-white transition-colors font-sans">
                    ooqxssrtxm@agro.uz
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <ExternalLink className="h-4 w-4 flex-shrink-0 text-white/40" />
                  <a
                    href="https://www.agroiqtisodiyot.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 text-sm hover:text-white transition-colors font-sans"
                  >
                    www.agroiqtisodiyot.uz
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-white/30 text-xs font-sans">
              &copy; {new Date().getFullYear()} ISCAD. Barcha huquqlar himoyalangan.
            </p>
            <p className="text-white/20 text-xs font-sans">
              O'zbekiston Respublikasi Qishloq xo'jaligi vazirligi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}