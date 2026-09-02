import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Star,
  Building2,
  Rocket,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
  WifiOff,
  Sparkles,
  MessageSquareQuote,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { stagger, staggerItem } from '@/lib/motion';
import { Review, fallbackReviews } from '@/lib/data';
import { api, ApiError } from '@/lib/api';

interface PublicReviewsProps {
  onRefresh?: () => void;
  className?: string;
}

export default function PublicReviews({ className = '' }: PublicReviewsProps) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await api<Review[]>('/reviews');
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
        setUsingFallback(false);
      } else if (Array.isArray(data) && data.length === 0) {
        setReviews([]);
        setUsingFallback(false);
      } else {
        setReviews(fallbackReviews);
        setUsingFallback(true);
      }
    } catch (err) {
      if (err instanceof ApiError || err instanceof TypeError || err instanceof Error) {
        setReviews(fallbackReviews);
        setUsingFallback(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 30) return `${diffInDays} days ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const visibleReviews = reviews.slice(0, visibleCount);

  return (
    <section
      id="public-reviews"
      className={`relative py-28 px-6 border-t border-white/5 ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-3xl mb-14"
        >
          <motion.span
            variants={staggerItem}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald2-400 flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t('reviews.eyebrow')}
          </motion.span>
          <motion.h2
            variants={staggerItem}
            className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white"
          >
            {t('reviews.title')}
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="mt-4 text-lg text-white/50 leading-relaxed"
          >
            {t('reviews.subtitle')}
          </motion.p>
        </motion.div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2 mb-6 text-xs text-white/30">
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t('reviews.fetching')}</span>
            </>
          ) : usingFallback ? (
            <>
              <WifiOff className="h-3.5 w-3.5 text-amber-400/70" />
              <span className="text-amber-400/70">{t('reviews.offline')}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald2-400" />
              <span className="text-emerald2-400">{t('reviews.live')}</span>
            </>
          )}
        </div>

        {/* Reviews Grid / Feed */}
        {loading && reviews.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/5 bg-ink-850/50 p-6 space-y-4 animate-pulse"
              >
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-5 bg-white/10 rounded w-3/4" />
                <div className="h-16 bg-white/5 rounded" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-ink-850 p-12 text-center max-w-lg mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mx-auto mb-4">
              <MessageSquareQuote className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-white">
              {t('reviews.noReviews')}
            </h3>
            <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
              {t('reviews.subtitle')}
            </p>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {visibleReviews.map((rev) => {
              const contractTitle =
                rev.contract?.title || rev.contractTitle || 'Public Sector Innovation Pilot';
              const dept =
                rev.contract?.dept || rev.dept || 'Government Department';
              const startup =
                rev.contract?.startup || rev.startup || 'Vetted Startup';
              const citizenName =
                rev.citizen?.name || rev.citizenName || 'Verified Citizen';

              return (
                <motion.div
                  key={rev.id}
                  variants={staggerItem}
                  className="rounded-2xl border border-white/10 bg-ink-850 p-6 sm:p-7 shadow-2xl shadow-black/40 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Rating Stars & Relative Date */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-white/20'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-semibold text-amber-400/90 ml-1.5 tabular-nums">
                          {rev.rating}.0
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-white/35">
                        <Calendar className="h-3 w-3" />
                        <span>{formatRelativeTime(rev.createdAt)}</span>
                      </div>
                    </div>

                    {/* Contract Title & Department / Startup Meta */}
                    <h3 className="text-base font-semibold text-white leading-snug mb-2">
                      {contractTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-white/45 mb-4">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-white/30 shrink-0" />
                        <span className="truncate max-w-[200px]">{dept}</span>
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="flex items-center gap-1 text-emerald2-400/85">
                        <Rocket className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[160px]">{startup}</span>
                      </span>
                    </div>

                    {/* Citizen Comment */}
                    <p className="text-sm text-white/70 leading-relaxed italic bg-white/[0.02] border border-white/5 rounded-xl p-3.5 mb-4">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Footer: Citizen identity */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-emerald2-500/10 border border-emerald2-500/20 text-emerald2-400 flex items-center justify-center text-[10px] font-semibold">
                        {citizenName[0]?.toUpperCase() || 'C'}
                      </span>
                      <span className="font-medium text-white/80">{citizenName}</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald2-400/80 bg-emerald2-500/10 border border-emerald2-500/20 rounded-full px-2 py-0.5">
                      {t('reviews.verifiedCitizen')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination Controls */}
        {reviews.length > visibleCount && (
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="mt-6 w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-3 px-4 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
          >
            <ChevronDown className="h-4 w-4" />
            <span>{t('reviews.seeMore', { count: reviews.length - visibleCount })}</span>
          </button>
        )}

        {visibleCount >= reviews.length && reviews.length > 4 && (
          <button
            type="button"
            onClick={() => setVisibleCount(4)}
            className="mt-6 w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-3 px-4 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
          >
            <ChevronUp className="h-4 w-4" />
            <span>{t('reviews.showLess')}</span>
          </button>
        )}
      </div>
    </section>
  );
}
