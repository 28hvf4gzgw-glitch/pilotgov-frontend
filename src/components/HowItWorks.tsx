import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, FlaskConical, BadgeCheck, TrendingUp } from 'lucide-react';
import { stagger, staggerItem } from '@/lib/motion';
import { stepNumbers } from '@/lib/data';

const icons = [Search, FlaskConical, BadgeCheck, TrendingUp];

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = stepNumbers.map((n, i) => ({
    n,
    title: t(`howItWorks.step${i + 1}Title`),
    desc: t(`howItWorks.step${i + 1}Desc`),
  }));

  return (
    <section id="how-it-works" className="relative py-28 px-6 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald2-400">
            {t('howItWorks.eyebrow')}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            {t('howItWorks.title')}
          </h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {steps.map((step, i) => {
            const Icon = icons[i];
            const isLast = i === steps.length - 1;
            return (
              <motion.div
                key={step.n}
                variants={staggerItem}
                className="group relative rounded-xl2 border border-white/[0.07] bg-ink-850 p-7 hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-emerald2-400 group-hover:bg-emerald2-500/10 group-hover:border-emerald2-500/30 transition-all">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-white/20 tabular-nums">
                    {step.n}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {step.desc}
                </p>

                {/* Connector arrow */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                    <div className="h-px w-6 bg-gradient-to-r from-white/15 to-transparent" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
