import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginScreenProps {
  onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-4 bg-slate-50/50 dark:bg-[#121212]/50 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#1e1f22] rounded-3xl shadow-sm border border-gray-200 dark:border-[#3c4043] p-8 md:p-10 transition-colors">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/20 mb-4">
            <span className="material-symbols-outlined text-[#1CA350] text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Admin Portal</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Sign in with your credentials to access dashboard configurations.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#3c4043] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CA350]/20 focus:border-[#1CA350] text-sm text-on-surface transition-colors"
              placeholder="admin@energeia.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#3c4043] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CA350]/20 focus:border-[#1CA350] text-sm text-on-surface transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs font-semibold mt-2 flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-950/30">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-[#1CA350] hover:bg-[#15823f] disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
