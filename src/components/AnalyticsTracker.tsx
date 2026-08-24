'use client';

import React, { useEffect } from 'react';

// Generates a simple UUID-like string
const generateUUID = (): string => {
  return 'sess-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Global tracking helper exposed on window
export const trackCustomEvent = async (
  eventType: 'page_view' | 'post_read' | 'member_view' | 'contact_click' | 'pwa_install' | 'affiliate_click',
  targetId: string | null = null,
  customPath: string | null = null
) => {
  if (typeof window === 'undefined') return;

  try {
    // 1. Retrieve or initialize Session ID
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = generateUUID();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }

    // 2. Identify PWA display mode
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone === true;

    // 3. Prepare payload
    const payload = {
      session_id: sessionId,
      event_type: eventType,
      path: customPath || window.location.pathname,
      referrer: document.referrer || null,
      target_id: targetId,
      is_pwa: isPWA
    };

    // 4. Send tracking record asynchronously
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.warn('[Analytics Auto-Track] Ingestion failed:', err.message);
    });
  } catch (err) {
    console.error('[Analytics Event Track Exception]:', err);
  }
};

export const AnalyticsTracker: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Expose trackCustomEvent globally for easy direct access
    (window as any).trackCustomEvent = trackCustomEvent;

    // Auto-track location/navigation transitions
    let lastPath = window.location.pathname;

    const trackPageTransition = () => {
      const currentPath = window.location.pathname;
      trackCustomEvent('page_view', null, currentPath);
      lastPath = currentPath;
    };

    // Override pushState to capture navigation actions
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      // Small debounce delay to allow React state tabs to render
      setTimeout(trackPageTransition, 300);
    };

    // Listen to back/forward browser popstate triggers
    window.addEventListener('popstate', trackPageTransition);

    // Initial page view event
    trackCustomEvent('page_view', null, lastPath);

    return () => {
      window.removeEventListener('popstate', trackPageTransition);
      window.history.pushState = originalPushState;
    };
  }, []);

  return null;
};
