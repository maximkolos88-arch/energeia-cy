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

  const isCooldownActive = (): boolean => {
    try {
      const dismissCountStr = localStorage.getItem('pwa_dismiss_count');
      const lastDismissedStr = localStorage.getItem('pwa_last_dismissed');
      
      if (!lastDismissedStr) return false;
      
      const dismissCount = dismissCountStr ? parseInt(dismissCountStr, 10) : 0;
      const lastDismissed = parseInt(lastDismissedStr, 10);
      
      if (dismissCount === 0) return false;
      
      // Cooldown calculation: 1 dismissal = 7 days, >=2 dismissals = 30 days
      const cooldownMs = dismissCount === 1 
        ? 7 * 24 * 60 * 60 * 1000 // 7 days
        : 30 * 24 * 60 * 60 * 1000; // 30 days
        
      return Date.now() - lastDismissed < cooldownMs;
    } catch (e) {
      return false;
    }
  };

  const isIOS = (): boolean => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  // 1. Tracking page views inside session storage
  useEffect(() => {
    try {
      const views = sessionStorage.getItem('pwa_pages_viewed');
      const newViews = views ? parseInt(views, 10) + 1 : 1;
      sessionStorage.setItem('pwa_pages_viewed', newViews.toString());
    } catch (e) {
      console.warn('SessionStorage error:', e);
    }
  }, []);

  // 2. Setting triggers and event listeners
  useEffect(() => {
    if (isStandalone() || !isMobile() || isCooldownActive()) {
      return;
    }

    // Check page views count
    let views = 1;
    try {
      const viewsStr = sessionStorage.getItem('pwa_pages_viewed');
      if (viewsStr) views = parseInt(viewsStr, 10);
    } catch (e) {}

    // Android/Chrome install event handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // If we are already on the second page, show immediately
      if (views > 1) {
        setShowPrompt(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Initial delay loader
    let timerId: any = null;
    if (views > 1) {
      setShowPrompt(true);
    } else {
      // 20 seconds delay timer for active user session on first page load
      timerId = setTimeout(() => {
        setShowPrompt(true);
      }, 20000);
    }

    // App installed handler to auto-close prompt
    const handleAppInstalled = () => {
      console.log('PWA installed successfully');
      setShowPrompt(false);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS()) {
      // Show instructions modal pointing to Safari share
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      // Trigger native browser install prompt for Chrome/Android
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA installation prompt outcome: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      // Fallback instructions for general mobile browsers
      alert(
        "To install, open your browser options/settings and select 'Add to Home Screen' or 'Install app'."
      );
    }
  };

  const handleSkipClick = () => {
    try {
      const dismissCountStr = localStorage.getItem('pwa_dismiss_count');
      const newCount = dismissCountStr ? parseInt(dismissCountStr, 10) + 1 : 1;
      localStorage.setItem('pwa_dismiss_count', newCount.toString());
      localStorage.setItem('pwa_last_dismissed', Date.now().toString());
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    
    setShowPrompt(false);
    setShowIOSInstructions(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      
      {/* Main onboarding container - premium 20px rounding */}
      <div 
        className="bg-white dark:bg-[#1b1c1e] w-full max-w-md p-6 relative shadow-2xl animate-scale-up overflow-hidden border border-neutral-200 dark:border-neutral-800 pb-8 md:pb-6"
        style={{ borderRadius: '20px' }}
      >
        
        {/* Dismiss Button */}
        <button
          onClick={handleSkipClick}
          className="absolute top-4 right-4 p-1.5 text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Minimalist Vector App Icon Graphic with Glow */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-2 mt-4">
          {/* Ambient glow background */}
          <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 blur-xl animate-pulse" />
          <div className="absolute w-16 h-16 rounded-full bg-primary/30 dark:bg-primary/20 blur-lg" />
          
          {/* Vector circles surrounding the logo */}
          <svg className="absolute w-full h-full text-emerald-500/15 dark:text-emerald-500/5 animate-spin-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animationDuration: '20s' }}>
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
          </svg>

          {/* Premium Logo box - 16px rounding */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-[#16a34a] to-[#15823f] rounded-2xl flex items-center justify-center shadow-lg border border-[#14532d]/25 z-10">
            <span className="material-symbols-outlined text-white text-3xl select-none" style={{ fontVariationSettings: '"FILL" 1, "wght" 600, "GRAD" 0, "opsz" 24' }}>
              power_input
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-2 px-1">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Energeia on Your Home Screen
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
            Get instant one-tap access to Cyprus energy news, real-time market updates, and the verified professional member directory.
          </p>
        </div>

        {/* CTA Buttons block - 14px rounding */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleInstallClick}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors shadow-sm focus:outline-none flex items-center justify-center gap-2 cursor-pointer h-[52px]"
            style={{ borderRadius: '14px' }}
          >
            Add to Home Screen
          </button>
          
          <button
            onClick={handleSkipClick}
            className="w-full bg-transparent text-[#6b7280] hover:text-neutral-600 font-semibold py-2 text-xs transition-colors cursor-pointer block text-center"
          >
            Skip and continue to website →
          </button>
        </div>

        {/* iOS Popover Instructions Drawer overlay */}
        {showIOSInstructions && (
          <div className="absolute inset-0 bg-white dark:bg-[#1b1c1e] z-50 p-6 flex flex-col justify-between animate-fade-in" style={{ borderRadius: '20px' }}>
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
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
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
