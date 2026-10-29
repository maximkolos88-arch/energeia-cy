import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { useWebMCP } from './hooks/useWebMCP';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { Footer } from './components/Footer';
import { NewsFeedScreen } from './components/NewsFeedScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import ScrollToTop from './components/navigation/ScrollToTop';
import { useTranslation } from 'react-i18next';
import { loadLanguageBundle } from './lib/i18n';
import { FEATURES } from './config/features';
import { InitialDataProvider, InitialData } from './context/InitialDataContext';

function lazyWithRetry<T extends { default: React.ComponentType<any> }>(
  factory: () => Promise<T>,
  retries = 3,
  delayMs = 400
): React.LazyExoticComponent<T['default']> {
  return React.lazy(() =>
    new Promise<T>((resolve, reject) => {
      const attempt = (left: number) => {
        factory()
          .then(resolve)
          .catch((err) => {
            if (left <= 0) {
              reject(err);
            } else {
              setTimeout(() => attempt(left - 1), delayMs);
            }
          });
      };
      attempt(retries);
    })
  );
}

const loadAdminPanel = () => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel }));
const loadLoginScreen = () => import('./components/LoginScreen').then(m => ({ default: m.LoginScreen }));

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
}
interface AdminErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class AdminErrorBoundary extends React.Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#121212] p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-600 mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Unable to load Admin Portal</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 max-w-sm mb-6">
            {this.state.error?.message || 'A network error occurred while loading the portal bundle.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
            >
              Retry Loading
            </button>
            <a
              href="/"
              className="px-5 py-2.5 bg-slate-200 dark:bg-[#2c2d30] text-slate-700 dark:text-gray-300 font-medium rounded-xl text-sm hover:bg-slate-300 dark:hover:bg-[#3c3d42] transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const PWAInstallPrompt = React.lazy(() => import('./components/PWAInstallPrompt').then(m => ({ default: m.PWAInstallPrompt })));
const DirectoryScreen = React.lazy(() => import('./components/DirectoryScreen').then(m => ({ default: m.DirectoryScreen })));
const AboutScreen = React.lazy(() => import('./components/AboutScreen').then(m => ({ default: m.AboutScreen })));
const MagazineScreen = React.lazy(() => import('./components/MagazineScreen').then(m => ({ default: m.MagazineScreen })));
const AcademyScreen = React.lazy(() => import('./components/AcademyScreen').then(m => ({ default: m.AcademyScreen })));
const RegisterScreen = React.lazy(() => import('./components/RegisterScreen').then(m => ({ default: m.RegisterScreen })));
const TermsScreen = React.lazy(() => import('./components/legal/TermsScreen').then(m => ({ default: m.TermsScreen })));
const PrivacyScreen = React.lazy(() => import('./components/legal/PrivacyScreen').then(m => ({ default: m.PrivacyScreen })));
const CookieScreen = React.lazy(() => import('./components/legal/CookieScreen').then(m => ({ default: m.CookieScreen })));
const CorporateDisclosuresScreen = React.lazy(() => import('./components/legal/CorporateDisclosuresScreen').then(m => ({ default: m.CorporateDisclosuresScreen })));
const TerminalScreen = React.lazy(() => import('./components/TerminalScreen').then(m => ({ default: m.TerminalScreen })));
const AdminPanel = lazyWithRetry(loadAdminPanel);
const LoginScreen = lazyWithRetry(loadLoginScreen);

const NAV_SECTIONS = ['news', 'terminal', 'members', 'magazine', 'academy', 'about', 'register', 'terms', 'privacy', 'cookies', 'disclosures'] as const;

const NAVIGATE_SECTION_SCHEMA = {
  type: 'object',
  properties: {
    section: {
      type: 'string',
      enum: NAV_SECTIONS,
      default: 'news',
      description: 'Portal section to navigate to.',
    },
  },
  required: ['section'],
};

const ROUTE_META: Record<string, { title: string; description: string }> = {
  news: {
    title: 'Energeia - Cyprus Energy News & Market Intelligence',
    description: 'Cyprus energy news, renewable market intelligence, regulatory policy updates, and clean energy analytics.',
  },
  terminal: {
    title: 'Helios Eye — Cyprus National Energy Terminal | Energeia',
    description: 'Interactive 3D GIS platform monitoring Cyprus renewable infrastructure, 520+ power plants, transmission substations, and live ENTSO-E market telemetry.',
  },
  members: {
    title: 'Directory - Cyprus Energy Professionals & Companies | Energeia',
    description: 'Explore verified energy sector members, solar installers, ESG auditors, and clean tech companies in Cyprus.',
  },
  about: {
    title: 'About Energeia - Cyprus All-Energy Network',
    description: 'Energeia is the central information hub and intelligence platform for Cyprus clean energy transition.',
  },
  magazine: {
    title: 'Magazine - Print & Digital Energy Issues | Energeia',
    description: 'Access exclusive Cyprus energy market issue digests, regulatory reports, and interview archives.',
  },
  academy: {
    title: 'Academy - Clean Energy Courses & Training | Energeia',
    description: 'Specialized professional courses and educational training for the Cyprus energy transition and renewables market.',
  },
  register: {
    title: 'Join the Network - Membership Registration | Energeia',
    description: 'Register as an energy professional or enterprise in Cyprus to connect with industry leaders and clean tech projects.',
  },
  terms: {
    title: 'Terms & Conditions | Energeia Cyprus',
    description: 'Terms of service, platform usage rules, and legal conditions for Energeia Cyprus energy portal.',
  },
  privacy: {
    title: 'Privacy Policy | Energeia Cyprus',
    description: 'EU GDPR compliance, personal data protection details, and data subject rights for Energeia Cyprus.',
  },
  cookies: {
    title: 'Cookie Policy | Energeia Cyprus',
    description: 'Information on cookie usage, technical web analytics, and user consent management on Energeia.',
  },
  disclosures: {
    title: 'Statutory Corporate Disclosures | Energeia Cyprus',
    description: 'Official corporate profile, HE 438859 registration details, VAT CY10438859X, address, and legal disclosures.',
  },
};

export interface AppProps {
  path?: string;
  initialData?: InitialData;
}

export default function App({ path: propPath, initialData }: AppProps) {
  const { i18n } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(() => {
    return (propPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/')).startsWith('/admin');
  });

  const currentPath = propPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/');

  const [activeTab, setActiveTab] = useState<string>(() => {
    const path = currentPath;
    if ((path === '/members' || path === '/directory') && FEATURES.enableMembers) return 'members';
    if (path === '/terminal' && FEATURES.enableTerminal) return 'terminal';
    if (path === '/magazine' && FEATURES.enableMagazine) return 'magazine';
    if (path === '/academy' && FEATURES.enableAcademy) return 'academy';
    if (path === '/about' && FEATURES.enableAbout) return 'about';
    if (path === '/register' && FEATURES.enableRegister) return 'register';
    if (path === '/terms') return 'terms';
    if (path === '/privacy') return 'privacy';
    if (path === '/cookies') return 'cookies';
    if (path === '/disclosures') return 'disclosures';
    
    // Redirect unreleased/disabled URLs back to homepage (/)
    if (typeof window !== 'undefined' && path !== '/' && !path.startsWith('/admin') && !path.startsWith('/news') && !path.startsWith('/articles') && !['/terms', '/privacy', '/cookies', '/disclosures'].includes(path)) {
      window.history.replaceState({}, '', '/');
    }
    return 'news';
  });

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return currentPath.startsWith('/admin');
  });

  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [mountDeferredUI, setMountDeferredUI] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setMountDeferredUI(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Language state controller (Default to browser language or 'en', save to localStorage)
  const [language, setLanguage] = useState<string>(() => {
    const supportedLangs = ['en', 'el', 'ru', 'he'];
    
    if (typeof window !== 'undefined') {
      // Priority 1: Check manual choice in app_lang or fallback energeia_language
      const saved = localStorage.getItem('app_lang') || localStorage.getItem('energeia_language');
      if (saved && supportedLangs.includes(saved)) {
        if (saved !== 'en') loadLanguageBundle(saved);
        return saved;
      }

      // Priority 2: Check system languages with iw -> he mappings
      const userLangs = navigator.languages || [navigator.language || 'en'];
      for (const lang of userLangs) {
        const code = lang.toLowerCase().split('-')[0];
        if (code === 'iw') {
          loadLanguageBundle('he');
          return 'he';
        }
        if (supportedLangs.includes(code)) {
          if (code !== 'en') loadLanguageBundle(code);
          return code;
        }
      }
    }

    // Priority 3: Fallback default ('en' is already active in i18n)
    return 'en';
  });

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_lang', lang);
      localStorage.setItem('energeia_language', lang); // compatibility backup
    }
    loadLanguageBundle(lang);
  };

  // Synchronize HTML attributes (RTL dir and lang locale) only when changed to avoid full-document style invalidation
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const targetDir = language === 'he' ? 'rtl' : 'ltr';
      if (document.documentElement.lang !== language) {
        document.documentElement.lang = language;
      }
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      if (currentDir !== targetDir) {
        document.documentElement.dir = targetDir;
      }
    }
  }, [language]);

  // Client mount detection log
  useEffect(() => {
    console.log('App successfully mounted on client');
  }, []);

  // Synchronize browser tab document.title and meta description dynamically based on active route
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Do not override if user is viewing a deep news article (managed by SEOManager)
    const pathname = window.location.pathname;
    if (pathname.startsWith('/news/') && pathname !== '/news') {
      return;
    }

    const meta = ROUTE_META[activeTab] || ROUTE_META['news'];
    if (document.title !== meta.title) {
      document.title = meta.title;
    }

    const updateMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('name', 'description', meta.description);
    updateMetaTag('name', 'title', meta.title);
    updateMetaTag('property', 'og:title', meta.title);
    updateMetaTag('property', 'og:description', meta.description);
    updateMetaTag('name', 'twitter:title', meta.title);
    updateMetaTag('name', 'twitter:description', meta.description);
  }, [activeTab]);

  // App Badging API Manager: Clear home screen icon badge on App Open & Visibility Change
  useEffect(() => {
    const clearBadge = async () => {
      try {
        if (typeof window !== 'undefined' && 'clearAppBadge' in navigator) {
          await (navigator as any).clearAppBadge();
        } else if (typeof window !== 'undefined' && 'setAppBadge' in navigator) {
          await (navigator as any).setAppBadge(0);
        }
      } catch (e) {
        // Ignore unsupported platforms
      }
    };

    clearBadge();

    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        clearBadge();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', clearBadge);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', clearBadge);
      }
    };
  }, []);

  // Monitor Supabase Auth Session (only needed on /admin routes)
  useEffect(() => {
    if (!isAdminRoute) return;

    loadAdminPanel();
    loadLoginScreen();

    let isSubscribed = true;

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (isSubscribed) {
          setSession(session);
          setAuthChecking(false);
        }
      })
      .catch((err) => {
        console.warn('Auth session check error:', err);
        if (isSubscribed) {
          setAuthChecking(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isSubscribed) {
        setSession(session);
        setAuthChecking(false);
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [isAdminRoute]);

  // Monitor browser history state changes for SPA routing fallback
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin' || path.startsWith('/admin'));
      
      if ((path === '/members' || path === '/directory') && FEATURES.enableMembers) {
        setActiveTab('members');
      } else if (path === '/terminal' && FEATURES.enableTerminal) {
        setActiveTab('terminal');
      } else if (path === '/magazine' && FEATURES.enableMagazine) {
        setActiveTab('magazine');
      } else if (path === '/academy' && FEATURES.enableAcademy) {
        setActiveTab('academy');
      } else if (path === '/about' && FEATURES.enableAbout) {
        setActiveTab('about');
      } else if (path === '/register' && FEATURES.enableRegister) {
        setActiveTab('register');
      } else if (path === '/terms') {
        setActiveTab('terms');
      } else if (path === '/privacy') {
        setActiveTab('privacy');
      } else if (path === '/cookies') {
        setActiveTab('cookies');
      } else if (path === '/disclosures') {
        setActiveTab('disclosures');
      } else {
        // If path is not root / or /admin or /news or /articles, redirect back to /
        if (path !== '/' && !path.startsWith('/admin') && !path.startsWith('/news') && !path.startsWith('/articles')) {
          window.history.replaceState({}, '', '/');
        }
        setActiveTab('news');
      }
    };

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('/')) {
        const href = anchor.getAttribute('href') || '/';
        if (href === '/admin' || href.startsWith('/admin')) return;
        
        e.preventDefault();
        window.history.pushState({}, '', href);
        handleLocationChange();
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const handleTabChange = (tab: string) => {
    const updateView = () => {
      setActiveTab(tab);
      if (typeof window !== 'undefined') {
        if (tab === 'news') {
          window.history.pushState({}, '', '/');
        } else {
          window.history.pushState({}, '', `/${tab}`);
        }
      }
    };

    if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
      const transition = document.startViewTransition(updateView);
      transition.finished.finally(() => {
        document.getElementById('main-content')?.focus({ preventScroll: true });
      });
    } else {
      updateView();
      if (typeof document !== 'undefined') {
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }
    }
  };

  useWebMCP<{ section?: string }, unknown>({
    name: 'navigate_energeia_section',
    description: 'Navigates the Energeia Cyprus energy portal to a target section.',
    inputSchema: NAVIGATE_SECTION_SCHEMA,
    annotations: { readOnlyHint: true },
    execute({ section = 'news' }) {
      if (typeof section !== 'string' || !NAV_SECTIONS.includes(section as any)) {
        return { error: 'Unsupported section name.', supportedSections: NAV_SECTIONS };
      }
      handleTabChange(section);
      return { navigatedTo: section };
    },
  });

  const navigateToHome = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
    }
    setRefreshKey(prev => prev + 1); // reload news
  };

  if (isAdminRoute) {
    if (authChecking) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#121212] gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Verifying authorization...</p>
        </div>
      );
    }

    return (
      <InitialDataProvider value={initialData}>
        <AdminErrorBoundary>
          {!session ? (
            <Suspense
              fallback={
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#121212] gap-3">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Loading Sign In...</p>
                </div>
              }
            >
              <LoginScreen onSuccess={() => setIsAdminRoute(true)} />
            </Suspense>
          ) : (
            <Suspense
              fallback={
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#121212] gap-3">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Loading Admin Portal...</p>
                </div>
              }
            >
              <AdminPanel onClose={navigateToHome} />
            </Suspense>
          )}
        </AdminErrorBoundary>
      </InitialDataProvider>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'news':
        return <NewsFeedScreen key={refreshKey} language={language} path={currentPath} />;
      case 'terminal':
        return FEATURES.enableTerminal ? <TerminalScreen /> : <NewsFeedScreen key={refreshKey} language={language} path={currentPath} />;
      case 'members':
        return FEATURES.enableMembers ? <DirectoryScreen /> : <NewsFeedScreen key={refreshKey} language={language} path={currentPath} />;
      case 'magazine':
        return FEATURES.enableMagazine ? <MagazineScreen /> : <NewsFeedScreen key={refreshKey} language={language} path={currentPath} />;
      case 'academy':
        return FEATURES.enableAcademy ? <AcademyScreen /> : <NewsFeedScreen key={refreshKey} language={language} path={currentPath} />;
      case 'about':
        return FEATURES.enableAbout ? <AboutScreen /> : <NewsFeedScreen key={refreshKey} language={language} path={currentPath} />;
      case 'register':
        return FEATURES.enableRegister ? <RegisterScreen /> : <NewsFeedScreen key={refreshKey} language={language} path={currentPath} />;
      case 'terms':
        return <TermsScreen />;
      case 'privacy':
        return <PrivacyScreen />;
      case 'cookies':
        return <CookieScreen />;
      case 'disclosures':
        return <CorporateDisclosuresScreen />;
      default:
        return <NewsFeedScreen key={refreshKey} language={language} path={currentPath} />;
    }
  };

  return (
    <InitialDataProvider value={initialData}>
      <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md selection:bg-primary-container selection:text-on-primary-container">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:font-bold focus:text-xs focus:shadow-md"
        >
          Skip to main content
        </a>
        <ScrollToTop trigger={activeTab} />
        {/* Sticky Top App Bar */}
        <TopAppBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          language={language}
          onLanguageChange={handleLanguageChange}
        />

        {/* Main View Area */}
        <main id="main-content" tabIndex={-1} className="flex-1 w-full flex flex-col main-content pt-16 focus:outline-none">
          <ErrorBoundary>
            <Suspense fallback={null}>
              {renderActiveScreen()}
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Global Footer & Mobile Bottom Navigation Bar */}
        {activeTab !== 'terminal' && <Footer />}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* PWA Home Screen Onboarding Prompt */}
        {mountDeferredUI && (
          <ErrorBoundary>
            <Suspense fallback={null}>
              <PWAInstallPrompt />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </InitialDataProvider>
  );
}
