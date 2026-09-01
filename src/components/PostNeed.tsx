import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, Loader2, WifiOff, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { stagger, staggerItem } from '@/lib/motion';
import { api, ApiError } from '@/lib/api';
import { departments } from '@/lib/departments';

interface Need {
  id: string;
  dept: string;
  title: string;
  description: string;
  budget: string;
  domain: string;
  postedAt: string;
  status: 'Open' | 'Matching' | 'Closed';
}

const FALLBACK_NEEDS: Need[] = [
  {
    id: 'seed-1',
    dept: 'Dept. of Rural Development',
    title: 'Vernacular e-learning for 240 village schools',
    description:
      'Need an offline-capable, mother-tongue learning platform deployable across low-connectivity village schools.',
    budget: '₹48L',
    domain: 'EdTech',
    postedAt: '2026-03-02T00:00:00.000Z',
    status: 'Matching',
  },
];

const domains = ['AgriTech', 'CleanTech', 'HealthTech', 'Smart Mobility', 'EdTech'];

interface PostNeedProps {
  onNeedCreated?: (need: { id: string; title: string; dept?: string; budget?: string; domain?: string }) => void;
}

export default function PostNeed({ onNeedCreated }: PostNeedProps = {}) {
  const { t } = useTranslation();
  const [needs, setNeeds] = useState<Need[]>(FALLBACK_NEEDS);
  const [usingFallback, setUsingFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const [form, setForm] = useState({
    dept: '',
    title: '',
    description: '',
    budget: '',
    domain: domains[0],
  });

  // Department autocomplete
  const [deptSuggestions, setDeptSuggestions] = useState<string[]>([]);
  const [showDeptSuggestions, setShowDeptSuggestions] = useState(false);
  const deptFieldRef = useRef<HTMLDivElement>(null);

  const handleDeptChange = (value: string) => {
    setForm({ ...form, dept: value });
    if (value.trim().length === 0) {
      setDeptSuggestions([]);
      setShowDeptSuggestions(false);
      return;
    }
    const filtered = departments.filter((d) => d.toLowerCase().includes(value.toLowerCase()));
    setDeptSuggestions(filtered);
    setShowDeptSuggestions(filtered.length > 0);
  };

  const selectDept = (dept: string) => {
    setForm({ ...form, dept });
    setDeptSuggestions([]);
    setShowDeptSuggestions(false);
  };

  // Close suggestions when clicking outside the field
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (deptFieldRef.current && !deptFieldRef.current.contains(e.target as Node)) {
        setShowDeptSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api<Need[]>('/identify/needs');
      setNeeds(data);
      setUsingFallback(false);
    } catch (err) {
      if (err instanceof ApiError || err instanceof TypeError) {
        setNeeds(FALLBACK_NEEDS);
        setUsingFallback(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.dept || !form.title || !form.description || !form.budget) return;

    setSubmitting(true);
    try {
      const created = await api<Need>('/identify/needs', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setNeeds((prev) => [created, ...prev]);
      setVisibleCount(3);
      setUsingFallback(false);
      setForm({ dept: '', title: '', description: '', budget: '', domain: domains[0] });
      onNeedCreated?.({
        id: created.id,
        title: created.title,
        dept: created.dept,
        budget: created.budget,
        domain: created.domain,
      });
    } catch {
      // Backend not reachable — still show it locally so the demo doesn't stall
      const localNeed: Need = {
        ...form,
        id: `local-${Date.now()}`,
        postedAt: new Date().toISOString(),
        status: 'Open',
      };
      setNeeds((prev) => [localNeed, ...prev]);
      setVisibleCount(3);
      setUsingFallback(true);
      setForm({ dept: '', title: '', description: '', budget: '', domain: domains[0] });
      onNeedCreated?.({
        id: localNeed.id,
        title: localNeed.title,
        dept: localNeed.dept,
        budget: localNeed.budget,
        domain: localNeed.domain,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const visibleNeeds = needs.slice(0, visibleCount);

  return (
    <section id="post-need" className="relative py-28 px-6 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl mb-14"
        >
          <motion.span variants={staggerItem} className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald2-400">
            {t('postNeed.eyebrow')}
          </motion.span>
          <motion.h2 variants={staggerItem} className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            {t('postNeed.title')}
          </motion.h2>
          <motion.p variants={staggerItem} className="mt-4 text-lg text-white/50 leading-relaxed">
            {t('postNeed.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-5 rounded-2xl border border-white/10 bg-ink-850 p-6 sm:p-8 space-y-4 shadow-2xl shadow-black/40"
          >
            <motion.div variants={staggerItem} className="relative" ref={deptFieldRef}>
              <label className="text-xs text-white/40 mb-1.5 block">{t('postNeed.labelDept')}</label>
              <input
                value={form.dept}
                onChange={(e) => handleDeptChange(e.target.value)}
                onFocus={() => form.dept.trim().length > 0 && setShowDeptSuggestions(deptSuggestions.length > 0)}
                placeholder={t('postNeed.placeholderDept')}
                autoComplete="off"
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors"
              />
              {showDeptSuggestions && (
                <div className="absolute z-10 mt-1.5 w-full rounded-lg border border-white/10 bg-ink-900 shadow-2xl shadow-black/50 overflow-hidden">
                  {deptSuggestions.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => selectDept(d)}
                      className="w-full text-left px-3 py-2.5 text-sm text-white/80 hover:bg-white/[0.06] hover:text-white transition-colors border-b border-white/5 last:border-b-0"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="text-xs text-white/40 mb-1.5 block">{t('postNeed.labelTitle')}</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t('postNeed.placeholderTitle')}
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="text-xs text-white/40 mb-1.5 block">{t('postNeed.labelDescription')}</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={t('postNeed.placeholderDescription')}
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors resize-none"
              />
            </motion.div>

            <motion.div variants={staggerItem} className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">{t('postNeed.labelBudget')}</label>
                <input
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder={t('postNeed.placeholderBudget')}
                  className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">{t('postNeed.labelDomain')}</label>
                <select
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald2-500/40 transition-colors"
                >
                  {domains.map((d) => (
                    <option key={d} value={d} className="bg-ink-950">
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            <motion.button
              variants={staggerItem}
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {t('postNeed.submit')}
            </motion.button>
          </motion.form>

          {/* Posted needs list */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-2 mb-3 text-xs text-white/30">
              {loading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> {t('postNeed.fetching')}
                </>
              ) : usingFallback ? (
                <>
                  <WifiOff className="h-3 w-3 text-amber-400/70" />
                  <span className="text-amber-400/70">{t('postNeed.offline')}</span>
                </>
              ) : (
                <span className="text-emerald2-400">{t('postNeed.live')}</span>
              )}
            </div>

            <div className="space-y-3">
              {visibleNeeds.map((n) => (
                <motion.div
                  key={n.id}
                  variants={staggerItem}
                  className="rounded-xl border border-white/[0.07] bg-ink-850 p-5 hover:border-white/15 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Building2 className="h-3.5 w-3.5 text-white/30" />
                        <span className="text-xs text-white/40">{n.dept}</span>
                      </div>
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs text-white/45 mt-1.5 leading-relaxed">{n.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-emerald2-500/25 bg-emerald2-500/10 text-emerald2-400 px-2.5 py-1 text-[10px] font-medium">
                      {n.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5 text-xs text-white/30">
                    <span>{n.domain}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="font-semibold text-white/60">{n.budget}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* See more / Show less buttons */}
            {needs.length > visibleCount && (
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] py-2.5 px-4 text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
              >
                <ChevronDown className="h-3.5 w-3.5" />
                <span>{t('postNeed.seeMore', { count: needs.length - visibleCount })}</span>
              </button>
            )}

            {visibleCount >= needs.length && needs.length > 3 && (
              <button
                type="button"
                onClick={() => setVisibleCount(3)}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] py-2.5 px-4 text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
              >
                <ChevronUp className="h-3.5 w-3.5" />
                <span>{t('postNeed.showLess')}</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
