import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Loader2, WifiOff, ArrowRightCircle } from 'lucide-react';
import { stagger, staggerItem } from '@/lib/motion';
import { pilotColumns as fallbackColumns, PilotCard } from '@/lib/data';
import { api, ApiError } from '@/lib/api';

interface PilotColumn {
  status: string;
  accent: string;
  cards: PilotCard[];
}

export default function PilotTracker() {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<PilotColumn[]>(fallbackColumns);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api<PilotColumn[]>('/pilot/pipeline');
      setColumns(data);
      setUsingFallback(false);
    } catch (err) {
      if (err instanceof ApiError || err instanceof TypeError) {
        setColumns(fallbackColumns);
        setUsingFallback(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const advance = async (cardTitle: string) => {
    if (usingFallback) return; // demo action needs a live backend
    try {
      const updated = await api<PilotColumn[]>('/pilot/advance', {
        method: 'PATCH',
        body: JSON.stringify({ cardTitle }),
      });
      setColumns(updated);
    } catch {
      // silently ignore for the demo — board just won't update
    }
  };

  return (
    <section id="for-startups" className="relative py-28 px-6 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl mb-14 flex items-start justify-between gap-6"
        >
          <div>
            <motion.span variants={staggerItem} className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald2-400">
              {t('pilot.eyebrow')}
            </motion.span>
            <motion.h2 variants={staggerItem} className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {t('pilot.title')}
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-lg text-white/50 leading-relaxed">
              {t('pilot.subtitle')}
            </motion.p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 mb-4 text-xs text-white/30">
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> {t('pilot.fetching')}
            </>
          ) : usingFallback ? (
            <>
              <WifiOff className="h-3 w-3 text-amber-400/70" />
              <span className="text-amber-400/70">{t('pilot.offline')}</span>
            </>
          ) : (
            <span className="text-emerald2-400">{t('pilot.live')}</span>
          )}
        </div>

        {/* Kanban board */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="rounded-2xl border border-white/10 bg-ink-850 p-5 sm:p-6 shadow-2xl shadow-black/40 overflow-x-auto scrollbar-thin"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[860px]">
            {columns.map((col) => (
              <motion.div key={col.status} variants={staggerItem} className="rounded-xl bg-ink-900/60 border border-white/5 p-4">
                {/* Column header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${col.accent.replace('text-', 'bg-')}`} />
                    <span className="text-sm font-semibold text-white">{t(`pilot.columns.${col.status}`, col.status)}</span>
                  </div>
                  <span className="text-xs text-white/30 tabular-nums">{col.cards.length}</span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {col.cards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-lg border border-white/[0.07] bg-ink-850 p-4 hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <p className="text-sm font-medium text-white leading-snug">{card.title}</p>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-[10px] font-semibold text-white/70">
                          {card.startup[0]}
                        </span>
                        <span className="text-xs text-white/50">{card.startup}</span>
                      </div>
                      <p className="text-xs text-white/35 mb-3">{card.dept}</p>

                      {/* Progress bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-white/30">{t('pilot.progress')}</span>
                          <span className="text-[10px] text-white/40 tabular-nums">{card.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${card.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                            className={`h-full rounded-full ${col.accent.replace('text-', 'bg-')}`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[10px] text-white/30 flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {card.date}
                        </span>
                        <span className="text-xs font-semibold text-white/80 tabular-nums">{card.budget}</span>
                      </div>

                      {col.status !== 'Completed' && (
                        <button
                          onClick={() => advance(card.title)}
                          disabled={usingFallback}
                          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-white/60 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowRightCircle className="h-3 w-3" />
                          {t('pilot.advanceStage')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
