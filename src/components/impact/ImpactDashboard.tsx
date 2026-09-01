import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Rocket,
  Award,
  TrendingUp,
  BarChart3,
  Layers,
  FileDown,
  ShieldCheck,
  CalendarDays,
  Building2,
  Sparkles,
  Loader2,
  WifiOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sprout,
  Sun,
  HeartPulse,
  Navigation,
  GraduationCap,
  FlaskConical,
  IndianRupee,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImpactCalculator from '@/components/ImpactCalculator';
import { fadeUp, stagger, staggerItem } from '@/lib/motion';
import {
  ImpactSummary,
  ScaledContract,
  fallbackImpactSummary,
  fallbackScaledContracts,
} from '@/lib/data';
import { api, BASE_URL } from '@/lib/api';
import { DOMAIN_CONFIGS } from '@/lib/domains';

function safeT(
  t: (key: string, options?: Record<string, unknown>) => unknown,
  key: string,
  fallback: string,
  options?: Record<string, unknown>
): string {
  try {
    const val = t(key, { defaultValue: fallback, ...options });
    if (typeof val === 'string' && val.trim() !== '' && !val.startsWith('[object')) {
      return val;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

const domainIcons: Record<string, typeof Sprout> = {
  AgriTech: Sprout,
  CleanTech: Sun,
  HealthTech: HeartPulse,
  'Smart Mobility': Navigation,
  EdTech: GraduationCap,
};

const domainSlugMap: Record<string, string> = {
  AgriTech: 'agritech',
  CleanTech: 'cleantech',
  HealthTech: 'healthtech',
  'Smart Mobility': 'smart-mobility',
  EdTech: 'edtech',
};

const badgeStyles: Record<string, string> = {
  'DPIIT Verified': 'bg-emerald2-500/10 text-emerald2-400 border-emerald2-500/25',
  Provisional: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  Pending: 'bg-white/5 text-white/40 border-white/15',
};

export default function ImpactDashboard() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<ImpactSummary>(fallbackImpactSummary);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await api<ImpactSummary>('/impact/summary');
      if (data && typeof data === 'object') {
        setSummary(data);
        setUsingFallback(false);
      } else {
        setSummary(fallbackImpactSummary);
        setUsingFallback(true);
      }
    } catch {
      setSummary(fallbackImpactSummary);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const scaledContractsList = useMemo<ScaledContract[]>(() => {
    if (summary.scaledContracts && summary.scaledContracts.length > 0) {
      return summary.scaledContracts;
    }
    return fallbackScaledContracts;
  }, [summary]);

  const maxFunnelValue = useMemo(() => {
    const funnel = summary.pipelineFunnel || fallbackImpactSummary.pipelineFunnel;
    return Math.max(funnel.posted, funnel.piloting, funnel.scaling, funnel.scaled, 1);
  }, [summary]);

  const totalDomainNeeds = useMemo(() => {
    const byDomain = summary.byDomain || fallbackImpactSummary.byDomain;
    return Object.values(byDomain).reduce((sum, val) => sum + val, 0) || 1;
  }, [summary]);

  const funnelStages = useMemo(() => {
    const funnel = summary.pipelineFunnel || fallbackImpactSummary.pipelineFunnel;
    return [
      {
        key: 'posted',
        label: t('impact.funnel.posted'),
        count: funnel.posted,
        color: 'from-sky-500 to-sky-400',
        textColor: 'text-sky-400',
        bgColor: 'bg-sky-500/10 border-sky-500/20',
        icon: FileText,
      },
      {
        key: 'piloting',
        label: t('impact.funnel.piloting'),
        count: funnel.piloting,
        color: 'from-amber-500 to-amber-400',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/20',
        icon: Rocket,
      },
      {
        key: 'scaling',
        label: t('impact.funnel.scaling'),
        count: funnel.scaling,
        color: 'from-emerald2-500 to-teal-400',
        textColor: 'text-emerald2-400',
        bgColor: 'bg-emerald2-500/10 border-emerald2-500/20',
        icon: TrendingUp,
      },
      {
        key: 'scaled',
        label: t('impact.funnel.scaled'),
        count: funnel.scaled,
        color: 'from-emerald2-500 to-emerald2-300',
        textColor: 'text-emerald2-300',
        bgColor: 'bg-emerald2-500/15 border-emerald2-500/30',
        icon: Award,
      },
    ];
  }, [summary, t]);

  return (
    <div className="min-h-screen bg-transparent text-white antialiased selection:bg-emerald2-500/30">
      <Navbar />

      <main className="pt-24 pb-28">
        {/* ===================== HERO / HEADER ===================== */}
        <section className="relative px-6 py-12 border-b border-white/5 overflow-hidden">
          {/* Ambient gradient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 -top-20 h-[380px] w-[580px] -translate-x-1/2 rounded-full bg-emerald2-500/15 blur-[140px] animate-glow" />
            <div className="absolute right-[10%] top-[40%] h-[260px] w-[260px] rounded-full bg-sky-500/10 blur-[110px]" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            {/* Top Navigation & Breadcrumb */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mb-6"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-full"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t('impact.backToHome')}
              </Link>
              <span className="text-white/20">/</span>
              <span className="text-xs font-semibold text-emerald2-400 uppercase tracking-wider">
                {t('impact.eyebrow')}
              </span>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
            >
              <div>
                <motion.div
                  variants={staggerItem}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald2-500/10 border border-emerald2-500/20 px-3 py-1 text-xs font-medium text-emerald2-400 mb-4"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('impact.hubBadge')}
                </motion.div>

                <motion.h1
                  variants={staggerItem}
                  className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight"
                >
                  {t('impact.title')}
                </motion.h1>

                <motion.p
                  variants={staggerItem}
                  className="mt-4 text-base sm:text-lg text-white/50 max-w-3xl leading-relaxed"
                >
                  {t('impact.subtitle')}
                </motion.p>
              </div>

              {/* Status indicator */}
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-2 text-xs self-start lg:self-end bg-ink-900/80 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />
                    <span className="text-white/60">{t('impact.fetching')}</span>
                  </>
                ) : usingFallback ? (
                  <>
                    <WifiOff className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-amber-400/90">{t('impact.offline')}</span>
                  </>
                ) : (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald2-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald2-500"></span>
                    </span>
                    <span className="text-emerald2-400 font-medium">{t('impact.live')}</span>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===================== 4 STAT CARDS ===================== */}
        <section className="relative px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {/* Card 1: Needs Posted */}
              <motion.div
                variants={staggerItem}
                className="group relative rounded-2xl border border-white/10 bg-ink-850 p-6 shadow-2xl shadow-black/40 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-500/10 blur-2xl group-hover:bg-sky-500/20 transition-all" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    {t('impact.stats.needsPosted')}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform">
                    <FileText className="h-5 w-5" />
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
                  {summary.needsPosted}
                </div>
                <p className="mt-2 text-xs text-white/45">
                  {t('impact.stats.needsPostedNote')}
                </p>
              </motion.div>

              {/* Card 2: Active Pilots */}
              <motion.div
                variants={staggerItem}
                className="group relative rounded-2xl border border-white/10 bg-ink-850 p-6 shadow-2xl shadow-black/40 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    {t('impact.stats.activePilots')}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                    <Rocket className="h-5 w-5" />
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-amber-400 tabular-nums">
                  {summary.activePilots}
                </div>
                <p className="mt-2 text-xs text-white/45">
                  {t('impact.stats.activePilotsNote')}
                </p>
              </motion.div>

              {/* Card 3: Contracts Scaled */}
              <motion.div
                variants={staggerItem}
                className="group relative rounded-2xl border border-white/10 bg-ink-850 p-6 shadow-2xl shadow-black/40 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald2-500/10 blur-2xl group-hover:bg-emerald2-500/20 transition-all" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    {t('impact.stats.contractsScaled')}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald2-500/10 border border-emerald2-500/20 text-emerald2-400 group-hover:scale-105 transition-transform">
                    <Award className="h-5 w-5" />
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-emerald2-400 tabular-nums">
                  {summary.contractsScaled}
                </div>
                <p className="mt-2 text-xs text-white/45">
                  {t('impact.stats.contractsScaledNote')}
                </p>
              </motion.div>

              {/* Card 4: Total Scaled Value */}
              <motion.div
                variants={staggerItem}
                className="group relative rounded-2xl border border-white/10 bg-ink-850 p-6 shadow-2xl shadow-black/40 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald2-500/15 blur-2xl group-hover:bg-emerald2-500/25 transition-all" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    {t('impact.stats.totalScaledValue')}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald2-500/10 border border-emerald2-500/20 text-emerald2-400 group-hover:scale-105 transition-transform">
                    <IndianRupee className="h-5 w-5" />
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
                  {summary.totalScaledValue}
                </div>
                <p className="mt-2 text-xs text-white/45">
                  {t('impact.stats.totalScaledValueNote')}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===================== PIPELINE FUNNEL & DOMAIN DISTRIBUTION ===================== */}
        <section className="relative px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Pipeline Funnel Visualization (7 cols) */}
              <motion.div
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lg:col-span-7 rounded-2xl border border-white/10 bg-ink-850 p-6 sm:p-8 shadow-2xl shadow-black/40"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald2-500/10 text-emerald2-400">
                      <BarChart3 className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        {t('impact.funnel.title')}
                      </h2>
                      <p className="text-xs text-white/40">
                        {t('impact.funnel.subtitle')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Funnel Bars */}
                <div className="space-y-5">
                  {funnelStages.map((stage, idx) => {
                    const pct = Math.round((stage.count / maxFunnelValue) * 100);
                    const conversionPct =
                      summary.pipelineFunnel?.posted > 0
                        ? Math.round((stage.count / summary.pipelineFunnel.posted) * 100)
                        : 100;
                    const StageIcon = stage.icon;

                    return (
                      <div key={stage.key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-md border ${stage.bgColor} ${stage.textColor}`}
                            >
                              <StageIcon className="h-3 w-3" />
                            </span>
                            <span className="font-medium text-white/90">
                              {stage.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-white/40">
                              {conversionPct}% {t('impact.funnel.ofPosted')}
                            </span>
                            <span className="font-semibold text-white tabular-nums text-sm">
                              {stage.count}
                            </span>
                          </div>
                        </div>

                        {/* Bar */}
                        <div className="h-3 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.max(pct, 6)}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              ease: 'easeOut',
                              delay: 0.15 * idx,
                            }}
                            className={`h-full rounded-full bg-gradient-to-r ${stage.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald2-400" />
                    {t('impact.funnel.conversionRate')}:{' '}
                    <span className="font-semibold text-emerald2-400">
                      {summary.needsPosted > 0
                        ? Math.round((summary.contractsScaled / summary.needsPosted) * 100)
                        : 28}
                      %
                    </span>
                  </span>
                  <span>Jan–Aug 2026</span>
                </div>
              </motion.div>

              {/* Needs by Domain Breakdown (5 cols) */}
              <motion.div
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lg:col-span-5 rounded-2xl border border-white/10 bg-ink-850 p-6 sm:p-8 shadow-2xl shadow-black/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                        <Layers className="h-4 w-4" />
                      </span>
                      <div>
                        <h2 className="text-base font-semibold text-white">
                          {t('impact.domains.title')}
                        </h2>
                        <p className="text-xs text-white/40">
                          {t('impact.domains.subtitle')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Domain list */}
                  <div className="space-y-4">
                    {Object.entries(summary.byDomain || fallbackImpactSummary.byDomain).map(
                      ([domain, count], i) => {
                        const Icon = domainIcons[domain] || Sprout;
                        const slug = domainSlugMap[domain] || 'agritech';
                        const pct = Math.round((count / totalDomainNeeds) * 100);

                        return (
                          <Link
                            key={domain}
                            to={`/domains/${slug}`}
                            className="group block rounded-xl border border-white/5 bg-ink-900/60 p-3 hover:border-white/15 hover:bg-ink-900 transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-emerald2-400 group-hover:bg-emerald2-500/10 transition-colors">
                                  <Icon className="h-3.5 w-3.5" />
                                </span>
                                <span className="text-xs font-semibold text-white group-hover:text-emerald2-400 transition-colors">
                                  {domain}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-white tabular-nums">
                                  {count}
                                </span>
                                <span className="text-[10px] text-white/30">
                                  ({pct}%)
                                </span>
                                <ChevronRight className="h-3.5 w-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </div>

                            {/* Mini Progress */}
                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${pct}%` }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.6,
                                  ease: 'easeOut',
                                  delay: 0.1 * i,
                                }}
                                className="h-full rounded-full bg-emerald2-500/80"
                              />
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                  <span>5 Active Domain Sectors</span>
                  <Link
                    to="/domains/agritech"
                    className="text-emerald2-400 hover:text-emerald2-300 font-medium inline-flex items-center gap-1"
                  >
                    {safeT(t, 'impact.domains.explore', 'Explore Domain Hub')}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===================== EMBEDDED IMPACT CALCULATOR ===================== */}
        <section className="relative px-6 py-6 border-t border-white/5">
          <div className="mx-auto max-w-7xl">
            <ImpactCalculator />
          </div>
        </section>

        {/* ===================== SCALED PROCUREMENT CONTRACTS ===================== */}
        <section id="scaled-contracts" className="relative px-6 py-12 border-t border-white/5">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="max-w-3xl mb-10"
            >
              <motion.div
                variants={staggerItem}
                className="inline-flex items-center gap-2 rounded-full bg-emerald2-500/10 border border-emerald2-500/20 px-3 py-1 text-xs font-medium text-emerald2-400 mb-3"
              >
                <Award className="h-3.5 w-3.5" />
                {safeT(t, 'impact.contracts.title', 'Scaled Procurement Contracts')}
              </motion.div>
              <motion.h2
                variants={staggerItem}
                className="text-2xl sm:text-3xl font-semibold tracking-tight text-white"
              >
                {safeT(t, 'impact.contracts.title', 'Scaled Procurement Contracts')}
              </motion.h2>
              <motion.p
                variants={staggerItem}
                className="mt-2 text-sm sm:text-base text-white/50"
              >
                {safeT(
                  t,
                  'impact.contracts.subtitle',
                  'Verified pilot graduates that have transitioned into full public procurement contracts.'
                )}
              </motion.p>
            </motion.div>

            {/* Contracts Cards Grid */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {scaledContractsList.map((contract) => {
                const DomainIcon = domainIcons[contract.domain] || Sprout;
                const domainConfig = DOMAIN_CONFIGS.find(
                  (d) => d.name.toLowerCase() === contract.domain.toLowerCase()
                );
                const badgeClass =
                  badgeStyles[contract.eligibility] || badgeStyles['DPIIT Verified'];

                return (
                  <motion.div
                    key={contract.id}
                    variants={staggerItem}
                    className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-ink-850 p-6 shadow-2xl shadow-black/40 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div>
                      {/* Header row: Domain + Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                            domainConfig?.badgeBg || 'bg-white/5'
                          } ${domainConfig?.badgeText || 'text-white/80'} ${
                            domainConfig?.badgeBorder || 'border-white/10'
                          }`}
                        >
                          <DomainIcon className="h-3 w-3" />
                          {contract.domain}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${badgeClass}`}
                        >
                          <ShieldCheck className="h-3 w-3" />
                          {contract.eligibility}
                        </span>
                      </div>

                      {/* Title & Startup */}
                      <h3 className="text-base font-semibold text-white leading-snug group-hover:text-emerald2-400 transition-colors mb-1.5">
                        {contract.title}
                      </h3>

                      <p className="text-xs font-medium text-white/60 mb-2 flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-white/5 text-[10px] font-semibold text-white/70">
                          {contract.startup ? contract.startup[0] : 'S'}
                        </span>
                        {contract.startup}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{contract.dept}</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-white/55 leading-relaxed mb-6 line-clamp-3">
                        {contract.description}
                      </p>
                    </div>

                    <div>
                      {/* Metrics strip */}
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-ink-900/70 border border-white/5 mb-5">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                            {t('impact.contracts.contractValue')}
                          </span>
                          <span className="text-sm font-bold text-emerald2-400 tabular-nums">
                            {contract.value}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                            {t('impact.contracts.trlLevel')}
                          </span>
                          <span className="text-xs font-semibold text-white tabular-nums flex items-center gap-1 mt-0.5">
                            <FlaskConical className="h-3 w-3 text-sky-400" />
                            TRL {contract.trl}/9
                          </span>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {contract.date}
                          </span>
                          <span className="text-[10px] text-emerald2-400/80 font-medium">
                            Full Procurement
                          </span>
                        </div>
                      </div>

                      {/* Download Contract PDF Action Button */}
                      <a
                        href={`${BASE_URL}/scale/contracts/${contract.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={`contract-${contract.id}.pdf`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald2-500/10 border border-emerald2-500/30 px-4 py-2.5 text-xs font-semibold text-emerald2-400 hover:bg-emerald2-500/20 hover:border-emerald2-500/50 transition-all group/btn shadow-sm"
                        title={t('impact.contracts.downloadPdf')}
                      >
                        <FileDown className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5" />
                        <span>{t('impact.contracts.downloadContract')}</span>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ===================== BOTTOM CTA BANNER ===================== */}
        <section className="relative px-6 py-12 border-t border-white/5">
          <div className="mx-auto max-w-5xl text-center rounded-3xl border border-white/10 bg-gradient-to-b from-ink-850 to-ink-900 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-[250px] w-[500px] -translate-x-1/2 rounded-full bg-emerald2-500/10 blur-[100px]" />
            </div>
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald2-500/10 border border-emerald2-500/20 text-emerald2-400 mb-5 shadow-inner">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                {t('impact.cta.title')}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/50 max-w-xl mx-auto">
                {t('impact.cta.subtitle')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/#for-government"
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-white/90 transition-all hover:shadow-xl hover:shadow-white/10"
                >
                  <Building2 className="h-4 w-4" />
                  {t('impact.cta.postNeed')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="/#for-startups"
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.07] transition-all backdrop-blur-sm"
                >
                  {t('impact.cta.exploreStartups')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
