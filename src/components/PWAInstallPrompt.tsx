'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Share2, MoreVertical, PlusSquare, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

export interface DeviceInfo {
  os: 'ios' | 'android' | 'other';
  browser: 'safari' | 'chrome' | 'firefox' | 'other';
  osName: string;
  browserName: string;
}

export const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    return { os: 'other', browser: 'other', osName: 'Other', browserName: 'Browser' };
  }

  const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || '').toLowerCase();

  const isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(ua);

  if (isIOS) {
    // Chrome on iOS contains 'crios' (or 'chrome' / 'gsa' / 'cros')
    const isChromeIOS = ua.includes('crios') || ua.includes('chrome') || ua.includes('gsa') || ua.includes('cros');
    if (isChromeIOS) {
      return { os: 'ios', browser: 'chrome', osName: 'iOS', browserName: 'Google Chrome' };
    }

    const isFirefoxIOS = ua.includes('fxios') || ua.includes('firefox');
    if (isFirefoxIOS) {
      return { os: 'ios', browser: 'firefox', osName: 'iOS', browserName: 'Firefox' };
    }

    // Pure Safari on iOS has 'safari' AND NO 'crios', 'fxios', 'edgios', 'opios', 'brave'
    const isSafariPure = ua.includes('safari') && !ua.includes('crios') && !ua.includes('fxios') && !ua.includes('edgios') && !ua.includes('opios');
    if (isSafariPure) {
      return { os: 'ios', browser: 'safari', osName: 'iOS', browserName: 'Safari' };
    }

    // Default iOS fallback for any non-Safari browser on iOS: Chrome / iOS instructions
    return { os: 'ios', browser: 'chrome', osName: 'iOS', browserName: 'Google Chrome' };
  }

  if (isAndroid) {
    if (ua.includes('firefox') || ua.includes('fxios')) {
      return { os: 'android', browser: 'firefox', osName: 'Android', browserName: 'Firefox' };
    }
    return { os: 'android', browser: 'chrome', osName: 'Android', browserName: 'Google Chrome' };
  }

  return { os: 'other', browser: 'other', osName: 'Desktop', browserName: 'Browser' };
};

export const PWAInstallPrompt: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  
  // Standalone Push Notification Prompt State
  const [showPushPrompt, setShowPushPrompt] = useState<boolean>(false);

  // Live device info evaluation
  const deviceInfo = getDeviceInfo();

  // 1. Language auto-detection & strict fallback to English
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('energeia_language');
      const supported = ['en', 'el', 'ru', 'he'];

      if (!saved && navigator.language) {
        const rawLang = navigator.language.split('-')[0].toLowerCase();
        const targetLang = supported.includes(rawLang) ? rawLang : 'en';
        if (i18n.language !== targetLang) {
          i18n.changeLanguage(targetLang);
        }
      } else if (!saved) {
        if (!supported.includes(i18n.language)) {
          i18n.changeLanguage('en');
        }
      }
    }
  }, [i18n]);

  // Helper check methods
  const isStandalone = (): boolean => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  };

  const isMobile = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  };

  const isCooldownActive = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const dismissCountStr = localStorage.getItem('pwa_dismiss_count');
      const lastDismissedStr = localStorage.getItem('pwa_last_dismissed');
      
      if (!lastDismissedStr) return false;
      
      const dismissCount = dismissCountStr ? parseInt(dismissCountStr, 10) : 0;
      const lastDismissed = parseInt(lastDismissedStr, 10);
      
      if (dismissCount === 0) return false;
      
      const cooldownMs = dismissCount === 1 
        ? 7 * 24 * 60 * 60 * 1000 // 7 days
        : 30 * 24 * 60 * 60 * 1000; // 30 days
        
      return Date.now() - lastDismissed < cooldownMs;
    } catch (e) {
      return false;
    }
  };


  // Session Storage page views tracker
  useEffect(() => {
    try {
      const views = sessionStorage.getItem('pwa_pages_viewed');
      const newViews = views ? parseInt(views, 10) + 1 : 1;
      sessionStorage.setItem('pwa_pages_viewed', newViews.toString());
    } catch (e) {
      console.warn('SessionStorage error:', e);
    }
  }, []);

  // Main workflow effects loader
  useEffect(() => {
    // Context: Standalone Mode - Do not render PWA install prompt in standalone
    if (isStandalone()) {
      return;
    }

    // Context: Mobile Browser Mode (PWA Install Prompt)
    if (!isMobile() || isCooldownActive()) {
      return;
    }

    let views = 1;
    try {
      const viewsStr = sessionStorage.getItem('pwa_pages_viewed');
      if (viewsStr) views = parseInt(viewsStr, 10);
    } catch (e) {}

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      if (views > 1) {
        setShowPrompt(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    let timerId: any = null;
    if (views > 1) {
      setShowPrompt(true);
    } else {
      timerId = setTimeout(() => {
        setShowPrompt(true);
      }, 20000);
    }

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

  // CTA handler for PWA installation
  const handleInstallClick = async () => {
    const liveDevice = getDeviceInfo();
    if (liveDevice.os === 'ios') {
      setShowInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA installation prompt outcome: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      setShowInstructions(true);
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
    setShowInstructions(false);
  };

  // Helper to resolve localized instruction text based on exact OS & Browser
  const getInstructionContent = () => {
    const info = getDeviceInfo();
    if (info.os === 'ios') {
      if (info.browser === 'safari') {
        return {
          title: t('pwa.iosSafariTitle'),
          description: t('pwa.iosSafariDescription'),
          step1: t('pwa.iosSafariStep1'),
          step2: t('pwa.iosSafariStep2'),
          step3: t('pwa.iosSafariStep3')
        };
      }
      // Chrome or any non-Safari browser on iOS
      return {
        title: t('pwa.iosChromeTitle'),
        description: t('pwa.iosChromeDescription'),
        step1: t('pwa.iosChromeStep1'),
        step2: t('pwa.iosChromeStep2'),
        step3: t('pwa.iosChromeStep3')
      };
    }

    if (info.os === 'android') {
      if (info.browser === 'firefox') {
        return {
          title: t('pwa.androidFirefoxTitle'),
          description: t('pwa.androidFirefoxDescription'),
          step1: t('pwa.androidFirefoxStep1'),
          step2: t('pwa.androidFirefoxStep2'),
          step3: t('pwa.androidFirefoxStep3')
        };
      }
      return {
        title: t('pwa.androidChromeTitle'),
        description: t('pwa.androidChromeDescription'),
        step1: t('pwa.androidChromeStep1'),
        step2: t('pwa.androidChromeStep2'),
        step3: t('pwa.androidChromeStep3')
      };
    }

    // Default fallback for iOS Chrome
    return {
      title: t('pwa.iosChromeTitle'),
      description: t('pwa.iosChromeDescription'),
      step1: t('pwa.iosChromeStep1'),
      step2: t('pwa.iosChromeStep2'),
      step3: t('pwa.iosChromeStep3')
    };
  };

  const instructionContent = getInstructionContent();

  // Render browser PWA installation screen
  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      
      <div 
        className="bg-white dark:bg-[#1b1c1e] w-full max-w-md p-6 relative shadow-2xl animate-scale-up overflow-hidden border border-neutral-200 dark:border-neutral-800 pb-8 md:pb-6"
        style={{ borderRadius: '20px' }}
      >
        
        <button
          onClick={handleSkipClick}
          className="absolute top-4 right-4 p-1.5 text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-2 mt-4">
          <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 blur-xl animate-pulse" />
          <div className="absolute w-16 h-16 rounded-full bg-primary/30 dark:bg-primary/20 blur-lg" />
          
          <svg className="absolute w-full h-full text-emerald-500/15 dark:text-emerald-500/5 animate-spin-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animationDuration: '20s' }}>
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
          </svg>

          <div className="relative w-16 h-16 bg-gradient-to-br from-[#16a34a] to-[#15823f] rounded-2xl flex items-center justify-center shadow-lg border border-[#14532d]/25 z-10">
            <span className="material-symbols-outlined text-white text-3xl select-none" style={{ fontVariationSettings: '"FILL" 1, "wght" 600, "GRAD" 0, "opsz" 24' }}>
              power_input
            </span>
          </div>
        </div>

        <div className="text-center space-y-2 px-1">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {t('pwa.title')}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
            {t('pwa.description')}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleInstallClick}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors shadow-sm focus:outline-none flex items-center justify-center gap-2 cursor-pointer h-[52px]"
            style={{ borderRadius: '14px' }}
          >
            {t('pwa.installButton')}
          </button>
          
          <button
            onClick={handleSkipClick}
            className="w-full bg-transparent text-[#6b7280] hover:text-neutral-600 font-semibold py-2 text-xs transition-colors cursor-pointer block text-center"
          >
            {t('pwa.skipButton')}
          </button>
        </div>

        {/* Dynamic OS & Browser Popover Instructions Drawer */}
        {showInstructions && (
          <div className="absolute inset-0 bg-white dark:bg-[#1b1c1e] z-50 p-6 flex flex-col justify-between animate-fade-in" style={{ borderRadius: '20px' }}>
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 mt-2 overflow-y-auto">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  {instructionContent.title}
                </h3>
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 inline-block px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-md">
                  {t('pwa.detectedBrowser', { browser: deviceInfo.browserName, os: deviceInfo.osName })}
                </p>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {instructionContent.description}
              </p>

              <div className="space-y-3.5 pt-1 text-xs text-neutral-800 dark:text-neutral-250">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1 leading-relaxed">
                    <span>{instructionContent.step1}</span>
                    {deviceInfo.os === 'ios' && deviceInfo.browser === 'safari' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 ms-1.5 text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded border border-neutral-200 dark:border-neutral-700">
                        <Upload className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Share
                      </span>
                    )}
                    {deviceInfo.os === 'ios' && deviceInfo.browser === 'chrome' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 ms-1.5 text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded border border-neutral-200 dark:border-neutral-700">
                        <Share2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Share
                      </span>
                    )}
                    {deviceInfo.os === 'android' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 ms-1.5 text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded border border-neutral-200 dark:border-neutral-700">
                        <MoreVertical className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Menu
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1 leading-relaxed">
                    <span>{instructionContent.step2}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 ms-1.5 text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded border border-neutral-200 dark:border-neutral-700">
                      <PlusSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Add to Home
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex-1 leading-relaxed">
                    <span>{instructionContent.step3}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-2">
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                {t('common.done') || 'Got it'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
