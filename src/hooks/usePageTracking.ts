import { useEffect } from 'react';

export type PageviewType = 'ARTICLE' | 'COMPANY' | 'GENERAL';

/**
 * Custom React hook to automatically track pageviews for analytics and media kit stats.
 * Sends a non-blocking POST request to /api/track on component mount or entityId change.
 */
export function usePageTracking(type: PageviewType = 'GENERAL', entityId?: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;

    const payload = {
      path: currentPath,
      type,
      entityId: entityId || null,
    };

    // Non-blocking fetch call to /api/track
    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn('[usePageTracking] Track request failed:', err?.message || err);
    });
  }, [type, entityId]);
}
