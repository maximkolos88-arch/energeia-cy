/**
 * Optimizes external image URLs via wsrv.nl CDN proxy:
 * - Converts oversized JPEGs/PNGs to lightweight WebP thumbnails
 * - Enforces 1-year Cache-Control TTL
 * - Strips third-party cookies set by external news domains
 * - Prevents 403/404 broken image console errors via fallback
 */
const BLOCKED_HOTLINK_DOMAINS = [
  'offshore-energy.biz',
];

export function getOptimizedImageUrl(
  rawUrl?: string | null,
  width: number = 320,
  height: number = 214
): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const url = rawUrl.trim();
  if (!url) return '';

  // Keep local assets, data URIs, blob URLs, or already-proxied URLs unchanged
  if (
    url.startsWith('/') ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.includes('wsrv.nl') ||
    url.includes('energeia.cy')
  ) {
    return url;
  }

  // Filter out domains known to block hotlinking/proxying with 403 Forbidden
  const lowerUrl = url.toLowerCase();
  if (BLOCKED_HOTLINK_DOMAINS.some((domain) => lowerUrl.includes(domain))) {
    return '';
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    const fallback = 'https://www.energeia.cy/apple-touch-icon-180x180.png';
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&h=${height}&fit=cover&output=webp&q=75&default=${encodeURIComponent(fallback)}`;
  }

  return url;
}
