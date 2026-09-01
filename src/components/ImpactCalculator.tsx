import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calculator,
  Clock,
  TrendingUp,
  IndianRupee,
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Scale,
} from 'lucide-react';

// Baseline assumptions for traditional (non-PilotGov) public procurement,
// used only to compute a relative "time/cost saved" projection.
const TRADITIONAL_CYCLE_DAYS = 270; // avg. months-long tender cycle
const TRADITIONAL_OVERHEAD_PCT = 0.18; // admin/process overhead as % of contract value
const PILOTGOV_CYCLE_DAYS = 45; // Identify -> Discover -> Pilot -> Scale, avg.
const PILOTGOV_OVERHEAD_PCT = 0.06;

/**
 * Safe translation helper that prevents undefined/object return values
 * from crashing the React render tree.
 */
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

function formatINR(
  value: number,
  t: (key: string, options?: Record<string, unknown>) => unknown
): string {
  const num = typeof value === 'number' && !isNaN(value) ? value : 0;
  const cr = safeT(t, 'impactCalculator.units.crore', 'Cr');
  const l = safeT(t, 'impactCalculator.units.lakh', 'L');
  if (num >= 1_00_00_000) return `₹${(num / 1_00_00_000).toFixed(2)} ${cr}`;
  if (num >= 1_00_000) return `₹${(num / 1_00_000).toFixed(2)} ${l}`;
  return `₹${num.toLocaleString('en-IN')}`;
}

export default function ImpactCalculator() {
  const { t } = useTranslation();
  // Safe fallback default slider state values (e.g. 50 needs per year)
  const [needsPerYear, setNeedsPerYear] = useState<number>(50);
  const [avgContractValue, setAvgContractValue] = useState<number>(2500000); // ₹25L default

  const safeNeeds = typeof needsPerYear === 'number' && !isNaN(needsPerYear) && needsPerYear > 0 ? needsPerYear : 50;
  const safeAvgContract = typeof avgContractValue === 'number' && !isNaN(avgContractValue) && avgContractValue > 0 ? avgContractValue : 2500000;

  const results = useMemo(() => {
    const daysSavedPerNeed = TRADITIONAL_CYCLE_DAYS - PILOTGOV_CYCLE_DAYS;
    const totalDaysSaved = daysSavedPerNeed * safeNeeds;

    const traditionalOverhead = safeAvgContract * TRADITIONAL_OVERHEAD_PCT;
    const pilotgovOverhead = safeAvgContract * PILOTGOV_OVERHEAD_PCT;
    const costSavedPerNeed = traditionalOverhead - pilotgovOverhead;
    const totalCostSaved = costSavedPerNeed * safeNeeds;

    const cycleSpeedupMultiple = PILOTGOV_CYCLE_DAYS > 0 ? TRADITIONAL_CYCLE_DAYS / PILOTGOV_CYCLE_DAYS : 6;

    return {
      totalDaysSaved,
      totalCostSaved,
      cycleSpeedupMultiple,
      pilotgovCycleDays: PILOTGOV_CYCLE_DAYS,
      traditionalCycleDays: TRADITIONAL_CYCLE_DAYS,
      pilotgovDays: PILOTGOV_CYCLE_DAYS,
      traditionalDays: TRADITIONAL_CYCLE_DAYS,
    };
  }, [safeNeeds, safeAvgContract]);

  return (
    <section id="impact" className="relative py-24 px-6 overflow-hidden" data-section="impact-calculator">
      {/* soft ambient glow, consistent with the rest of the dark theme */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold tracking-wide text-emerald-400 uppercase">
            <Calculator className="h-3.5 w-3.5" />
            {safeT(t, 'impactCalculator.badge', safeT(t, 'calculator.eyebrow', 'Impact Calculator'))}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-white">
            {safeT(t, 'impact.title', safeT(t, 'impactCalculator.title', safeT(t, 'calculator.title', 'Impact & Savings Calculator')))}
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {safeT(
              t,
              'impactCalculator.subtitle',
              safeT(
                t,
                'calculator.subtitle',
                "Estimate the time and cost impact of routing procurement needs through PilotGov's Identify → Discover → Pilot → Scale pipeline instead of a traditional tender process."
              )
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm shadow-2xl shadow-black/40">
          {/* Inputs */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label htmlFor="needsPerYear" className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  {safeT(t, 'impactCalculator.needsPerYearLabel', safeT(t, 'calculator.sliderLabel', 'Procurement needs posted per year'))}
                </label>
                <span className="text-emerald-400 font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 tabular-nums">
                  {safeNeeds}
                </span>
              </div>
              <input
                id="needsPerYear"
                type="range"
                min={1}
                max={100}
                step={1}
                value={safeNeeds}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setNeedsPerYear(isNaN(val) ? 50 : val);
                }}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1.5">
                <span>1</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label htmlFor="avgContractValue" className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-emerald-400" />
                  {safeT(t, 'impactCalculator.avgContractValueLabel', 'Avg. contract value per need')}
                </label>
                <span className="text-emerald-400 font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 tabular-nums">
                  {formatINR(safeAvgContract, t)}
                </span>
              </div>
              <input
                id="avgContractValue"
                type="range"
                min={100000}
                max={50000000}
                step={100000}
                value={safeAvgContract}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAvgContractValue(isNaN(val) ? 2500000 : val);
                }}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1.5">
                <span>₹1 {safeT(t, 'impactCalculator.units.lakh', 'Lakh')}</span>
                <span>₹25 {safeT(t, 'impactCalculator.units.lakh', 'Lakh')}</span>
                <span>₹5 {safeT(t, 'impactCalculator.units.crore', 'Crore')}</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
              <p className="text-xs text-white/45 leading-relaxed">
                {safeT(
                  t,
                  'impactCalculator.benchmarksNote',
                  `Based on an average traditional tender cycle of ${results.traditionalCycleDays} days vs. a PilotGov cycle of ${results.pilotgovDays} days, and typical administrative overhead reduction from streamlined, startup-friendly procurement.`,
                  {
                    traditionalDays: results.traditionalCycleDays,
                    pilotgovDays: results.pilotgovCycleDays,
                  }
                )}
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-400/80 mb-2">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>{safeT(t, 'impactCalculator.timeSavedTitle', safeT(t, 'calculator.timeSavedTitle', 'Time Saved / Year'))}</span>
              </div>
              <p className="text-2xl font-bold text-white tabular-nums">
                {safeT(t, 'impactCalculator.daysValue', `${results.totalDaysSaved.toLocaleString('en-IN')} days`, {
                  days: results.totalDaysSaved.toLocaleString('en-IN'),
                })}
              </p>
              <p className="text-xs text-white/40 mt-1">
                {safeT(t, 'impactCalculator.timeSavedMonths', `≈ ${(results.totalDaysSaved / 30).toFixed(1)} months across all needs`, {
                  months: (results.totalDaysSaved / 30).toFixed(1),
                })}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-400/80 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>{safeT(t, 'impactCalculator.costSavedTitle', safeT(t, 'calculator.costSavingsTitle', 'Cost Saved / Year'))}</span>
              </div>
              <p className="text-2xl font-bold text-white tabular-nums">
                {formatINR(results.totalCostSaved, t)}
              </p>
              <p className="text-xs text-white/40 mt-1">
                {safeT(t, 'impactCalculator.costSavedNote', safeT(t, 'calculator.costSavingsSubtitle', 'from reduced process overhead'))}
              </p>
            </div>

            <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/50 mb-2">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>{safeT(t, 'impactCalculator.cycleSpeedTitle', safeT(t, 'calculator.velocityTitle', 'Procurement Cycle Speed'))}</span>
              </div>
              <p className="text-2xl font-bold text-white tabular-nums flex items-center gap-2">
                <span>
                  {safeT(t, 'impactCalculator.cycleSpeedValue', `${results.cycleSpeedupMultiple.toFixed(1)}x faster`, {
                    multiple: results.cycleSpeedupMultiple.toFixed(1),
                  })}
                </span>
                <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  45 vs 270 days
                </span>
              </p>
              <p className="text-xs text-white/40 mt-1.5">
                {safeT(
                  t,
                  'impactCalculator.cycleSpeedNote',
                  `${results.traditionalCycleDays} days → ${results.pilotgovDays} days per need`,
                  {
                    traditionalDays: results.traditionalCycleDays,
                    pilotgovDays: results.pilotgovCycleDays,
                  }
                )}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/30 mt-6">
          {safeT(
            t,
            'impactCalculator.disclaimer',
            'Figures are illustrative projections based on typical public procurement benchmarks, not guaranteed outcomes.'
          )}
        </p>
      </div>
    </section>
  );
}
