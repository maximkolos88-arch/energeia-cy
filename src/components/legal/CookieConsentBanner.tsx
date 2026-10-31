import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export const CookieConsentBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('energeia_cookie_consent');
    if (!consent) {
      // Delay display slightly to not compete with initial paint (LCP)
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen to custom event to reopen preferences from Footer
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open_cookie_preferences', handleOpen);
    return () => window.removeEventListener('open_cookie_preferences', handleOpen);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('energeia_cookie_consent', 'all');
    setIsOpen(false);
    // Enable analytics or push notifications
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: 'cookie_consent_granted' });
    }
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('energeia_cookie_consent', 'essential');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <dialog
      open
      role="dialog"
      aria-label="Cookie and Privacy Consent"
      aria-modal="false"
      className="fixed bottom-6 inset-inline-start-6 z-50 max-w-sm w-[calc(100vw-3rem)] rounded-[var(--radius-card,24px)] bg-white dark:bg-[#1E1F20] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] p-5 shadow-2xl animate-scale-up select-none m-0"
    >
      <div className="flex items-start gap-3.5 mb-3">
        <div className="p-2 rounded-xl bg-[var(--md-sys-color-primary-container,#D3E3FD)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] text-[var(--md-sys-color-on-primary-container,#041E49)] dark:text-[var(--md-sys-color-on-primary-container,#D3E3FD)] shrink-0">
          <Cookie className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white leading-tight">
            Privacy & Cookie Preferences
          </h3>
          <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] mt-1 leading-relaxed">
            We use technical storage and anonymized telemetry to optimize network dispatch intelligence in compliance with Cyprus Law 112(I)/2004 Section 14 and EU GDPR.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleEssentialOnly}
          className="flex-1 h-9 px-3 rounded-full text-xs font-medium border border-[#DADCE0] dark:border-[#5F6368] text-[#1A73E8] dark:text-[#8AB4F8] bg-[#F8F9FA] dark:bg-[#282A2C] hover:bg-[#F1F3F4] dark:hover:bg-[#333537] transition-colors cursor-pointer"
        >
          Essential Only
        </button>

        <button
          type="button"
          onClick={handleAcceptAll}
          className="flex-1 h-9 px-3 rounded-full text-xs font-medium border border-[#DADCE0] dark:border-[#5F6368] text-[#1A73E8] dark:text-[#8AB4F8] bg-[#F8F9FA] dark:bg-[#282A2C] hover:bg-[#F1F3F4] dark:hover:bg-[#333537] transition-colors cursor-pointer"
        >
          Accept All
        </button>
      </div>

      <div className="pt-2 text-center">
        <a 
          href="/cookies" 
          className="text-[10px] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] hover:underline"
        >
          Read Cyprus Statutory Cookie Policy
        </a>
      </div>
    </dialog>
  );
};

export default CookieConsentBanner;
