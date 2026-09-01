import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Baseline assumptions for traditional (non-PilotGov) public procurement,
// used only to compute a relative "time/cost saved" projection.
const TRADITIONAL_CYCLE_DAYS = 270; // avg. months-long tender cycle
const TRADITIONAL_OVERHEAD_PCT = 0.18; // admin/process overhead as % of contract value
const PILOTGOV_CYCLE_DAYS = 45; // Identify -> Discover -> Pilot -> Scale, avg.
const PILOTGOV_OVERHEAD_PCT = 0.06;

function formatINR(value: number, t: (key: string, options?: Record<string, unknown>) => string) {
  const cr = t('impactCalculator.units.crore', { defaultValue: 'Cr' });
  const l = t('impactCalculator.units.lakh', { defaultValue: 'L' });
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} ${cr}`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} ${l}`;
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function ImpactCalculator() {
  const { t } = useTranslation();
  const [needsPerYear, setNeedsPerYear] = useState(12);
  const [avgContractValue, setAvgContractValue] = useState(2500000); // ₹25L default

  const results = useMemo(() => {
    const daysSavedPerNeed = TRADITIONAL_CYCLE_DAYS - PILOTGOV_CYCLE_DAYS;
    const totalDaysSaved = daysSavedPerNeed * needsPerYear;

    const traditionalOverhead = avgContractValue * TRADITIONAL_OVERHEAD_PCT;
    const pilotgovOverhead = avgContractValue * PILOTGOV_OVERHEAD_PCT;
    const costSavedPerNeed = traditionalOverhead - pilotgovOverhead;
    const totalCostSaved = costSavedPerNeed * needsPerYear;

    const cycleSpeedupMultiple = TRADITIONAL_CYCLE_DAYS / PILOTGOV_CYCLE_DAYS;

    return {
      totalDaysSaved,
      totalCostSaved,
      cycleSpeedupMultiple,
      pilotgovCycleDays: PILOTGOV_CYCLE_DAYS,
      traditionalCycleDays: TRADITIONAL_CYCLE_DAYS,
    };
  }, [needsPerYear, avgContractValue]);

  return (
    <section id="impact-calculator" className="relative py-24 px-6 overflow-hidden">
      {/* soft ambient glow, consistent with the rest of the dark theme */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-medium tracking-wide text-emerald-400 uppercase">
            {t('impactCalculator.badge')}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-white">
            {t('impactCalculator.title')}
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl mx-auto">
            {t('impactCalculator.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
          {/* Inputs */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="needsPerYear" className="text-sm font-medium text-white/80">
                  {t('impactCalculator.needsPerYearLabel')}
                </label>
                <span className="text-emerald-400 font-semibold">{needsPerYear}</span>
              </div>
              <input
                id="needsPerYear"
                type="range"
                min={1}
                max={100}
                step={1}
                value={needsPerYear}
                onChange={(e) => setNeedsPerYear(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>1</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="avgContractValue" className="text-sm font-medium text-white/80">
                  {t('impactCalculator.avgContractValueLabel')}
                </label>
                <span className="text-emerald-400 font-semibold">
                  {formatINR(avgContractValue, t)}
                </span>
              </div>
              <input
                id="avgContractValue"
                type="range"
                min={100000}
                max={50000000}
                step={100000}
                value={avgContractValue}
                onChange={(e) => setAvgContractValue(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>₹1 {t('impactCalculator.units.lakh')}</span>
                <span>₹5 {t('impactCalculator.units.crore')}</span>
              </div>
            </div>

            <p className="text-xs text-white/40 leading-relaxed">
              {t('impactCalculator.benchmarksNote', {
                traditionalDays: results.traditionalCycleDays,
                pilotgovDays: results.pilotgovCycleDays,
              })}
            </p>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-xs uppercase tracking-wide text-emerald-400/80 mb-2">
                {t('impactCalculator.timeSavedTitle')}
              </p>
              <p className="text-2xl font-bold text-white">
                {t('impactCalculator.daysValue', {
                  days: results.totalDaysSaved.toLocaleString('en-IN'),
                })}
              </p>
              <p className="text-xs text-white/40 mt-1">
                {t('impactCalculator.timeSavedMonths', {
                  months: (results.totalDaysSaved / 30).toFixed(1),
                })}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-xs uppercase tracking-wide text-emerald-400/80 mb-2">
                {t('impactCalculator.costSavedTitle')}
              </p>
              <p className="text-2xl font-bold text-white">
                {formatINR(results.totalCostSaved, t)}
              </p>
              <p className="text-xs text-white/40 mt-1">{t('impactCalculator.costSavedNote')}</p>
            </div>

            <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-xs uppercase tracking-wide text-white/50 mb-2">
                {t('impactCalculator.cycleSpeedTitle')}
              </p>
              <p className="text-2xl font-bold text-white">
                {t('impactCalculator.cycleSpeedValue', {
                  multiple: results.cycleSpeedupMultiple.toFixed(1),
                })}
              </p>
              <p className="text-xs text-white/40 mt-1">
                {t('impactCalculator.cycleSpeedNote', {
                  traditionalDays: results.traditionalCycleDays,
                  pilotgovDays: results.pilotgovCycleDays,
                })}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/30 mt-6">
          {t('impactCalculator.disclaimer')}
        </p>
      </div>
    </section>
  );
}
