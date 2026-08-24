import { useEffect } from 'react';

export type PageviewType = 'ARTICLE' | 'COMPANY' | 'GENERAL';

/**
 * Generates a random UUID string for visitor identification
 */
function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const STORAGE_KEY = 'energeia_visitor_id';
  try {
    let visitorId = localStorage.getItem(STORAGE_KEY);
    if (!visitorId) {
      visitorId = 'v-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY, visitorId);
    }
    return visitorId;
  } catch (e) {
    return 'v-anon-' + Math.random().toString(36).substring(2, 9);
  }
}

/**
 * Custom React hook to automatically track pageviews for platform traffic statistics.
 * Sends a non-blocking POST request to /api/track with visitorId, path, type, and entityId.
 */
export function usePageTracking(type: PageviewType = 'GENERAL', entityId?: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    const visitorId = getOrCreateVisitorId();

    const payload = {
      path: currentPath,
      type,
      entityId: entityId || null,
      visitorId,
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
