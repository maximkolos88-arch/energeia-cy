/**
 * Energeia Ecosystem Routing & Multi-Subdomain Federation Layer
 * 
 * Supports both federated subdomains (energeia.cy, research.energeia.cy,
 * helios.energeia.cy, members.energeia.cy, academy.energeia.cy) and
 * seamless path fallbacks (/, /research, /helios, /members, /academy)
 * for local development, preview deployments, and single-origin operation.
 */

import { EnergeiaDescriptor } from '../components/EnergeiaLogo';

export type EcosystemSurface = 'cluster' | 'research' | 'helios' | 'members' | 'academy';

export interface SurfaceDefinition {
  id: EcosystemSurface;
  name: string;
  shortName: string;
  subdomain: string;
  path: string;
  descriptor: EnergeiaDescriptor;
  tagline: string;
  description: string;
  iconName: 'building' | 'compass' | 'zap' | 'users' | 'graduation-cap';
  accentColor: string;
  badge?: string;
  features: string[];
}

export const ECOSYSTEM_SURFACES: Record<EcosystemSurface, SurfaceDefinition> = {
  cluster: {
    id: 'cluster',
    name: 'Energeia Cluster',
    shortName: 'Cluster',
    subdomain: '',
    path: '/',
    descriptor: 'Cyprus',
    tagline: 'National Energy Industry Cluster',
    description: 'The institutional body uniting Cyprus’s clean energy leaders, grid operators, and policymakers.',
    iconName: 'building',
    accentColor: '#1A73E8',
    features: ['Working Groups', 'National Advocacy', 'Key Indicators', 'Cluster Membership'],
  },
  research: {
    id: 'research',
    name: 'Research & Intelligence',
    shortName: 'Research',
    subdomain: 'research',
    path: '/research',
    descriptor: 'Research',
    tagline: 'Energy Intelligence & Market Analytics',
    description: 'Distraction-free intelligence stream: regulatory briefings (CERA/TSOC), market analytics, and M&A filings.',
    iconName: 'compass',
    accentColor: '#1A73E8',
    badge: 'Intelligence',
    features: ['CERA Regulatory Decisions', 'TSOC Curtailment Logs', 'M&A Filings', 'Market Pricing'],
  },
  helios: {
    id: 'helios',
    name: 'Helios Terminal',
    shortName: 'Helios Eye',
    subdomain: 'helios',
    path: '/helios',
    descriptor: 'Helios',
    tagline: '3D GIS & Real-time Grid Telemetry',
    description: 'Interactive geospatial platform monitoring 520+ power stations, transmission lines, and ENTSO-E telemetry.',
    iconName: 'zap',
    accentColor: '#D46200',
    badge: 'Live GIS',
    features: ['520+ Generation Assets', 'Substation Telemetry', 'Subsea Interconnector', 'ENTSO-E Flows'],
  },
  members: {
    id: 'members',
    name: 'Ecosystem Directory',
    shortName: 'Registry',
    subdomain: 'members',
    path: '/members',
    descriptor: 'Network',
    tagline: 'Accredited B2B Partner Registry',
    description: 'Verified directory of solar developers, EPC contractors, battery storage operators, and advisors.',
    iconName: 'users',
    accentColor: '#137333',
    badge: 'Accredited',
    features: ['Verified Operator Registry', 'Sector Filtering', 'Claim Profile', 'Direct B2B Inquiries'],
  },
  academy: {
    id: 'academy',
    name: 'Energeia Academy',
    shortName: 'Academy',
    subdomain: 'academy',
    path: '/academy',
    descriptor: 'Academy',
    tagline: 'Skills & Technical Certifications',
    description: 'Professional training, PV installer standards, and clean energy transition masterclasses.',
    iconName: 'graduation-cap',
    accentColor: '#7B1FA2',
    badge: 'Certifications',
    features: ['PV Technical Standards', 'Storage System Certifications', 'ESG Masterclasses', 'Workforce Upskilling'],
  },
};

/**
 * Detect the current active surface from hostname and pathname.
 */
export function detectCurrentSurface(hostname?: string, pathname?: string): EcosystemSurface {
  const host = (hostname ?? (typeof window !== 'undefined' ? window.location.hostname : '')).toLowerCase();
  const path = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/');

  // Subdomain detection: research.energeia.cy, helios.localhost, etc.
  if (host.startsWith('research.')) return 'research';
  if (host.startsWith('helios.')) return 'helios';
  if (host.startsWith('members.')) return 'members';
  if (host.startsWith('academy.')) return 'academy';

  // Path-based routing fallback (works locally, in Vercel previews, or on single host)
  if (
    path === '/research' ||
    path.startsWith('/research/') ||
    path === '/news' ||
    path.startsWith('/news/') ||
    path === '/articles' ||
    path.startsWith('/articles/')
  ) {
    return 'research';
  }

  if (
    path === '/helios' ||
    path.startsWith('/helios/') ||
    path === '/terminal' ||
    path.startsWith('/terminal/')
  ) {
    return 'helios';
  }

  if (
    path === '/members' ||
    path.startsWith('/members/') ||
    path === '/directory' ||
    path.startsWith('/directory/')
  ) {
    return 'members';
  }

  if (path === '/academy' || path.startsWith('/academy/')) {
    return 'academy';
  }

  // Root or institutional paths (/about, /register, etc.) default to the Cluster Portal
  return 'cluster';
}

/**
 * Returns whether the current environment is local dev, test, or preview.
 */
export function isLocalOrPreviewEnvironment(hostname?: string): boolean {
  const host = (hostname ?? (typeof window !== 'undefined' ? window.location.hostname : '')).toLowerCase();
  return (
    !host ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.local') ||
    host.endsWith('.vercel.app') ||
    host.includes('stackblitz') ||
    host.includes('webcontainer')
  );
}

/**
 * Generates an optimal URL for navigating to an ecosystem surface.
 * On local dev / preview environments, uses path routing.
 * On production energeia.cy, uses subdomains when configured, or path fallback.
 */
export function getSurfaceUrl(
  surface: EcosystemSurface,
  subPath = '',
  currentHostname?: string
): string {
  const host = (currentHostname ?? (typeof window !== 'undefined' ? window.location.hostname : '')).toLowerCase();
  const isPreview = isLocalOrPreviewEnvironment(host);

  if (isPreview) {
    if (surface === 'cluster') return subPath || '/';
    const basePath = ECOSYSTEM_SURFACES[surface].path;
    return subPath ? `${basePath}${subPath.startsWith('/') ? '' : '/'}${subPath}` : basePath;
  }

  // Production energeia.cy handling:
  // If subdomains are configured on DNS, research.energeia.cy, etc. can be returned.
  // We can also support direct path routing on energeia.cy
  const baseDomain = host.includes('energeia.cy') ? 'energeia.cy' : host;
  
  // If user is currently browsing on a subdomain, cross-linking to another surface:
  if (surface === 'cluster') {
    return `https://${baseDomain}${subPath || '/'}`;
  }
  return `https://${surface}.${baseDomain}${subPath || '/'}`;
}
