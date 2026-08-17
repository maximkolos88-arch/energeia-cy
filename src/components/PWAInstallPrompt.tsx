import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ArrowDown } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState<boolean>(false);

  // Helper check methods
  const isStandalone = (): boolean => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  };

  const isMobile = (): boolean => {
    return window.innerWidth < 768;
  };

  const isDismissed = (): boolean => {
    const dismissedTime = localStorage.getItem('pwa_prompt_dismissed');
    if (!dismissedTime) return false;
    const cooldown = 7 * 24 * 60 * 60 * 1000; // 7 days cooldown
    return Date.now() - parseInt(dismissedTime, 10) < cooldown;
  };

  const isIOS = (): boolean => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  useEffect(() => {
    // 1. Android/Chrome handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Auto-trigger prompt display if constraints are satisfied
      if (!isStandalone() && !isDismissed() && isMobile()) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 2. iOS check on initial load
    if (isIOS() && !isStandalone() && !isDismissed() && isMobile()) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS()) {
      // Show custom overlay/drawer instructions pointing to Safari share actions
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      // Trigger native browser install prompt for Chrome/Android
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA installation prompt outcome: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      // Fallback instruction description for general mobile browsers
      alert(
        "To install, open your browser options/settings and select 'Add to Home Screen' or 'Install app'."
      );
    }
  };

  const handleSkipClick = () => {
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    setShowPrompt(false);
    setShowIOSInstructions(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      
      {/* Main onboarding container */}
      <div className="bg-white dark:bg-[#1b1c1e] w-full max-w-md rounded-t-3xl md:rounded-2xl p-6 relative shadow-2xl animate-scale-up overflow-hidden border border-neutral-200 dark:border-neutral-800 pb-8 md:pb-6">
        
        {/* Dismiss Button */}
        <button
          onClick={handleSkipClick}
          className="absolute top-4 right-4 p-1.5 text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SVG/CSS Clean-Tech Smartphone Mockup */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-4 mt-2">
          {/* Background energy pulse rings */}
          <div className="absolute w-40 h-40 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-xl animate-pulse" />
          <div className="absolute w-28 h-28 rounded-full bg-primary/20 dark:bg-primary/10 blur-lg animate-pulse delay-75" />
          
          <svg className="absolute w-full h-full text-emerald-500/10 dark:text-emerald-500/5" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M100 20 C140 20, 180 60, 180 100 C180 140, 140 180, 100 180" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          {/* Smartphone Body */}
          <div className="relative w-24 h-44 bg-neutral-900 rounded-[28px] p-2.5 shadow-xl border-2 border-neutral-850 dark:border-neutral-800 flex flex-col justify-between overflow-hidden">
            {/* Camera notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-neutral-950 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
            </div>

            {/* Screen */}
            <div className="w-full h-full rounded-[18px] bg-gradient-to-b from-emerald-50/60 to-emerald-100/30 dark:from-neutral-900 dark:to-neutral-950 flex flex-col items-center justify-center p-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-primary/10 blur-md" />
              
              {/* Opaque Brand Green Icon */}
              <div className="w-11 h-11 bg-[#15823f] rounded-xl flex items-center justify-center shadow-md border border-[#127036] animate-bounce mb-2">
                <span className="material-symbols-outlined text-white text-2xl select-none" style={{ fontVariationSettings: '"FILL" 1, "wght" 600, "GRAD" 0, "opsz" 24' }}>
                  power_input
                </span>
              </div>

              {/* Text lines skeleton */}
              <div className="w-12 h-1.5 bg-neutral-350 dark:bg-neutral-800 rounded-full mb-1" />
              <div className="w-8 h-1 bg-neutral-250 dark:bg-neutral-900 rounded-full" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-2 px-1">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Energeia on Your Home Screen
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
            Get instant one-tap access to Cyprus energy news, exclusive market insights, and the professional member directory — fast, seamless, and available offline.
          </p>
        </div>

        {/* CTA Buttons block */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleInstallClick}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors shadow-sm focus:outline-none flex items-center justify-center gap-2 cursor-pointer h-[52px]"
          >
            {isIOS() ? 'Add to Home Screen' : 'Install App'}
          </button>
          
          <button
            onClick={handleSkipClick}
            className="w-full bg-transparent text-neutral-450 hover:text-neutral-600 font-semibold py-2 text-xs transition-colors cursor-pointer block text-center"
          >
            Skip and continue to website →
          </button>
        </div>

        {/* iOS Popover Instructions Drawer overlay */}
        {showIOSInstructions && (
          <div className="absolute inset-0 bg-white dark:bg-[#1b1c1e] z-50 p-6 flex flex-col justify-between animate-fade-in">
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                Install on iOS Safari
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed">
                Follow these simple steps in Safari to add Energeia to your device's home screen:
              </p>

              <div className="space-y-3 pt-2 text-xs text-neutral-800 dark:text-neutral-250">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <p className="leading-relaxed">
                    Tap the <strong>Share</strong> button in Safari's bottom toolbar.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <p className="leading-relaxed">
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <p className="leading-relaxed">
                    Tap <strong>Add</strong> in the top-right corner to complete installation.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom pulsing indicator pointing down */}
            <div className="flex flex-col items-center justify-center pt-6 text-primary animate-bounce">
              <ArrowDown className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase mt-1">Tap Share below</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
