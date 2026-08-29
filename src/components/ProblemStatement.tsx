import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { stagger, staggerItem } from '@/lib/motion';
import { statValues } from '@/lib/data';

export default function ProblemStatement() {
  const { t } = useTranslation();

  const stats = statValues.map((value, i) => ({
    value,
    label: t(`problem.stat${i + 1}Label`),
    note: t(`problem.stat${i + 1}Note`),
  }));

  return (
    <section className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl mb-14"
        >
          <motion.span
            variants={staggerItem}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald2-400"
          >
            {t('problem.eyebrow')}
          </motion.span>
          <motion.h2
            variants={staggerItem}
            className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight"
          >
            {t('problem.title')}
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="mt-4 text-lg text-white/50 leading-relaxed"
          >
            {t('problem.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={staggerItem}
              className="group relative rounded-xl2 border border-white/[0.07] bg-ink-850 p-8 card-sheen hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-xl2 bg-gradient-to-b from-emerald2-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <p className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
                  {s.value}
                </p>
                <p className="mt-4 text-sm text-white/55 leading-relaxed">
                  {s.label}
                </p>
                <div className="mt-6 pt-5 border-t border-white/5">
                  <p className="text-xs text-white/30">{s.note}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
