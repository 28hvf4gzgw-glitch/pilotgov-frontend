import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  ChevronDown,
  Target,
  FlaskConical,
  History,
  X,
  Loader2,
  WifiOff,
  Info,
  Sparkles,
  CheckCircle2,
  Layers,
  Lock,
} from 'lucide-react';
import { stagger, staggerItem, fadeIn } from '@/lib/motion';
import { startups as fallbackStartups, Startup, PilotColumn } from '@/lib/data';
import { departments } from '@/lib/departments';
import { api, ApiError } from '@/lib/api';
import { usePilotBoard } from '@/context/PilotBoardContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const badgeStyles: Record<string, string> = {
  'DPIIT Verified': 'bg-emerald2-500/10 text-emerald2-400 border-emerald2-500/25',
  'Provisional': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  'Pending': 'bg-white/5 text-white/40 border-white/15',
};

// Domain chips are derived from the local seed list so filters render
// instantly, even before the live fetch resolves.
const allDomains = [...new Set(fallbackStartups.map((s) => s.domain))];

interface StartupDiscoveryProps {
  needId?: string;
  needTitle?: string;
  needDept?: string;
  needBudget?: string;
  onClearNeed?: () => void;
}

export default function StartupDiscovery({
  needId: propNeedId,
  needTitle: propNeedTitle,
  needDept: propNeedDept,
  needBudget: propNeedBudget,
  onClearNeed,
}: StartupDiscoveryProps = {}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isStartup = user?.role === 'STARTUP';
  const pilotBoard = usePilotBoard();
  const [searchParams, setSearchParams] = useSearchParams();
  const needId = propNeedId ?? searchParams.get('needId') ?? undefined;
  const needTitle = propNeedTitle ?? searchParams.get('needTitle') ?? undefined;
  const needDept = propNeedDept ?? searchParams.get('needDept') ?? undefined;
  const needBudget = propNeedBudget ?? searchParams.get('needBudget') ?? undefined;

  const handleClearNeed = () => {
    if (onClearNeed) {
      onClearNeed();
    }
    if (searchParams.has('needId') || searchParams.has('needTitle')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('needId');
      nextParams.delete('needTitle');
      setSearchParams(nextParams);
    }
  };

  const [query, setQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const [startups, setStartups] = useState<Startup[]>(fallbackStartups);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const [appliedStartups, setAppliedStartups] = useState<Set<string>>(new Set());
  const [requestingStartups, setRequestingStartups] = useState<Set<string>>(new Set());
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // Confirmation modal state for standalone discovery requests
  const [modalStartup, setModalStartup] = useState<Startup | null>(null);
  const [modalDept, setModalDept] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalBudget, setModalBudget] = useState('₹25L');
  const [modalDeptSuggestions, setModalDeptSuggestions] = useState<string[]>([]);
  const [showModalDeptSuggestions, setShowModalDeptSuggestions] = useState(false);
  const modalDeptRef = useRef<HTMLDivElement>(null);

  const handleModalDeptChange = (value: string) => {
    setModalDept(value);
    if (value.trim().length === 0) {
      setModalDeptSuggestions([]);
      setShowModalDeptSuggestions(false);
      return;
    }
    const filtered = departments
      .filter((d) => d.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 6);
    setModalDeptSuggestions(filtered);
    setShowModalDeptSuggestions(filtered.length > 0);
  };

  const handleModalDeptSelect = (dept: string) => {
    setModalDept(dept);
    setModalDeptSuggestions([]);
    setShowModalDeptSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalDeptRef.current && !modalDeptRef.current.contains(e.target as Node)) {
        setShowModalDeptSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRequestClick = (s: Startup) => {
    if (!isStartup) return;
    if (needId) {
      // In active need context: directly submit with need data
      submitPilotRequest(s, needDept, needTitle || s.pitch, needBudget || '₹25L', needId);
    } else {
      // Standalone discovery: open confirmation modal without guessing
      setModalStartup(s);
      setModalDept(needDept || '');
      setModalTitle(s.pitch);
      setModalBudget(needBudget || '₹25L');
      setModalDeptSuggestions([]);
      setShowModalDeptSuggestions(false);
    }
  };

  const submitPilotRequest = async (
    s: Startup,
    dept?: string,
    title?: string,
    budget?: string,
    activeNeedId?: string,
  ) => {
    // Immediately disable this specific button / modal action and show spinner
    setRequestingStartups((prev) => new Set(prev).add(s.name));
    setCardErrors((prev) => {
      const next = { ...prev };
      delete next[s.name];
      return next;
    });

    try {
      const payload = {
        startup: s.name,
        dept: dept || `Dept. of ${s.domain}`,
        title: title || s.pitch,
        budget: budget || '₹25L',
        ...(activeNeedId ? { needId: activeNeedId } : {}),
      };

      const updatedPipeline = await api<PilotColumn[]>('/pilot/request', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // On success, permanently mark startup as applied for this session
      setAppliedStartups((prev) => new Set(prev).add(s.name));
      if (pilotBoard?.setColumns && Array.isArray(updatedPipeline)) {
        pilotBoard.setColumns(updatedPipeline);
      }
      setModalStartup(null);
    } catch (err) {
      console.error('Failed to request pilot', err);
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : t('discovery.requestError');
      setCardErrors((prev) => ({ ...prev, [s.name]: message }));
    } finally {
      setRequestingStartups((prev) => {
        const next = new Set(prev);
        next.delete(s.name);
        return next;
      });
    }
  };

  // Refetch whenever the search or domain filter changes. A short debounce
  // avoids firing a request on every keystroke.
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set('query', query.trim());
        if (activeDomain) params.set('domain', activeDomain);
        if (needId) params.set('needId', needId);

        const data = await api<Startup[]>(
          `/procure/startups?${params.toString()}`,
          { signal: controller.signal },
        );
        setStartups(data);
        setUsingFallback(false);
      } catch (err) {
        if (err instanceof ApiError || err instanceof TypeError) {
          // Backend not reachable (not started yet, wrong URL, etc.) —
          // fall back to local seed data so the UI still demos cleanly.
          const local = fallbackStartups.filter((s) => {
            const matchesQuery =
              query.trim() === '' ||
              s.name.toLowerCase().includes(query.toLowerCase()) ||
              s.domain.toLowerCase().includes(query.toLowerCase()) ||
              s.pitch.toLowerCase().includes(query.toLowerCase());
            const matchesDomain = activeDomain === null || s.domain === activeDomain;
            return matchesQuery && matchesDomain;
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
  }, [query, activeDomain, needId]);

  const filtered = startups;

  return (
    <section id="for-government" className="relative py-28 px-6 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid lg:grid-cols-12 gap-12 items-center"
        >
          <motion.div variants={staggerItem} className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald2-400">
              {t('discovery.eyebrow')}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
              {t('discovery.title')}
            </h2>
            <p className="mt-4 text-lg text-white/50 leading-relaxed">
              {t('discovery.subtitle')}
            </p>
            <ul className="mt-8 space-y-4">
              {[t('discovery.bullet1'), t('discovery.bullet2'), t('discovery.bullet3')].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald2-500/15 text-emerald2-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Mock dashboard card */}
          <motion.div variants={staggerItem} className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-ink-850 overflow-hidden shadow-2xl shadow-black/40">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-ink-900">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="ml-3 text-xs text-white/30 font-medium">
                  pilotgov.app / discover
                </span>
              </div>

              {/* Search bar */}
              <div className="px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-2.5 focus-within:border-emerald2-500/40 transition-colors">
                  <Search className="h-4 w-4 text-white/30 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('discovery.searchPlaceholder')}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="text-white/30 hover:text-white/60 transition-colors shrink-0"
                      aria-label={t('discovery.clearSearch')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Domain filter chips */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button
                    onClick={() => setActiveDomain(null)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                      activeDomain === null
                        ? 'border-emerald2-500/40 bg-emerald2-500/10 text-emerald2-400'
                        : 'border-white/10 bg-white/[0.03] text-white/50 hover:text-white/80 hover:border-white/20'
                    }`}
                  >
                    {t('discovery.allDomains')}
                  </button>
                  {allDomains.map((d) => (
                    <button
                      key={d}
                      onClick={() => setActiveDomain(activeDomain === d ? null : d)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        activeDomain === d
                          ? 'border-emerald2-500/40 bg-emerald2-500/10 text-emerald2-400'
                          : 'border-white/10 bg-white/[0.03] text-white/50 hover:text-white/80 hover:border-white/20'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Need Scope Banner */}
              {needTitle && (
                <div className="flex items-center justify-between gap-2 px-5 py-2.5 bg-emerald2-500/10 border-b border-emerald2-500/20 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-2 w-2 rounded-full bg-emerald2-400 animate-pulse" />
                    <span className="text-white/60 truncate">
                      {t('discovery.showingMatchesFor')}{' '}
                      <strong className="font-semibold text-emerald2-400">{needTitle}</strong>
                    </span>
                  </div>
                  <button
                    onClick={handleClearNeed}
                    className="text-white/40 hover:text-white transition-colors text-[11px] flex items-center gap-1 shrink-0 ml-2"
                    title={t('discovery.clearScope')}
                  >
                    <X className="h-3 w-3" />
                    <span>{t('discovery.clearScope')}</span>
                  </button>
                </div>
              )}

              {/* List */}
              <div className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-5 py-12 text-center"
                    >
                      <p className="text-sm text-white/40">{t('discovery.noResults')}</p>
                      <button
                        onClick={() => { setQuery(''); setActiveDomain(null); }}
                        className="mt-3 text-xs text-emerald2-400 hover:text-emerald2-300 transition-colors"
                      >
                        {t('discovery.clearFilters')}
                      </button>
                    </motion.div>
                  ) : (
                    filtered.map((s) => {
                      const isOpen = expanded === s.name;
                      const isApplied = appliedStartups.has(s.name);
                      const isRequesting = requestingStartups.has(s.name);
                      const errorMsg = cardErrors[s.name];
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
                          {/* Collapsed row */}
                          <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                            {/* Avatar */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-white/10 to-white/5 text-sm font-semibold text-white/80">
                              {s.name[0]}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white truncate">
                                  {s.name}
                                </span>
                                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeStyles[s.eligibility]}`}>
                                  {t(`discovery.eligibility.${s.eligibility}`, s.eligibility)}
                                </span>
                              </div>
                              <p className="text-xs text-white/45 mt-1 truncate">{s.pitch}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-white/40">{s.domain}</span>
                                {s.tags.map((tTag) => (
                                  <span key={tTag} className="text-[10px] text-white/30 bg-white/5 rounded px-1.5 py-0.5">
                                    {tTag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Match score with Interactive Breakdown Tooltip */}
                            <div
                              className="relative hidden sm:flex flex-col items-end shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => setActiveTooltip(activeTooltip === s.name ? null : s.name)}
                                onMouseEnter={() => setActiveTooltip(s.name)}
                                onMouseLeave={() => setActiveTooltip(null)}
                                title={t('discovery.matchTooltip.hint')}
                                aria-label={t('discovery.matchTooltip.hint')}
                                className="group/score flex flex-col items-end text-right rounded-lg p-1 -mr-1 hover:bg-white/[0.06] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald2-400/40"
                              >
                                <span className="text-[10px] uppercase tracking-wider text-white/30 group-hover/score:text-emerald2-400 flex items-center gap-1 transition-colors">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  {t('discovery.match')}
                                </span>
                                <span className={`text-lg font-semibold tabular-nums flex items-center gap-1 ${s.match >= 90 ? 'text-emerald2-400' : 'text-white'}`}>
                                  {s.match}
                                  <Info className="h-3 w-3 text-white/20 group-hover/score:text-emerald2-400 transition-colors" />
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
                                      {/* 1. Domain match */}
                                      <li className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald2-500/20 text-emerald2-400">
                                          <CheckCircle2 className="h-3 w-3" />
                                        </span>
                                        <div>
                                          <p className="font-medium text-white/90">
                                            {t('discovery.matchTooltip.domainMatch')}
                                          </p>
                                          <p className="text-[11px] text-white/50 mt-0.5">
                                            {activeDomain === s.domain || (query && s.domain.toLowerCase().includes(query.toLowerCase()))
                                              ? t('discovery.matchTooltip.domainMatchExact', { domain: s.domain })
                                              : t('discovery.matchTooltip.domainMatchHigh', { domain: s.domain })}
                                          </p>
                                        </div>
                                      </li>

                                      {/* 2. Capability overlap */}
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
                                              <span key={tag} className="text-[10px] bg-white/10 text-white/80 rounded px-1.5 py-0.5">
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </li>

                                      {/* 3. Past pilot success */}
                                      <li className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                                          <History className="h-3 w-3" />
                                        </span>
                                        <div>
                                          <p className="font-medium text-white/90">
                                            {t('discovery.matchTooltip.pastPilots')}
                                          </p>
                                          <p className="text-[11px] text-white/50 mt-0.5">
                                            {t('discovery.matchTooltip.pastPilotsDesc', { count: s.pastPilots.length })}
                                          </p>
                                          {s.pastPilots.length > 0 && (
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

                            <ChevronDown className={`h-4 w-4 text-white/30 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </div>

                          {/* Expanded detail */}
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
                                <div className="px-5 pb-5 pt-1 bg-ink-900/40">
                                  {/* Mission */}
                                  <div className="rounded-lg border border-white/[0.06] bg-ink-850 p-4 mb-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Target className="h-3.5 w-3.5 text-emerald2-400" />
                                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{t('discovery.mission')}</span>
                                    </div>
                                    <p className="text-sm text-white/70 leading-relaxed">{s.mission}</p>
                                  </div>

                                  {/* TRL + stats row */}
                                  <div className="grid grid-cols-3 gap-3 mb-3">
                                    <div className="rounded-lg border border-white/[0.06] bg-ink-850 p-3">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <FlaskConical className="h-3.5 w-3.5 text-sky-400" />
                                        <span className="text-[10px] uppercase tracking-wider text-white/40">{t('discovery.trlLevel')}</span>
                                      </div>
                                      <p className="text-lg font-semibold text-white tabular-nums">{s.trl}<span className="text-xs text-white/40">/9</span></p>
                                    </div>
                                    <div className="rounded-lg border border-white/[0.06] bg-ink-850 p-3">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <History className="h-3.5 w-3.5 text-amber-400" />
                                        <span className="text-[10px] uppercase tracking-wider text-white/40">{t('discovery.pastPilots')}</span>
                                      </div>
                                      <p className="text-lg font-semibold text-white tabular-nums">{s.pastPilots.length}</p>
                                    </div>
                                    <div className="rounded-lg border border-white/[0.06] bg-ink-850 p-3">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <ShieldCheck className="h-3.5 w-3.5 text-emerald2-400" />
                                        <span className="text-[10px] uppercase tracking-wider text-white/40">{t('discovery.matchScore')}</span>
                                      </div>
                                      <p className={`text-lg font-semibold tabular-nums ${s.match >= 90 ? 'text-emerald2-400' : 'text-white'}`}>{s.match}</p>
                                    </div>
                                  </div>

                                  {/* Past pilots */}
                                  <div className="rounded-lg border border-white/[0.06] bg-ink-850 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <History className="h-3.5 w-3.5 text-white/40" />
                                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{t('discovery.pastPilotOutcomes')}</span>
                                    </div>
                                    <div className="space-y-3">
                                      {s.pastPilots.map((p, idx) => (
                                        <div key={idx} className="flex gap-3">
                                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald2-500/50" />
                                          <div className="min-w-0">
                                            <p className="text-xs font-medium text-white/80">{p.title}</p>
                                            <p className="text-[11px] text-white/35 mt-0.5">{p.dept}</p>
                                            <p className="text-xs text-emerald2-400/80 mt-1">{p.outcome}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                   {/* CTA */}
                                  {isApplied ? (
                                    <button
                                      disabled
                                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald2-500/10 border border-emerald2-500/25 px-4 py-2.5 text-sm font-medium text-emerald2-400 cursor-default opacity-90 transition-all"
                                    >
                                      <CheckCircle2 className="h-4 w-4 text-emerald2-400" />
                                      <span>{t('discovery.applied', 'Applied ✓')}</span>
                                    </button>
                                  ) : isRequesting ? (
                                    <button
                                      disabled
                                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white/[0.04] border border-white/10 px-4 py-2.5 text-sm font-medium text-white/50 cursor-not-allowed transition-all"
                                    >
                                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white/50" />
                                      <span className="opacity-70">{t('discovery.requesting', 'Requesting...')}</span>
                                    </button>
                                  ) : !isStartup ? (
                                    <div className="mt-3 space-y-2">
                                      <button
                                        disabled
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white/[0.03] border border-white/10 px-4 py-2.5 text-xs font-medium text-white/40 cursor-not-allowed transition-all"
                                      >
                                        <Lock className="h-3.5 w-3.5 text-amber-400/80" />
                                        <span>{t('auth.onlyStartupsRequestPilot')}</span>
                                      </button>
                                      <div className="flex items-center justify-between px-1 text-[11px] text-white/40">
                                        <span>
                                          {user ? `${user.name} (${user.role})` : t('auth.loginRequired')}
                                        </span>
                                        <Link
                                          to="/auth"
                                          onClick={(e) => e.stopPropagation()}
                                          className="text-emerald2-400 hover:underline font-medium"
                                        >
                                          {user ? t('auth.switchAccount') : t('auth.loginAsStartup')}
                                        </Link>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRequestClick(s);
                                      }}
                                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white/[0.04] border border-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] hover:border-white/20 transition-all"
                                    >
                                      <span>{t('discovery.requestPilot', { name: s.name })}</span>
                                      <ArrowUpRight className="h-3.5 w-3.5 text-white/70" />
                                    </button>
                                  )}

                                  {errorMsg && !isRequesting && !isApplied && (
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-1.5">
                                      <WifiOff className="h-3 w-3 shrink-0 text-amber-400/70" />
                                      <span>{errorMsg}</span>
                                    </div>
                                  )}
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

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/5 bg-ink-900/50">
                <span className="text-xs text-white/30 flex items-center gap-1.5">
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
                  {t('discovery.countSummary', { count: filtered.length, total: startups.length })}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Standalone Discovery Pilot Request Confirmation Modal */}
      <AnimatePresence>
        {modalStartup && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => {
              if (!requestingStartups.has(modalStartup.name)) {
                setModalStartup(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl shadow-black/90 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {t('discovery.confirmTitle', 'Confirm pilot request')}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/50">{modalStartup.name}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald2-500/10 text-emerald2-400 border border-emerald2-500/25">
                      {modalStartup.domain}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalStartup(null)}
                  disabled={requestingStartups.has(modalStartup.name)}
                  className="rounded-lg p-1 text-white/40 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!modalDept.trim() || !modalTitle.trim() || !modalBudget.trim()) return;
                  submitPilotRequest(modalStartup, modalDept, modalTitle, modalBudget);
                }}
                className="mt-4 space-y-4"
              >
                {/* Department autocomplete field */}
                <div ref={modalDeptRef} className="relative">
                  <label className="text-xs font-medium text-white/60 mb-1.5 block">
                    {t('discovery.deptLabel', 'Department')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalDept}
                    onChange={(e) => handleModalDeptChange(e.target.value)}
                    onFocus={() => modalDept.trim().length > 0 && setShowModalDeptSuggestions(modalDeptSuggestions.length > 0)}
                    placeholder={t('discovery.deptPlaceholder', 'Enter department name…')}
                    className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors"
                  />
                  {showModalDeptSuggestions && (
                    <div className="absolute z-20 mt-1 w-full rounded-lg border border-white/10 bg-ink-850 shadow-2xl shadow-black/90 overflow-hidden max-h-48 overflow-y-auto">
                      {modalDeptSuggestions.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleModalDeptSelect(d)}
                          className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors border-b border-white/5 last:border-b-0"
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Budget field */}
                <div>
                  <label className="text-xs font-medium text-white/60 mb-1.5 block">
                    {t('discovery.budgetLabel', 'Budget')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalBudget}
                    onChange={(e) => setModalBudget(e.target.value)}
                    placeholder={t('discovery.budgetPlaceholder', 'e.g. ₹25L')}
                    className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors"
                  />
                </div>

                {/* Title / Pitch field */}
                <div>
                  <label className="text-xs font-medium text-white/60 mb-1.5 block">
                    {t('discovery.titleLabel', 'Pilot title / description')} *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors resize-none"
                  />
                </div>

                {/* Error Banner if any */}
                {cardErrors[modalStartup.name] && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2">
                    <WifiOff className="h-3.5 w-3.5 shrink-0 text-amber-400/70" />
                    <span>{cardErrors[modalStartup.name]}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalStartup(null)}
                    disabled={requestingStartups.has(modalStartup.name)}
                    className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors disabled:opacity-40"
                  >
                    {t('discovery.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={
                      requestingStartups.has(modalStartup.name) ||
                      !modalDept.trim() ||
                      !modalTitle.trim() ||
                      !modalBudget.trim()
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald2-500 hover:bg-emerald2-400 px-4 py-2 text-sm font-semibold text-ink-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {requestingStartups.has(modalStartup.name) ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-ink-950" />
                        <span>{t('discovery.requesting', 'Requesting...')}</span>
                      </>
                    ) : (
                      <span>{t('discovery.confirm', 'Confirm request')}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
