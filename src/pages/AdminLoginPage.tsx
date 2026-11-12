import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, KeyRound, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useWedding } from '../context/WeddingContext';
import { MandalaSpinner } from '../components/common/MandalaArtwork';

export const AdminLoginPage: React.FC = () => {
  const { login, loginDemoAdmin, isAdmin, isDemoMode } = useAuth();
  const { settings } = useWedding();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome to the Wedding Admin Dashboard!');
      navigate('/admin', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoAccess = () => {
    loginDemoAdmin();
    toast.success('Entered Preview Admin Dashboard');
    navigate('/admin', { replace: true });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-royal-gradient px-4 py-28 overflow-hidden">
      <div className="absolute -top-32 -right-32 opacity-20">
        <MandalaSpinner className="w-96 h-96 text-gold-300" />
      </div>
      <div className="relative z-10 max-w-md w-full royal-card p-8 sm:p-10 space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-maroon-800 text-gold-300 flex items-center justify-center mx-auto mb-3 border border-gold-400 shadow-gold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold-700 font-semibold">
            {settings.coupleDisplayName}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900 mt-1">
            Admin Portal Login
          </h1>
          <p className="text-xs text-maroon-800/75 mt-1">
            Manage wedding events, photo albums, videos, RSVPs &amp; website content.
          </p>
        </div>

        {isDemoMode && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-2">
            <p className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> Firebase Preview Mode Active
            </p>
            <p>
              <code>.env</code> Firebase credentials are not configured yet. You can test the complete Admin CMS immediately using Preview Mode, or add your Firebase config to <code>.env</code> for live Firebase Auth &amp; Firestore.
            </p>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="btn-gold w-full !py-2.5 !text-xs"
            >
              Enter Admin Dashboard (Preview Mode)
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-maroon-900 mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-maroon-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="input-royal pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-900 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-maroon-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-royal pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || isDemoMode}
            className="btn-royal w-full !py-3"
          >
            {submitting ? 'Verifying Credentials...' : 'Sign In with Firebase Auth'}
          </button>
        </form>
      </div>
    </section>
  );
};

