import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Star,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  X,
  MessageSquareQuote,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, ApiError } from '@/lib/api';

export interface ReviewFormProps {
  scaledContractId: string;
  contractTitle?: string;
  dept?: string;
  startup?: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  scaledContractId,
  contractTitle,
  dept,
  startup,
  onSubmitted,
  onCancel,
}: ReviewFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isCitizen = user?.role === 'CITIZEN';

  const starLabels: Record<number, string> = {
    1: t('reviews.stars1', '1 - Poor'),
    2: t('reviews.stars2', '2 - Fair'),
    3: t('reviews.stars3', '3 - Good'),
    4: t('reviews.stars4', '4 - Very Good'),
    5: t('reviews.stars5', '5 - Excellent'),
  };

  const currentRating = hoverRating !== null ? hoverRating : rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCitizen || submitting || success) return;
    if (!comment.trim()) return;

    // Immediately disable submit button to prevent duplicate submissions
    setSubmitting(true);
    setError(null);

    try {
      await api('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          scaledContractId,
          rating,
          comment: comment.trim(),
        }),
      });

      setSuccess(true);
      if (onSubmitted) {
        onSubmitted();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (
          err.status === 409 ||
          err.message?.toLowerCase().includes('already') ||
          err.message?.toLowerCase().includes('duplicate')
        ) {
          setError(t('reviews.alreadyReviewed', "You've already reviewed this pilot"));
        } else {
          setError(err.message || t('reviews.alreadyReviewed'));
        }
      } else if (err instanceof Error) {
        if (err.message.toLowerCase().includes('already')) {
          setError(t('reviews.alreadyReviewed', "You've already reviewed this pilot"));
        } else {
          setError(err.message);
        }
      } else {
        setError(t('reviews.alreadyReviewed'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isCitizen) {
    return (
      <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 sm:p-7 shadow-2xl relative text-left">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="absolute right-4 top-4 p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
              {t('auth.citizen')} • {t('reviews.eyebrow')}
            </span>
            <h3 className="text-base font-semibold text-white mt-1 leading-snug">
              {t('reviews.loginAsCitizen')}
            </h3>
          </div>
        </div>

        <p className="text-xs text-white/50 leading-relaxed mt-3">
          {user
            ? `${t('auth.loggedInAs')} ${user.name} (${user.role}). ${t('reviews.loginAsCitizen')}`
            : t('reviews.subtitle')}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-ink-950 hover:bg-white/90 transition-all shadow-md"
          >
            <span>{user ? t('auth.switchAccount') : t('reviews.loginAsCitizen')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 text-xs text-white/60 hover:text-white transition-colors"
            >
              {t('reviews.cancel')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-850 p-6 sm:p-7 shadow-2xl relative text-left">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald2-400 flex items-center gap-1.5">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            {t('reviews.rateThisPilot')}
          </span>
          <h3 className="text-base font-semibold text-white mt-1 leading-snug">
            {contractTitle || t('reviews.leaveReview')}
          </h3>
          {(dept || startup) && (
            <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
              {dept && <span>{dept}</span>}
              {dept && startup && <span>•</span>}
              {startup && <span className="text-emerald2-400/80">{startup}</span>}
            </div>
          )}
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-4 flex items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald2-500/10 border border-emerald2-500/25 text-emerald2-300 text-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald2-400 shrink-0" />
              <span className="font-medium">{t('reviews.submitted')}</span>
            </div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-emerald2-400 hover:underline font-semibold"
              >
                {t('reviews.cancel')}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="my-4 flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs"
          >
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!success && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Star Rating Picker */}
          <div>
            <label className="text-xs font-medium text-white/60 mb-2 block">
              {t('reviews.rating')} *
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/[0.03] border border-white/10 w-fit">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= currentRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      disabled={submitting}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 rounded-lg transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/20 hover:text-white/40'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-amber-400/90 font-medium pl-2">
                {starLabels[currentRating] || `${currentRating} Stars`}
              </span>
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">
              {t('reviews.comment')} *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={submitting}
              placeholder={t('reviews.commentPlaceholder')}
              className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors resize-none disabled:opacity-50"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[11px] text-white/30">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald2-400/70" />
              <span>{user?.name || t('reviews.verifiedCitizen')}</span>
            </div>

            <div className="flex items-center gap-2.5">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={submitting}
                  className="px-3 py-2 text-xs font-medium text-white/60 hover:text-white transition-colors disabled:opacity-40"
                >
                  {t('reviews.cancel')}
                </button>
              )}
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-ink-950 hover:bg-white/90 transition-all disabled:opacity-50 shadow-md shadow-white/10"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-950" />
                    <span>{t('reviews.submitting')}</span>
                  </>
                ) : (
                  <span>{t('reviews.submitReview')}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
