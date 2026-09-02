import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Landmark,
  ArrowRight,
  ChevronDown,
  Sprout,
  Sun,
  HeartPulse,
  Navigation,
  GraduationCap,
  Sparkles,
  Menu,
  X,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { DOMAIN_CONFIGS } from '@/lib/domains';
import { useAuth } from '@/context/AuthContext';

const domainIcons: Record<string, typeof Sprout> = {
  agritech: Sprout,
  cleantech: Sun,
  healthtech: HeartPulse,
  'smart-mobility': Navigation,
  edtech: GraduationCap,
};

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [domainsOpen, setDomainsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const links = [
    { key: 'howItWorks', anchor: 'how-it-works' },
    { key: 'forStartups', anchor: 'for-startups' },
    { key: 'forGovernment', anchor: 'for-government' },
    { key: 'trust', anchor: 'trust' },
    { key: 'impact', anchor: 'impact' },
    { key: 'reviews', anchor: 'public-reviews' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDomainsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDomainsOpen(false);
  }, [location.pathname]);

  const isDomainActive = location.pathname.startsWith('/domains/');

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'OFFICER':
        return 'bg-emerald2-500/10 text-emerald2-400 border-emerald2-500/30';
      case 'STARTUP':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'CITIZEN':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'OFFICER':
        return t('auth.officer');
      case 'STARTUP':
        return t('auth.startup');
      case 'CITIZEN':
        return t('auth.citizen');
      default:
        return role || '';
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-ink-950/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald2-500 text-ink-950 shadow-lg shadow-emerald2-500/20 group-hover:scale-105 transition-transform">
            <Landmark className="h-4.5 w-4.5" strokeWidth={2.4} />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-white">
            Pilot<span className="text-emerald2-400">Gov</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          {/* Domains Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDomainsOpen(!domainsOpen)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 py-1.5 focus:outline-none ${
                isDomainActive || domainsOpen
                  ? 'text-emerald2-400 font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
              aria-expanded={domainsOpen}
            >
              <span>{t('nav.domains')}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  domainsOpen ? 'rotate-180 text-emerald2-400' : 'text-white/40'
                }`}
              />
            </button>

            <AnimatePresence>
              {domainsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-2xl border border-white/15 bg-ink-900/95 backdrop-blur-2xl p-2 shadow-2xl shadow-black/80 z-50"
                >
                  <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-white/40 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-emerald2-400" />
                      {t('nav.allDomains')}
                    </span>
                  </div>

                  <div className="mt-1 space-y-0.5">
                    {DOMAIN_CONFIGS.map((item) => {
                      const Icon = domainIcons[item.slug] || Sprout;
                      const isCurrent = location.pathname === `/domains/${item.slug}`;
                      return (
                        <Link
                          key={item.slug}
                          to={`/domains/${item.slug}`}
                          onClick={() => setDomainsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                            isCurrent
                              ? 'bg-emerald2-500/15 text-emerald2-400 border border-emerald2-500/30'
                              : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.badgeBg} ${item.badgeText} border ${item.badgeBorder}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {t(`domains.${item.key}.title`, item.name)}
                            </p>
                            <p className="text-[10px] text-white/40 truncate">
                              /domains/{item.slug}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section Anchors */}
          {links.map((l) => (
            <a
              key={l.key}
              href={`/#${l.anchor}`}
              className="text-sm text-white/65 hover:text-white transition-colors duration-200"
            >
              {t(`nav.${l.key}`, l.key)}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {user ? (
            <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white max-w-[120px] truncate">
                  {user.name}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(
                    user.role
                  )}`}
                >
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                title={t('auth.logout')}
                className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t('auth.logout')}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:inline-flex group items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-white/90 transition-all duration-200 hover:shadow-lg hover:shadow-white/10"
            >
              <span>{t('auth.login')}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-ink-950/95 backdrop-blur-2xl px-6 py-5 space-y-4"
          >
            {/* User status on mobile */}
            {user && (
              <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <UserIcon className="h-3.5 w-3.5 text-emerald2-400" />
                    <span>{user.name}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(
                        user.role
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                    {user.orgName && (
                      <span className="text-xs text-white/40 truncate">{user.orgName}</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 hover:text-rose-200 bg-rose-500/10 border border-rose-500/20 rounded-lg"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            )}

            {/* Domain links */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-emerald2-400" />
                {t('nav.domains')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DOMAIN_CONFIGS.map((item) => {
                  const Icon = domainIcons[item.slug] || Sprout;
                  return (
                    <Link
                      key={item.slug}
                      to={`/domains/${item.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-medium text-white/80 hover:text-white hover:bg-white/[0.07]"
                    >
                      <Icon className="h-3.5 w-3.5 text-emerald2-400" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* General links */}
            <div className="border-t border-white/5 pt-3 space-y-2">
              {links.map((l) => (
                <a
                  key={l.key}
                  href={`/#${l.anchor}`}
                  className="block text-sm text-white/70 hover:text-white py-1 transition-colors"
                >
                  {t(`nav.${l.key}`, l.key)}
                </a>
              ))}
            </div>

            {/* Mobile Actions */}
            {!user && (
              <div className="border-t border-white/5 pt-3 flex flex-col gap-2.5">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink-950"
                >
                  {t('auth.login')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


