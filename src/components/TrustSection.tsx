import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Minus, Zap, ArrowRight } from 'lucide-react';
import { stagger, staggerItem } from '@/lib/motion';
import { outcomeData } from '@/lib/data';

const barWidths: Record<string, number> = {
  'Cost savings vs traditional vendor': 34,
  'Time-to-deploy (PilotGov)': 25,
  'Pilot success rate': 78,
  'Scaled to full contract': 64,
};

export default function TrustSection() {
  const { t } = useTranslation();
  return (
    <section id="trust" className="relative py-28 px-6 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid lg:grid-cols-12 gap-12 items-center"
        >
          {/* Chart card */}
          <motion.div variants={staggerItem} className="lg:col-span-7 order-2 lg:order-1">
            <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 sm:p-8 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald2-500/10 text-emerald2-400">
                    <BarChart3 className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-white">{t('trust.dashboardTitle')}</span>
                </div>
                <span className="text-xs text-white/30">{t('trust.live')}</span>
              </div>

              <div className="space-y-6">
                {outcomeData.map((d, i) => {
                  const width = barWidths[d.label] ?? Math.min(d.value, 100);
                  const isSavings = d.delta.startsWith('+34');
                  const isTime = d.label.includes('Time-to-deploy');
                  return (
                    <motion.div
                      key={d.label}
                      variants={staggerItem}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/60">{t(`trust.outcomeLabels.${d.label}`, d.label)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white tabular-nums">
                            {isTime ? '45' : d.value}
                            <span className="text-white/40 text-xs ml-0.5">{isTime ? t('trust.days') : d.unit}</span>
                          </span>
                          {isSavings || d.delta.startsWith('+') ? (
                            <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald2-400">
                              <TrendingUp className="h-3 w-3" />
                              {d.delta}
                            </span>
                          ) : isTime ? (
                            <span className="flex items-center gap-0.5 text-[10px] font-medium text-sky-400">
                              <Zap className="h-3 w-3" />
                              {d.delta}
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-[10px] font-medium text-white/30">
                              <Minus className="h-3 w-3" />
                              {d.delta}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Time-to-deploy shows a dual comparison bar */}
                      {isTime ? (
                        <div className="space-y-1.5">
                          <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: '25%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                              className="h-full rounded-full bg-gradient-to-r from-emerald2-600 to-emerald2-400"
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-white/30">
                            <span>{t('trust.pilotGovLabel')}</span>
                            <span>{t('trust.traditionalLabel')}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: '100%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 + i * 0.1 }}
                              className="h-full rounded-full bg-white/15"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${width}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald2-600 to-emerald2-400"
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-white/30">
                <span>{t('trust.reportingPeriod')}</span>
                <Link
                  to="/report"
                  className="inline-flex items-center gap-1.5 text-emerald2-400 hover:text-emerald2-300 font-medium transition-colors group"
                >
                  <span>{t('trust.viewFullReport')}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div variants={staggerItem} className="lg:col-span-5 order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald2-400">
              {t('trust.eyebrow')}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
              {t('trust.title')}
            </h2>
            <p className="mt-4 text-lg text-white/50 leading-relaxed">
              {t('trust.subtitle')}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/[0.07] bg-ink-850 p-5">
                <p className="text-2xl font-semibold text-emerald2-400">34%</p>
                <p className="mt-1 text-xs text-white/40">{t('trust.stat1Note')}</p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-ink-850 p-5">
                <p className="text-2xl font-semibold text-white">45 {t('trust.days')}</p>
                <p className="mt-1 text-xs text-white/40">{t('trust.stat2Note')}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
