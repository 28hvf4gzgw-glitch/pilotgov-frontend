import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { supportedLanguages } from '@/i18n/config';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = supportedLanguages.find((l) => l.code === i18n.language) ?? supportedLanguages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('language.label')}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white hover:border-white/20 transition-all"
      >
        <Globe className="h-3.5 w-3.5" />
        {current.label}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg border border-white/10 bg-ink-900 shadow-2xl shadow-black/50 overflow-hidden z-50">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-white/75 hover:bg-white/[0.06] hover:text-white transition-colors border-b border-white/5 last:border-b-0"
            >
              {lang.label}
              {lang.code === i18n.language && <Check className="h-3.5 w-3.5 text-emerald2-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
