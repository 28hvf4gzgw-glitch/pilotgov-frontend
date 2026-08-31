import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Building2, Rocket } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-emerald2-500/15 blur-[140px] animate-glow" />
        <div className="absolute right-[15%] top-[55%] h-[300px] w-[300px] rounded-full bg-sky-500/10 blur-[120px]" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-5xl px-6 text-center"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/70 mb-8 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald2-400 animate-pulse" />
          {t('hero.badge')}
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-semibold tracking-tight leading-[1.05] text-white"
        >
          {t('hero.titleLine1')}
          <br className="hidden sm:block" />{' '}
          <span className="text-emerald2-400">{t('hero.titleLine2')}</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/55 leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#for-government"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-white/90 transition-all hover:shadow-xl hover:shadow-white/10"
          >
            <Building2 className="h-4 w-4" />
            {t('hero.ctaDept')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#for-startups"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.07] transition-all backdrop-blur-sm"
          >
            <Rocket className="h-4 w-4" />
            {t('hero.ctaStartup')}
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-16 flex items-center justify-center gap-8 text-xs text-white/30"
        >
          <span>{t('hero.trust1')}</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>{t('hero.trust2')}</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>{t('hero.trust3')}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
