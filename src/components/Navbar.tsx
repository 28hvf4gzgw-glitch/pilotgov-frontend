import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, ArrowRight } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { key: 'howItWorks', anchor: 'how-it-works' },
    { key: 'forStartups', anchor: 'for-startups' },
    { key: 'forGovernment', anchor: 'for-government' },
    { key: 'trust', anchor: 'trust' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ink-950/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald2-500 text-ink-950 shadow-lg shadow-emerald2-500/20">
            <Landmark className="h-4.5 w-4.5" strokeWidth={2.4} />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-white">
            Pilot<span className="text-emerald2-400">Gov</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.key}
              href={`#${l.anchor}`}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200"
            >
              {t(`nav.${l.key}`)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="#for-startups"
            className="hidden sm:inline text-sm text-white/70 hover:text-white transition-colors"
          >
            {t('nav.signIn')}
          </a>
          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-white/90 transition-all duration-200 hover:shadow-lg hover:shadow-white/10"
          >
            {t('nav.bookDemo')}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </nav>
    </header>
  );
}
