import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Sprout,
  Sun,
  HeartPulse,
  Navigation,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Search,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Layers,
  History,
  Target,
  FlaskConical,
  ChevronDown,
  ArrowUpRight,
  Loader2,
  WifiOff,
  Info,
  Building2,
  Sparkle,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fadeUp, stagger, staggerItem } from '@/lib/motion';
import { startups as fallbackStartups, Startup } from '@/lib/data';
import { api, ApiError } from '@/lib/api';
import {
  DOMAIN_CONFIGS,
  SLUG_TO_DOMAIN_MAP,
  getDomainConfigByName,
} from '@/lib/domains';

interface DomainPageProps {
  domain?: string;
}

const badgeStyles: Record<string, string> = {
  'DPIIT Verified': 'bg-emerald2-500/10 text-emerald2-400 border-emerald2-500/25',
  'Provisional': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  'Pending': 'bg-white/5 text-white/40 border-white/15',
};

const domainIcons: Record<string, typeof Sprout> = {
  AgriTech: Sprout,
  CleanTech: Sun,
  HealthTech: HeartPulse,
  'Smart Mobility': Navigation,
  EdTech: GraduationCap,
};

export default function DomainPage({ domain: domainProp }: DomainPageProps) {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  // Determine active domain either from prop or route slug parameter
  const resolvedDomain = useMemo(() => {
    if (domainProp) return domainProp;
    if (slug && SLUG_TO_DOMAIN_MAP[slug.toLowerCase()]) {
      return SLUG_TO_DOMAIN_MAP[slug.toLowerCase()];
    }
    return 'AgriTech';
  }, [domainProp, slug]);

  const config = getDomainConfigByName(resolvedDomain) || DOMAIN_CONFIGS[0];
  const DomainIcon = domainIcons[resolvedDomain] || Sprout;

  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const [startups, setStartups] = useState<Startup[]>(() =>
    fallbackStartups.filter((s) => s.domain.toLowerCase() === resolvedDomain.toLowerCase())
  );
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch startups for this domain with query support and fallback logic
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('domain', resolvedDomain);
        if (query.trim()) params.set('query', query.trim());

        const data = await api<Startup[]>(
          `/procure/startups?${params.toString()}`,
          { signal: controller.signal }
        );
        setStartups(data);
        setUsingFallback(false);
      } catch (err) {
        if (err instanceof ApiError || err instanceof TypeError) {
          const local = fallbackStartups.filter((s) => {
            const matchesDomain = s.domain.toLowerCase() === resolvedDomain.toLowerCase();
            const matchesQuery =
              query.trim() === '' ||
              s.name.toLowerCase().includes(query.toLowerCase()) ||
              s.pitch.toLowerCase().includes(query.toLowerCase()) ||
              s.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
            return matchesDomain && matchesQuery;
          });
          setStartups(local);
          setUsingFallback(true);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, resolvedDomain]);

  // Derive domain-relevant stats from the filtered dataset
  const domainStats = useMemo(() => {
    const domainItems = fallbackStartups.filter(
      (s) => s.domain.toLowerCase() === resolvedDomain.toLowerCase()
    );
    const count = domainItems.length || 1;
    const avgMatch = Math.round(
      domainItems.reduce((acc, s) => acc + s.match, 0) / count
    );
    const totalPilots = domainItems.reduce(
      (acc, s) => acc + (s.pastPilots?.length || s.pilots || 0),
      0
    );
    const avgTrl = (
      domainItems.reduce((acc, s) => acc + s.trl, 0) / count
    ).toFixed(1);
    const verifiedPercent = Math.round(
      (domainItems.filter((s) => s.eligibility === 'DPIIT Verified').length / count) * 100
    );

    return {
      avgMatch,
      totalPilots,
      avgTrl,
      verifiedPercent,
    };
  }, [resolvedDomain]);

  return (
    <div className="min-h-screen bg-ink-950 text-white antialiased selection:bg-emerald2-500/30">
      <Navbar />

      <main>
        {/* ===================== HERO SECTION ===================== */}
        <section className="relative min-h-[560px] sm:min-h-[620px] flex items-center overflow-hidden pt-20 pb-20 px-6 border-b border-white/5">
          {/* Animated grid background */}
          <div className="absolute inset-0 grid-bg animate-gridscroll radial-fade" />

          {/* Ambient gradient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/4 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-emerald2-500/15 blur-[140px] animate-glow" />
            <div className="absolute right-[15%] top-[55%] h-[300px] w-[300px] rounded-full bg-sky-500/10 blur-[120px]" />
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative mx-auto max-w-5xl px-6 text-center w-full"
          >
            {/* Top Navigation & Breadcrumb */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all backdrop-blur-sm shadow-sm"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t('domainPage.backToHome')}
              </Link>
              <span className="text-white/20">/</span>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.badgeBorder} ${config.badgeBg} ${config.badgeText} backdrop-blur-sm`}
              >
                <DomainIcon className="h-3.5 w-3.5" />
                {resolvedDomain}
              </div>
            </motion.div>

            {/* Main Domain Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] text-white"
            >
              <span>{t(`domains.${config.key}.title`, resolvedDomain)}</span>
              <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-normal text-emerald2-400">
                {t('domainPage.badge')}
              </span>
            </motion.h1>

            {/* One-line Pitch */}
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl text-white/80 leading-relaxed font-light"
            >
              {t(config.taglineKey)}
            </motion.p>

            {/* Domain Switcher Pills */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              {DOMAIN_CONFIGS.map((item) => {
                const ItemIcon = domainIcons[item.name] || Sprout;
                const isActive = item.name === resolvedDomain;
                return (
                  <Link
                    key={item.slug}
                    to={`/domains/${item.slug}`}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald2-500 text-ink-950 font-semibold shadow-lg shadow-emerald2-500/20'
                        : 'border border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <ItemIcon className="h-3.5 w-3.5" />
                    {item.name}
                  </Link>
                );
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* ===================== DOMAIN STATS SECTION ===================== */}
        <section className="relative py-12 px-6 border-b border-white/5 bg-ink-900/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Stat 1: Match score */}
              <div className="rounded-2xl border border-white/10 bg-ink-850/80 p-5 backdrop-blur-sm card-sheen">
                <div className="flex items-center gap-2 text-emerald2-400 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                    {t('domainPage.stats.avgMatchScore')}
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums">
                  {domainStats.avgMatch}%
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {t('domainPage.stats.avgMatchNote')}
                </p>
              </div>

              {/* Stat 2: Past Pilots */}
              <div className="rounded-2xl border border-white/10 bg-ink-850/80 p-5 backdrop-blur-sm card-sheen">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <History className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                    {t('domainPage.stats.pastPilots')}
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums">
                  {domainStats.totalPilots}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {t('domainPage.stats.pastPilotsNote')}
                </p>
              </div>

              {/* Stat 3: Average TRL */}
              <div className="rounded-2xl border border-white/10 bg-ink-850/80 p-5 backdrop-blur-sm card-sheen">
                <div className="flex items-center gap-2 text-sky-400 mb-2">
                  <FlaskConical className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                    {t('domainPage.stats.avgTrl')}
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums">
                  TRL {domainStats.avgTrl}
                  <span className="text-sm text-white/40 font-normal"> / 9</span>
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {t('domainPage.stats.avgTrlNote')}
                </p>
              </div>

              {/* Stat 4: DPIIT Verified */}
              <div className="rounded-2xl border border-white/10 bg-ink-850/80 p-5 backdrop-blur-sm card-sheen">
                <div className="flex items-center gap-2 text-emerald2-400 mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                    {t('domainPage.stats.dpiitVerified')}
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl font-semibold text-emerald2-400 tracking-tight tabular-nums">
                  {domainStats.verifiedPercent}%
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {t('domainPage.stats.dpiitVerifiedNote')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== FILTERED STARTUPS LIST ===================== */}
        <section className="relative py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald2-400">
                  {resolvedDomain} Cohort
                </span>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  {t('domainPage.discoveryTitle', { domain: resolvedDomain })}
                </h2>
                <p className="mt-2 text-sm text-white/50 max-w-xl">
                  {t('domainPage.discoverySubtitle')}
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-80">
                <div className="flex items-center gap-2.5 rounded-xl bg-ink-850 border border-white/10 px-4 py-2.5 focus-within:border-emerald2-500/50 transition-colors shadow-inner">
                  <Search className="h-4 w-4 text-white/40 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('domainPage.searchPlaceholder', { domain: resolvedDomain })}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="text-white/40 hover:text-white transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Startups Container */}
            <div className="rounded-2xl border border-white/10 bg-ink-850 overflow-hidden shadow-2xl shadow-black/50">
              {/* Card Chrome */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-ink-900">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="ml-3 text-xs text-white/40 font-mono">
                    pilotgov.app / domains / {config.slug}
                  </span>
                </div>
                <span className="text-xs text-white/40">
                  {startups.length} {startups.length === 1 ? 'Startup' : 'Startups'} Matched
                </span>
              </div>

              {/* Startup List Rows */}
              <div className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {startups.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-6 py-16 text-center"
                    >
                      <p className="text-sm text-white/50">
                        {t('domainPage.emptySearch', { domain: resolvedDomain })}
                      </p>
                      {query && (
                        <button
                          onClick={() => setQuery('')}
                          className="mt-3 text-xs text-emerald2-400 hover:text-emerald2-300 font-medium transition-colors"
                        >
                          {t('discovery.clearSearch')}
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    startups.map((s) => {
                      const isOpen = expanded === s.name;
                      return (
                        <motion.div
                          key={s.name}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="cursor-pointer group"
                          onClick={() => setExpanded(isOpen ? null : s.name)}
                        >
                          {/* Main Row */}
                          <div className="flex items-center gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors">
                            {/* Avatar Icon */}
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/15 to-white/5 text-base font-semibold text-white border border-white/10 shadow-inner">
                              {s.name[0]}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-base font-semibold text-white">
                                  {s.name}
                                </span>
                                <span
                                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                                    badgeStyles[s.eligibility] || badgeStyles['DPIIT Verified']
                                  }`}
                                >
                                  {t(`discovery.eligibility.${s.eligibility}`, s.eligibility)}
                                </span>
                              </div>
                              <p className="text-xs text-white/60 mt-1 leading-normal">
                                {s.pitch}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="text-xs text-emerald2-400 font-medium">
                                  {s.domain}
                                </span>
                                <span className="text-white/20">•</span>
                                {s.tags.map((tTag) => (
                                  <span
                                    key={tTag}
                                    className="text-[10px] text-white/60 bg-white/5 border border-white/10 rounded px-2 py-0.5"
                                  >
                                    {tTag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Match score & Interactive breakdown */}
                            <div
                              className="relative hidden sm:flex flex-col items-end shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveTooltip(activeTooltip === s.name ? null : s.name)
                                }
                                onMouseEnter={() => setActiveTooltip(s.name)}
                                onMouseLeave={() => setActiveTooltip(null)}
                                title={t('discovery.matchTooltip.hint')}
                                aria-label={t('discovery.matchTooltip.hint')}
                                className="group/score flex flex-col items-end text-right rounded-lg p-1 hover:bg-white/[0.06] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald2-400/40"
                              >
                                <span className="text-[10px] uppercase tracking-wider text-white/40 group-hover/score:text-emerald2-400 flex items-center gap-1 transition-colors">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  {t('discovery.match')}
                                </span>
                                <span
                                  className={`text-lg font-semibold tabular-nums flex items-center gap-1 ${
                                    s.match >= 90 ? 'text-emerald2-400' : 'text-white'
                                  }`}
                                >
                                  {s.match}%
                                  <Info className="h-3 w-3 text-white/30 group-hover/score:text-emerald2-400 transition-colors" />
                                </span>
                              </button>

                              {/* Tooltip / Popover */}
                              <AnimatePresence>
                                {activeTooltip === s.name && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl border border-white/15 bg-ink-900/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/80 z-40 text-left cursor-default pointer-events-auto"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                                      <div className="flex items-center gap-1.5">
                                        <Sparkles className="h-3.5 w-3.5 text-emerald2-400" />
                                        <span className="text-xs font-semibold text-white">
                                          {t('discovery.matchTooltip.title')} ({s.match}%)
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-mono text-emerald2-400 bg-emerald2-500/10 border border-emerald2-500/20 rounded px-1.5 py-0.5">
                                        {s.name}
                                      </span>
                                    </div>

                                    <ul className="space-y-2.5 text-xs">
                                      <li className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald2-500/20 text-emerald2-400">
                                          <CheckCircle2 className="h-3 w-3" />
                                        </span>
                                        <div>
                                          <p className="font-medium text-white/90">
                                            {t('discovery.matchTooltip.domainMatch')}
                                          </p>
                                          <p className="text-[11px] text-white/50 mt-0.5">
                                            {t('discovery.matchTooltip.domainMatchExact', {
                                              domain: s.domain,
                                            })}
                                          </p>
                                        </div>
                                      </li>

                                      <li className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
                                          <Layers className="h-3 w-3" />
                                        </span>
                                        <div>
                                          <p className="font-medium text-white/90">
                                            {t('discovery.matchTooltip.capabilities')}
                                          </p>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {s.tags.map((tag) => (
                                              <span
                                                key={tag}
                                                className="text-[10px] bg-white/10 text-white/80 rounded px-1.5 py-0.5"
                                              >
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </li>

                                      <li className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                                          <History className="h-3 w-3" />
                                        </span>
                                        <div>
                                          <p className="font-medium text-white/90">
                                            {t('discovery.matchTooltip.pastPilots')}
                                          </p>
                                          <p className="text-[11px] text-white/50 mt-0.5">
                                            {t('discovery.matchTooltip.pastPilotsDesc', {
                                              count: s.pastPilots?.length || 0,
                                            })}
                                          </p>
                                          {s.pastPilots && s.pastPilots.length > 0 && (
                                            <p className="text-[10px] text-emerald2-400/90 mt-1 italic">
                                              "{s.pastPilots[0].outcome}"
                                            </p>
                                          )}
                                        </div>
                                      </li>
                                    </ul>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <ChevronDown
                              className={`h-4 w-4 text-white/40 shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-white' : ''
                              }`}
                            />
                          </div>

                          {/* Expanded Detail */}
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key="detail"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 pt-2 bg-ink-900/40 border-t border-white/5">
                                  {/* Mission Statement */}
                                  <div className="rounded-xl border border-white/[0.06] bg-ink-850 p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Target className="h-4 w-4 text-emerald2-400" />
                                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                                        {t('discovery.mission')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-white/80 leading-relaxed">
                                      {s.mission}
                                    </p>
                                  </div>

                                  {/* Metrics Grid */}
                                  <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="rounded-xl border border-white/[0.06] bg-ink-850 p-3.5">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <FlaskConical className="h-3.5 w-3.5 text-sky-400" />
                                        <span className="text-[10px] uppercase tracking-wider text-white/40">
                                          {t('discovery.trlLevel')}
                                        </span>
                                      </div>
                                      <p className="text-lg font-semibold text-white tabular-nums">
                                        {s.trl}
                                        <span className="text-xs text-white/40">/9</span>
                                      </p>
                                    </div>
                                    <div className="rounded-xl border border-white/[0.06] bg-ink-850 p-3.5">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <History className="h-3.5 w-3.5 text-amber-400" />
                                        <span className="text-[10px] uppercase tracking-wider text-white/40">
                                          {t('discovery.pastPilots')}
                                        </span>
                                      </div>
                                      <p className="text-lg font-semibold text-white tabular-nums">
                                        {s.pastPilots?.length || 0}
                                      </p>
                                    </div>
                                    <div className="rounded-xl border border-white/[0.06] bg-ink-850 p-3.5">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <ShieldCheck className="h-3.5 w-3.5 text-emerald2-400" />
                                        <span className="text-[10px] uppercase tracking-wider text-white/40">
                                          {t('discovery.matchScore')}
                                        </span>
                                      </div>
                                      <p
                                        className={`text-lg font-semibold tabular-nums ${
                                          s.match >= 90 ? 'text-emerald2-400' : 'text-white'
                                        }`}
                                      >
                                        {s.match}%
                                      </p>
                                    </div>
                                  </div>

                                  {/* Past Pilots Outcomes */}
                                  {s.pastPilots && s.pastPilots.length > 0 && (
                                    <div className="rounded-xl border border-white/[0.06] bg-ink-850 p-4 mb-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <History className="h-4 w-4 text-white/40" />
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                                          {t('discovery.pastPilotOutcomes')}
                                        </span>
                                      </div>
                                      <div className="space-y-3">
                                        {s.pastPilots.map((p, idx) => (
                                          <div key={idx} className="flex gap-3">
                                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald2-500/50" />
                                            <div className="min-w-0">
                                              <p className="text-xs font-medium text-white/90">
                                                {p.title}
                                              </p>
                                              <p className="text-[11px] text-white/40 mt-0.5">
                                                {p.dept}
                                              </p>
                                              <p className="text-xs text-emerald2-400/90 mt-1">
                                                {p.outcome}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Request Pilot CTA */}
                                  <a
                                    href="/#for-government"
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald2-500/10 border border-emerald2-500/30 px-4 py-3 text-sm font-medium text-emerald2-400 hover:bg-emerald2-500/20 hover:border-emerald2-500/50 transition-all shadow-sm"
                                  >
                                    {t('discovery.requestPilot', { name: s.name })}
                                    <ArrowUpRight className="h-4 w-4" />
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>

              {/* Card Footer Status Bar */}
              <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/5 bg-ink-900/60">
                <span className="text-xs text-white/40 flex items-center gap-1.5">
                  {loading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {t('discovery.fetching')}
                    </>
                  ) : usingFallback ? (
                    <>
                      <WifiOff className="h-3 w-3 text-amber-400/70" />
                      <span className="text-amber-400/70">{t('discovery.offline')}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      {t('discovery.live')}
                    </>
                  )}
                </span>
                <span className="text-xs text-emerald2-400 font-medium">
                  {t('discovery.countSummary', {
                    count: startups.length,
                    total: fallbackStartups.length,
                  })}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== DOMAIN CHALLENGE CTA ===================== */}
        <section className="relative py-16 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-ink-900/50">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald2-500/10 border border-emerald2-500/20 text-emerald2-400 mb-6 shadow-inner">
              <DomainIcon className="h-6 w-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {t('domainPage.ctaSection.title', { domain: resolvedDomain })}
            </h3>
            <p className="mt-3 text-base text-white/50 max-w-xl mx-auto">
              {t('domainPage.ctaSection.subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/#for-government"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-white/90 transition-all hover:shadow-xl hover:shadow-white/10"
              >
                <Building2 className="h-4 w-4" />
                {t('domainPage.ctaSection.postNeed', { domain: resolvedDomain })}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                to="/"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.07] transition-all backdrop-blur-sm"
              >
                {t('domainPage.ctaSection.exploreMore')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
