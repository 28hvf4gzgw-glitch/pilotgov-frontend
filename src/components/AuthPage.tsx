import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Landmark,
  Building2,
  Rocket,
  User as UserIcon,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { ApiError } from '@/lib/api';

interface AuthPageProps {
  defaultMode?: 'login' | 'register';
}

export default function AuthPage({ defaultMode = 'login' }: AuthPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, isLoading } = useAuth();

  const initialMode = searchParams.get('mode') === 'register' ? 'register' : defaultMode;
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('OFFICER');
  const [orgName, setOrgName] = useState('');

  // Status State
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register({
          email: email.trim(),
          password,
          name: name.trim(),
          role,
          ...(role !== 'CITIZEN' && orgName.trim() ? { orgName: orgName.trim() } : {}),
        });
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('auth.authFailed'));
      }
    }
  };

  const roles: { value: UserRole; labelKey: string; icon: typeof Building2; descKey: string }[] = [
    { value: 'OFFICER', labelKey: 'auth.officer', icon: Building2, descKey: 'auth.officerDesc' },
    { value: 'STARTUP', labelKey: 'auth.startup', icon: Rocket, descKey: 'auth.startupDesc' },
    { value: 'CITIZEN', labelKey: 'auth.citizen', icon: UserIcon, descKey: 'auth.citizenDesc' },
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-white flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative selection:bg-emerald2-500/30">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>{t('nav.howItWorks') ? 'PilotGov' : 'Home'}</span>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Main Card Container */}
      <div className="my-auto py-8 max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-white/10 bg-ink-850 p-6 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden"
        >
          {/* Brand & Badge Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald2-500 text-ink-950 shadow-lg shadow-emerald2-500/25 group-hover:scale-105 transition-transform">
                <Landmark className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Pilot<span className="text-emerald2-400">Gov</span>
              </span>
            </Link>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              {mode === 'login' ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 mb-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-ink-950 font-semibold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {t('auth.login')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-ink-950 font-semibold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {t('auth.register')}
            </button>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 flex items-start gap-2.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Banner */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 flex items-center justify-center gap-2 text-xs text-emerald2-300 bg-emerald2-500/10 border border-emerald2-500/20 rounded-lg p-3"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald2-400" />
              <span>{t('auth.loginRequired') ? 'Success! Redirecting…' : 'Success!'}</span>
            </motion.div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block font-medium">
                    {t('auth.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('auth.namePlaceholder')}
                    className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors"
                  />
                </div>

                {/* Role Selector */}
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block font-medium">
                    {t('auth.role')} *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const isSelected = role === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setRole(r.value)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-emerald2-500/15 border-emerald2-500/50 text-white shadow-lg shadow-emerald2-500/10'
                              : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05] hover:text-white'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 mb-1.5 ${
                              isSelected ? 'text-emerald2-400' : 'text-white/40'
                            }`}
                          />
                          <span className="text-xs font-semibold">{t(r.labelKey)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic orgName Field */}
                {role !== 'CITIZEN' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="text-xs text-white/50 mb-1.5 block font-medium">
                      {role === 'OFFICER' ? t('auth.deptName') : t('auth.companyName')}
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder={
                        role === 'OFFICER'
                          ? t('auth.deptPlaceholder')
                          : t('auth.companyPlaceholder')
                      }
                      className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors"
                    />
                  </motion.div>
                )}
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block font-medium">
                {t('auth.email')} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                autoComplete="email"
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block font-medium">
                {t('auth.password')} *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald2-500/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-white/90 transition-all disabled:opacity-50 shadow-lg shadow-white/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-ink-950" />
                  <span>{t('auth.submitting')}</span>
                </>
              ) : (
                <span>{mode === 'login' ? t('auth.login') : t('auth.register')}</span>
              )}
            </button>
          </form>

          {/* Toggle Hint */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-white/50">
            {mode === 'login' ? (
              <p>
                {t('auth.dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="text-emerald2-400 hover:underline font-medium"
                >
                  {t('auth.register')}
                </button>
              </p>
            ) : (
              <p>
                {t('auth.alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-emerald2-400 hover:underline font-medium"
                >
                  {t('auth.login')}
                </button>
              </p>
            )}
          </div>
        </motion.div>

        {/* Security / Compliance Strip */}
        <div className="mt-6 text-center text-[11px] text-white/30 flex items-center justify-center gap-1.5">
          <Shield className="h-3 w-3 text-emerald2-400/70" />
          <span>Role-Based Access Control • DPIIT Aligned • PilotGov Secure Auth</span>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-white/20 pt-4">
        © 2026 PilotGov Procurement Engine.
      </div>
    </div>
  );
}
