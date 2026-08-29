import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { departments } from '@/lib/data';
import { fadeIn } from '@/lib/motion';

export default function PartnerStrip() {
  const { t } = useTranslation();
  const doubled = [...departments, ...departments];

  return (
    <section className="relative py-14 border-y border-white/5 bg-ink-900/50">
      <motion.p
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/30 mb-8"
      >
        {t('partnerStrip.trustedBy')}
      </motion.p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
        <div className="flex w-max animate-marquee gap-10">
          {doubled.map((d, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2.5 text-white/40 hover:text-white/70 transition-colors"
            >
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium whitespace-nowrap">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
