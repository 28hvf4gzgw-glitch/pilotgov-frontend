import { motion } from 'framer-motion';
import { Landmark, ArrowRight } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';

const columns = [
  {
    title: 'Product',
    links: ['How it works', 'Discovery', 'Pilot tracker', 'Outcomes dashboard'],
  },
  {
    title: 'Government',
    links: ['For departments', 'Compliance', 'Security', 'Case studies'],
  },
  {
    title: 'Startups',
    links: ['Apply to join', 'Eligibility', 'Pilot playbook', 'Success stories'],
  },
  {
    title: 'About',
    links: ['Mission', 'Team', 'Press', 'Contact'],
  },
];

export default function Footer() {
  return (
    <footer id="get-started" className="relative border-t border-white/5 bg-ink-900/50">
      {/* CTA band */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mx-auto max-w-7xl px-6 py-20 border-b border-white/5"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <motion.div variants={fadeUp} className="text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Ready to pilot what's next?
            </h3>
            <p className="mt-3 text-white/50 max-w-md">
              Join the departments and startups building a faster path from
              idea to public impact.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <a
              href="#"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-white/90 transition-all hover:shadow-xl hover:shadow-white/10"
            >
              Book a Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.07] transition-all"
            >
              Read the docs
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Link columns */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald2-500 text-ink-950">
                <Landmark className="h-4.5 w-4.5" strokeWidth={2.4} />
              </span>
              <span className="text-[17px] font-semibold tracking-tight text-white">
                Pilot<span className="text-emerald2-400">Gov</span>
              </span>
            </a>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              A startup-friendly public procurement mechanism.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2026 PilotGov. A public-sector innovation initiative.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
