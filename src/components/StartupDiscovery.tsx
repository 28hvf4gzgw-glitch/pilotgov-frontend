import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
} from 'lucide-react';
import { stagger, staggerItem, fadeIn } from '@/lib/motion';
import { startups as fallbackStartups, Startup } from '@/lib/data';
import { api, ApiError } from '@/lib/api';

const badgeStyles: Record<string, string> = {
  'DPIIT Verified': 'bg-emerald2-500/10 text-emerald2-400 border-emerald2-500/25',
  'Provisional': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  'Pending': 'bg-white/5 text-white/40 border-white/15',
};

// Domain chips are derived from the local seed list so filters render
// instantly, even before the live fetch resolves.
const allDomains = [...new Set(fallbackStartups.map((s) => s.domain))];

export default function StartupDiscovery() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [startups, setStartups] = useState<Startup[]>(fallbackStartups);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

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
  }, [query, activeDomain]);

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
                    placeholder="Search by name, domain, or capability…"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="text-white/30 hover:text-white/60 transition-colors shrink-0"
                      aria-label="Clear search"
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
                    All domains
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
                      <p className="text-sm text-white/40">No startups match your search.</p>
                      <button
                        onClick={() => { setQuery(''); setActiveDomain(null); }}
                        className="mt-3 text-xs text-emerald2-400 hover:text-emerald2-300 transition-colors"
                      >
                        Clear all filters
                      </button>
                    </motion.div>
                  ) : (
                    filtered.map((s) => {
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
                                  {s.eligibility}
                                </span>
                              </div>
                              <p className="text-xs text-white/45 mt-1 truncate">{s.pitch}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-white/40">{s.domain}</span>
                                {s.tags.map((t) => (
                                  <span key={t} className="text-[10px] text-white/30 bg-white/5 rounded px-1.5 py-0.5">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Match score */}
                            <div className="hidden sm:flex flex-col items-end shrink-0">
                              <span className="text-[10px] uppercase tracking-wider text-white/30">Match</span>
                              <span className={`text-lg font-semibold tabular-nums ${s.match >= 90 ? 'text-emerald2-400' : 'text-white'}`}>
                                {s.match}
                              </span>
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
                                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Mission</span>
                                    </div>
                                    <p className="text-sm text-white/70 leading-relaxed">{s.mission}</p>
                                  </div>

                                  {/* TRL + stats row */}
                                  <div className="grid grid-cols-3 gap-3 mb-3">
                                    <div className="rounded-lg border border-white/[0.06] bg-ink-850 p-3">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <FlaskConical className="h-3.5 w-3.5 text-sky-400" />
                                        <span className="text-[10px] uppercase tracking-wider text-white/40">TRL Level</span>
                                      </div>
                                      <p className="text-lg font-semibold text-white tabular-nums">{s.trl}<span className="text-xs text-white/40">/9</span></p>
                                    </div>
                                    <div className="rounded-lg border border-white/[0.06] bg-ink-850 p-3">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <History className="h-3.5 w-3.5 text-amber-400" />
                                        <span className="text-[10px] uppercase tracking-wider text-white/40">Past Pilots</span>
                                      </div>
                                      <p className="text-lg font-semibold text-white tabular-nums">{s.pastPilots.length}</p>
                                    </div>
                                    <div className="rounded-lg border border-white/[0.06] bg-ink-850 p-3">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <ShieldCheck className="h-3.5 w-3.5 text-emerald2-400" />
                                        <span className="text-[10px] uppercase tracking-wider text-white/40">Match Score</span>
                                      </div>
                                      <p className={`text-lg font-semibold tabular-nums ${s.match >= 90 ? 'text-emerald2-400' : 'text-white'}`}>{s.match}</p>
                                    </div>
                                  </div>

                                  {/* Past pilots */}
                                  <div className="rounded-lg border border-white/[0.06] bg-ink-850 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <History className="h-3.5 w-3.5 text-white/40" />
                                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Past Pilot Outcomes</span>
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
                                  <button className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white/[0.04] border border-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] hover:border-white/20 transition-all">
                                    Request pilot with {s.name}
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                  </button>
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
                      Fetching…
                    </>
                  ) : usingFallback ? (
                    <>
                      <WifiOff className="h-3 w-3 text-amber-400/70" />
                      <span className="text-amber-400/70">Backend offline — showing sample data</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      Live from PilotGov API
                    </>
                  )}
                </span>
                <span className="text-xs text-emerald2-400 font-medium">
                  {filtered.length} of {startups.length} DPIIT-verified startups
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
