import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Zap,
  Minus,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Layers,
  Sprout,
  Sun,
  HeartPulse,
  Navigation,
  GraduationCap,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Lock,
  Eye,
  CalendarDays,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { stagger, staggerItem, fadeUp } from '@/lib/motion';
import {
  outcomeData,
  startups,
  pilotColumns,
  fallbackImpactSummary,
} from '@/lib/data';

const domainIcons: Record<string, typeof Sprout> = {
  AgriTech: Sprout,
  CleanTech: Sun,
  HealthTech: HeartPulse,
  'Smart Mobility': Navigation,
  EdTech: GraduationCap,
};

const domainPerformance = [
  {
    domain: 'AgriTech',
    successRate: 85,
    avgDays: 42,
    activePilots: 6,
    scaledValue: '₹3.8 Cr',
    highlight: 'District-level climate risk and predictive crop contingency platforms.',
  },
  {
    domain: 'CleanTech',
    successRate: 82,
    avgDays: 45,
    activePilots: 4,
    scaledValue: '₹4.5 Cr',
    highlight: 'Distributed municipal solar microgrids with 99.4% uptime resilience.',
  },
  {
    domain: 'HealthTech',
    successRate: 78,
    avgDays: 48,
    activePilots: 5,
    scaledValue: '₹2.9 Cr',
    highlight: 'Offline EHR deployments across 120 primary healthcare centres.',
  },
  {
    domain: 'Smart Mobility',
    successRate: 74,
    avgDays: 40,
    activePilots: 3,
    scaledValue: '₹2.1 Cr',
    highlight: 'Adaptive corridor signal routing cutting commute delays by 22%.',
  },
  {
    domain: 'EdTech',
    successRate: 80,
    avgDays: 50,
    activePilots: 2,
    scaledValue: '₹1.5 Cr',
    highlight: 'Vernacular digital classrooms improving module completion from 28% to 71%.',
  },
];

const departmentBreakdown = [
  {
    name: 'Dept. of Rural Development',
    pilotsCount: 4,
    budgetAllocated: '₹4.8 Cr',
    slaAdherence: '96%',
    status: 'High Velocity',
  },
  {
    name: 'Dept. of Urban Infrastructure',
    pilotsCount: 4,
    budgetAllocated: '₹6.6 Cr',
    slaAdherence: '94%',
    status: 'High Velocity',
  },
  {
    name: 'Dept. of Health & Family Welfare',
    pilotsCount: 3,
    budgetAllocated: '₹3.4 Cr',
    slaAdherence: '91%',
    status: 'On Track',
  },
  {
    name: 'Dept. of School Education',
    pilotsCount: 2,
    budgetAllocated: '₹2.1 Cr',
    slaAdherence: '93%',
    status: 'On Track',
  },
  {
    name: 'Ministry of Agriculture & Farmers Welfare',
    pilotsCount: 2,
    budgetAllocated: '₹3.8 Cr',
    slaAdherence: '95%',
    status: 'High Velocity',
  },
];

export default function FullReport() {
  const { t } = useTranslation();

  const totalPilotsTracked = useMemo(() => {
    return pilotColumns.reduce((acc, col) => acc + col.cards.length, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white antialiased selection:bg-emerald2-500/30">
      <Navbar />

      <main className="pt-28 pb-24 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Back link */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>{t('trust.backToHome', 'Back to Home')}</span>
            </Link>
          </div>

          {/* Header */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mb-14 max-w-3xl"
          >
            <motion.div variants={staggerItem} className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald2-400">
                {t('trust.fullReportEyebrow', 'Public Transparency & Audit Report')}
              </span>
              <span className="rounded-full bg-emerald2-500/10 border border-emerald2-500/25 px-2.5 py-0.5 text-[10px] font-medium text-emerald2-400">
                {t('trust.live', 'Live')}
              </span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight"
            >
              {t('trust.fullReportTitle', 'Comprehensive Pilot Outcomes & Efficiency Report')}
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mt-4 text-base sm:text-lg text-white/50 leading-relaxed"
            >
              {t(
                'trust.fullReportSubtitle',
                'A detailed analysis of public procurement velocity, departmental cost reductions, and pilot-to-scale conversion benchmarks across India.',
              )}
            </motion.p>

            <motion.div variants={staggerItem} className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-white/30" />
                {t('trust.reportingPeriod', 'Reporting period: Jan–Jun 2026')}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>{t('discovery.countSummary', { count: startups.length, total: startups.length })}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>{fallbackImpactSummary.totalScaledValue} {t('trust.totalScaledValueNote', 'scaled value')}</span>
            </motion.div>
          </motion.div>

          {/* Primary 4 Metric Cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
          >
            {outcomeData.map((d, i) => {
              const isSavings = d.delta.startsWith('+34');
              const isTime = d.label.includes('Time-to-deploy');
              return (
                <motion.div
                  key={d.label}
                  variants={staggerItem}
                  className="rounded-2xl border border-white/10 bg-ink-850 p-6 shadow-xl shadow-black/40 hover:border-white/20 transition-all"
                >
                  <p className="text-xs text-white/50 mb-3">{t(`trust.outcomeLabels.${d.label}`, d.label)}</p>
                  <div className="flex items-baseline justify-between mb-4">
                    <p className="text-3xl sm:text-4xl font-semibold text-white tabular-nums">
                      {isTime ? '45' : d.value}
                      <span className="text-sm font-normal text-white/40 ml-1">
                        {isTime ? t('trust.days') : d.unit}
                      </span>
                    </p>
                    {isSavings || d.delta.startsWith('+') ? (
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald2-400 bg-emerald2-500/10 border border-emerald2-500/25 px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3" />
                        {d.delta}
                      </span>
                    ) : isTime ? (
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2 py-0.5 rounded-full">
                        <Zap className="h-3 w-3" />
                        {d.delta}
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-xs font-medium text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                        <Minus className="h-3 w-3" />
                        {d.delta}
                      </span>
                    )}
                  </div>

                  {/* Visual Bar */}
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: isTime ? '25%' : `${Math.min(d.value, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full rounded-full ${
                        isTime
                          ? 'bg-gradient-to-r from-sky-500 to-emerald2-400'
                          : 'bg-gradient-to-r from-emerald2-600 to-emerald2-400'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-white/35 mt-3">
                    {isTime
                      ? t('trust.stat2Note', 'avg. time-to-deploy vs 180 days traditional')
                      : isSavings
                      ? t('trust.stat1Note', 'avg. cost savings vs traditional vendors')
                      : `${d.value}% verified benchmark across cohorts`}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Section 2: Domain-Level Performance Breakdown */}
          <section className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                {t('trust.domainBreakdownTitle', 'Domain-Level Performance Benchmarks')}
              </h2>
              <p className="text-sm text-white/50 mt-1">
                {t(
                  'trust.domainBreakdownSubtitle',
                  'Success rate, speed-to-deploy, and pilot outcomes categorized by sector.',
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {domainPerformance.map((dp) => {
                const Icon = domainIcons[dp.domain] || Sprout;
                return (
                  <motion.div
                    key={dp.domain}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="rounded-2xl border border-white/10 bg-ink-850 p-6 flex flex-col justify-between hover:border-white/20 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald2-500/10 text-emerald2-400 border border-emerald2-500/20">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <h3 className="text-base font-semibold text-white">{dp.domain}</h3>
                            <span className="text-[11px] text-white/40">
                              {dp.activePilots} {t('trust.activePilots', 'Active & Scaled Pilots')}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald2-400 tabular-nums">
                          {dp.scaledValue}
                        </span>
                      </div>

                      <p className="text-xs text-white/60 leading-relaxed mb-6">{dp.highlight}</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-white/40">{t('trust.outcomeLabels.Pilot success rate', 'Success Rate')}</span>
                          <span className="font-semibold text-white tabular-nums">{dp.successRate}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald2-400"
                            style={{ width: `${dp.successRate}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/40">
                        <span>{t('trust.avgDeployTime', 'Avg. Deployment')}</span>
                        <span className="text-white font-medium tabular-nums">{dp.avgDays} {t('trust.days', 'days')}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Section 3: Department Participation & Velocity */}
          <section className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                {t('trust.deptBreakdownTitle', 'Departmental Adoption & Velocity')}
              </h2>
              <p className="text-sm text-white/50 mt-1">
                {t(
                  'trust.deptBreakdownSubtitle',
                  'Pilot throughput and public budget execution across key participating agencies.',
                )}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-xl shadow-black/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-ink-900/60 text-[11px] uppercase tracking-wider text-white/40 font-semibold">
                      <th className="py-4 px-6">{t('postNeed.labelDept', 'Department')}</th>
                      <th className="py-4 px-6">{t('trust.activePilots', 'Active Pilots')}</th>
                      <th className="py-4 px-6">{t('postNeed.labelBudget', 'Budget Band')}</th>
                      <th className="py-4 px-6">{t('trust.slaAdherence', 'SLA Adherence')}</th>
                      <th className="py-4 px-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {departmentBreakdown.map((dept) => (
                      <tr key={dept.name} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6 font-medium text-white flex items-center gap-2.5">
                          <Building2 className="h-4 w-4 text-emerald2-400/70" />
                          <span>{dept.name}</span>
                        </td>
                        <td className="py-4 px-6 text-white/70 tabular-nums">{dept.pilotsCount} pilots</td>
                        <td className="py-4 px-6 font-semibold text-white/90 tabular-nums">{dept.budgetAllocated}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald2-400 font-medium tabular-nums">{dept.slaAdherence}</span>
                            <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full bg-emerald2-400 rounded-full" style={{ width: dept.slaAdherence }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald2-500/10 border border-emerald2-500/25 px-2.5 py-0.5 text-xs font-medium text-emerald2-400">
                            <CheckCircle2 className="h-3 w-3" />
                            {dept.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 4: Public Audit & Accountability Standards */}
          <section className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                {t('trust.auditAssuranceTitle', 'Public Trust & Accountability Standards')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 hover:border-white/20 transition-all">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald2-500/10 text-emerald2-400 border border-emerald2-500/20 mb-4">
                  <FileCheck2 className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-white mb-2">
                  {t('trust.audit1Title', 'Predefined KPI Verification')}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {t(
                    'trust.audit1Desc',
                    'Every pilot milestone is validated against explicit operational metrics before stage advancement.',
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 hover:border-white/20 transition-all">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-4">
                  <Lock className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-white mb-2">
                  {t('trust.audit2Title', 'Zero Lock-in Procurement')}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {t(
                    'trust.audit2Desc',
                    'Departments retain complete data ownership and code portability without long-term vendor capture.',
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 hover:border-white/20 transition-all">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                  <Eye className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-white mb-2">
                  {t('trust.audit3Title', 'Open Outcome Publishing')}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {t(
                    'trust.audit3Desc',
                    'All pilot outcome summaries and impact metrics are open to public scrutiny on the PilotGov ledger.',
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* CTA Strip */}
          <div className="rounded-2xl border border-emerald2-500/20 bg-gradient-to-r from-emerald2-500/10 via-ink-850 to-ink-850 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                {t('calculator.ctaTitle', 'Ready to save on your next pilot?')}
              </h3>
              <p className="text-sm text-white/50 mt-1">
                Post your challenge statement or explore eligible DPIIT startups now.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald2-500 hover:bg-emerald2-400 text-ink-950 font-semibold px-5 py-2.5 text-sm transition-all"
              >
                <span>{t('calculator.ctaButton', 'Post a Department Need')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
