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

// Token asosidagi focus-visible ring naqshi (Button bilan izchil) — deep-ink sirt ustida
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm';

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/80">
      {/* Decorative Gradient Line — token asosida (primary/accent) */}
      <div className="h-[3px] bg-gradient-to-r from-primary via-accent to-primary" />

      {/*
        Footer doimiy "deep ink" sirt: `dark` scope CSS o'zgaruvchilarini
        "Cultivated Future" dark palitrasiga bog'laydi (sahifa temasidan qat'i nazar),
        shuning uchun bg-background/text-* token'lari izchil ishlaydi (R1.4).
      */}
      <div className="dark bg-background text-muted-foreground">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-1 space-y-6">
              <Link to="/" className={`inline-block ${focusRing}`}>
                <img
                  src={iscadLogo}
                  alt="ISCAD Logo"
                  className="h-10 w-auto filter brightness-0 invert"
                />
              </Link>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-medium">
                Oziq-ovqat va Qishloq Xo'jaligi Sohasida Strategik Rivojlanish va
                Tadqiqotlar Xalqaro Markazi huzuridagi "Agroiqtisodiyot" ilmiy-amaliy nashri.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.agro.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="agro.uz veb-sayti"
                  className={`w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-foreground transition-all ${focusRing}`}
                >
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-foreground font-bold text-xs uppercase tracking-widest border-l-2 border-primary pl-3">
                Havolalar
              </h4>
              <ul className="space-y-3">
                {footerLinks.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`text-muted-foreground text-sm hover:text-foreground hover:translate-x-1 inline-block transition-all ${focusRing}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Journals & Services */}
            <div className="space-y-6">
              <h4 className="text-foreground font-bold text-xs uppercase tracking-widest border-l-2 border-accent pl-3">
                Nashrlar
              </h4>
              <ul className="space-y-3">
                {journalLinks.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`text-muted-foreground text-sm hover:text-foreground hover:translate-x-1 inline-block transition-all ${focusRing}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-foreground font-bold text-xs uppercase tracking-widest border-l-2 border-primary pl-3">
                Aloqa
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    100140, Toshkent viloyati, Qibray tumani, Universitet ko'chasi, 2-uy
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                  <a
                    href="tel:+998903586164"
                    className={`text-muted-foreground text-xs md:text-sm hover:text-foreground transition-colors ${focusRing}`}
                  >
                    +998 90 358 61 64
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                  <a
                    href="mailto:ooqxssrtxm@agro.uz"
                    className={`text-muted-foreground text-xs md:text-sm hover:text-foreground transition-colors ${focusRing}`}
                  >
                    ooqxssrtxm@agro.uz
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 flex-shrink-0 text-accent" />
                  <a
                    href="https://www.agroiqtisodiyot.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-muted-foreground text-xs md:text-sm hover:text-accent transition-colors ${focusRing}`}
                  >
                    www.agroiqtisodiyot.uz
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border bg-foreground/[0.02] py-6">
          <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs text-center sm:text-left">
              &copy; {new Date().getFullYear()} ISCAD. Barcha huquqlar himoyalangan.
            </p>
            <p className="text-muted-foreground/70 text-xs uppercase tracking-wider font-semibold text-center sm:text-right">
              O'zbekiston Respublikasi Qishloq xo'jaligi vazirligi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
