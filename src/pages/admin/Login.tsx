import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBranding } from '../../hooks/useBranding';
import { Building2, ArrowRight, ShieldCheck, KeyRound, Mail, X, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@sapioluxe.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const { login, sendPasswordReset, isLoading, error, sessionMessage, isAuthenticated } = useAuth();
  const { brandName, logo } = useBranding();
  const navigate = useNavigate();
  const location = useLocation();

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true);
    setResetFeedback(null);

    const result = await sendPasswordReset(resetEmail);
    setResetLoading(false);
    setResetFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
  };

  return (
    <div className="min-h-screen bg-primary text-on-primary flex items-center justify-center p-margin-mobile relative overflow-hidden">
      {/* Background Architectural Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md bg-surface-container-highest/90 border border-outline-variant/30 p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          {logo ? (
            <img src={logo} alt={brandName} className="h-12 w-auto mx-auto object-contain mb-2" />
          ) : (
            <div className="w-12 h-12 bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim flex items-center justify-center mx-auto ghost-border mb-2">
              <Building2 className="w-6 h-6" />
            </div>
          )}
          <h1 className="font-headline-md text-2xl font-bold uppercase tracking-widest text-on-primary">
            {brandName} CMS
          </h1>
          <p className="font-label-caps text-xs text-on-primary-container">
            Management Portal & Executive Control
          </p>
        </div>

        {sessionMessage && (
          <div className="bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs p-3 font-body-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{sessionMessage}</span>
          </div>
        )}

        {error && (
          <div className="bg-error/20 border border-error text-error text-xs p-3 font-body-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label-caps text-xs text-outline-variant mb-1 uppercase tracking-widest">
              Administrator Email
            </label>
            <div className="relative">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sapioluxe.com"
                className="w-full bg-primary-container text-on-primary border border-outline/30 px-3 py-3 text-sm focus:outline-none focus:border-tertiary-fixed-dim"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-label-caps text-xs text-outline-variant uppercase tracking-widest">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetFeedback(null);
                  setShowForgotModal(true);
                }}
                className="text-xs text-tertiary-fixed-dim hover:underline font-label-caps cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-primary-container text-on-primary border border-outline/30 px-3 py-3 pr-10 text-sm focus:outline-none focus:border-tertiary-fixed-dim"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-outline-variant hover:text-on-primary focus:outline-none cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-tertiary-fixed-dim text-tertiary-container py-3.5 font-label-caps text-xs hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-2 font-bold shadow-lg cursor-pointer"
            >
              <span>{isLoading ? 'Authenticating Access...' : 'Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-outline/20 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-tertiary-fixed-dim font-mono-technical">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Encrypted Management Portal
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface border border-outline-variant p-6 space-y-4 shadow-2xl relative text-on-surface">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-tertiary-fixed-dim" />
                <h3 className="font-headline-md font-bold text-base uppercase tracking-wider">
                  Reset Administrator Password
                </h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-on-surface-variant hover:text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Enter your registered administrator email address below. We will send you an official password recovery link to restore your access.
            </p>

            {resetFeedback && (
              <div
                className={`p-3 text-xs flex items-center gap-2 border ${
                  resetFeedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-error/10 border-error/30 text-error'
                }`}
              >
                {resetFeedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{resetFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase tracking-widest">
                  Administrator Email
                </label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@sapioluxe.com"
                    className="w-full bg-surface-container text-on-surface border border-outline-variant px-3 py-2.5 text-sm focus:outline-none focus:border-tertiary-fixed-dim"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-xs font-label-caps text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 text-xs font-label-caps bg-tertiary-fixed-dim text-tertiary-container font-bold hover:bg-white hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{resetLoading ? 'Sending Reset Link...' : 'Send Reset Link'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


