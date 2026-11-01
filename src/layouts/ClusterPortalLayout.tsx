import React, { useState, useEffect } from 'react';
import { EnergeiaLogo } from '../components/EnergeiaLogo';
import { AppLauncher } from '../components/navigation/AppLauncher';
import { EcosystemSurface, getSurfaceUrl } from '../utils/ecosystemRouting';
import { supabase } from '../lib/supabase';
import { Sun, Moon, CheckCircle2, ArrowRight } from 'lucide-react';

export interface ClusterPortalLayoutProps {
  onNavigateSurface?: (surface: EcosystemSurface, path?: string) => void;
  language?: string;
}

export const ClusterPortalLayout: React.FC<ClusterPortalLayoutProps> = ({
  onNavigateSurface,
}) => {
  // Theme state & toggler
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('energeia_theme');
      if (saved) return saved === 'dark';
      return (
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.documentElement.classList.contains('dark')
      );
    }
    return false;
  });

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (typeof document !== 'undefined') {
      const themeStr = next ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', themeStr);
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('energeia_theme', themeStr);
    }
  };

  // Early Access Intake State
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setErrorMessage('Please enter a valid corporate email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      email: cleanEmail,
      reference: `BETA-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'early_access_waitlist',
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('leads').insert([payload]);
    } catch {
      try {
        await supabase.from('membership_applications').insert([{
          company_name: 'Early Access Waitlist',
          email: cleanEmail,
          status: 'early_access',
          created_at: new Date().toISOString(),
        }]);
      } catch {}
    }

    try {
      const stored = JSON.parse(localStorage.getItem('energeia_early_access_leads') || '[]');
      stored.push(payload);
      localStorage.setItem('energeia_early_access_leads', JSON.stringify(stored));
    } catch {}

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleSurfaceClick = (e: React.MouseEvent, surface: EcosystemSurface, path = '') => {
    if (onNavigateSurface) {
      e.preventDefault();
      onNavigateSurface(surface, path);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F8F9FA] dark:bg-[#0E0F10] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors selection:bg-[#E8F0FE] dark:selection:bg-[#0842A0]/40 overflow-hidden font-sans flex flex-col justify-between py-8 sm:py-12 px-6 sm:px-12">

      {/* Subtle Cyprus-copper ambient glow centered softly behind masthead */}
      <div 
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[300px] sm:h-[400px] bg-[#D46200] opacity-[0.06] blur-[120px] rounded-full pointer-events-none -z-10" 
      />

      {/* ==================================================================== */}
      {/* 1. TOP HEADER (CLEAN MINIMAL NAVIGATION)                             */}
      {/* ==================================================================== */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Identity */}
        <a href="/" className="cursor-pointer" aria-label="Energeia Cyprus Home">
          <EnergeiaLogo descriptor="Cyprus" variant="gradient" className="h-7 sm:h-8" />
        </a>

        {/* Right: Google 9-dots App Launcher + Theme Toggle */}
        <div className="flex items-center gap-1 sm:gap-2">
          <AppLauncher 
            currentSurface="cluster" 
            onSelectSurface={onNavigateSurface} 
          />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. CENTER HERO (THE ANNOUNCEMENT)                                    */}
      {/* ==================================================================== */}
      <main className="w-full max-w-3xl mx-auto my-auto text-center py-12 sm:py-16">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-[#5F6368] dark:text-[#9AA0A6] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>[ PRIVATE BETA // LAUNCHING 2026 ]</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.08] text-[#1F1F1F] dark:text-[#F1F3F4]">
          The energy operating system<br className="hidden sm:inline" /> for the Republic of Cyprus.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#5F6368] dark:text-[#9AA0A6] max-w-xl mx-auto mt-4 text-center leading-relaxed">
          Unifying licensed generation, utility BESS storage, grid telemetry, and institutional market intelligence.
        </p>

        {/* ================================================================== */}
        {/* 3. EARLY ACCESS INTAKE (EMAIL CAPTURE)                             */}
        {/* ================================================================== */}
        {isSubmitted ? (
          <div className="mt-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-center max-w-md mx-auto animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>✓ Request received. We will notify you ahead of public deployment.</span>
            </div>
            <button
              type="button"
              onClick={() => { setIsSubmitted(false); setEmail(''); }}
              className="mt-2 text-xs font-mono text-[#5F6368] dark:text-[#9AA0A6] hover:underline cursor-pointer"
            >
              Submit another corporate address
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto mt-8 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
              placeholder="Enter corporate email..."
              required
              className="rounded-full px-5 py-3.5 bg-white dark:bg-[#1E1F20] border border-black/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-[#1F1F1F] dark:text-[#F1F3F4] placeholder-[#80868B] flex-1 shadow-2xs transition-all"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full px-6 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-medium text-sm transition-all shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Request Early Access'}
            </button>
          </form>
        )}

        {errorMessage && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-mono">
            {errorMessage}
          </p>
        )}

        {/* ================================================================== */}
        {/* 4. ECOSYSTEM TEASER PILLS (WHAT'S COMING)                          */}
        {/* ================================================================== */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto">
          {[
            { label: '[ 01 // Helios 3D GIS Terminal ]', surface: 'helios' as EcosystemSurface, path: '/helios' },
            { label: '[ 02 // CERA & TSOC Intelligence Desk ]', surface: 'research' as EcosystemSurface, path: '/research' },
            { label: '[ 03 // B2B Accredited Member Registry ]', surface: 'members' as EcosystemSurface, path: '/members' },
            { label: '[ 04 // Workforce Engineering Academy ]', surface: 'academy' as EcosystemSurface, path: '/academy' },
          ].map((item, idx) => (
            <a
              key={idx}
              href={getSurfaceUrl(item.surface)}
              onClick={(e) => handleSurfaceClick(e, item.surface, item.path)}
              className="font-mono text-[11px] font-medium px-3.5 py-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.06] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-[#5F6368] hover:text-[#1F1F1F] dark:text-[#9AA0A6] dark:hover:text-white border border-black/[0.06] dark:border-white/[0.08] transition-colors cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </div>

      </main>

      {/* ==================================================================== */}
      {/* 5. MINIMALIST STATUTORY FOOTER                                       */}
      {/* ==================================================================== */}
      <footer className="w-full max-w-7xl mx-auto border-t border-black/[0.06] dark:border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5F6368] dark:text-[#9AA0A6] gap-4">
        <div>
          Energeia is operated by M3J2 LTD (HE 438859) · Limassol, Cyprus.
        </div>
        <div className="font-mono">
          secretariat@energeia.cy · All rights reserved © 2026
        </div>
      </footer>

    </div>
  );
};
