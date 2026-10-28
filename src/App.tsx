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
const AdminPanel = React.lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const LoginScreen = React.lazy(() => import('./components/LoginScreen').then(m => ({ default: m.LoginScreen })));

const NAV_SECTIONS = ['news', 'members', 'magazine', 'academy', 'about', 'register', 'terms', 'privacy', 'cookies', 'disclosures'] as const;

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

export interface AppProps {
  path?: string;
  initialData?: InitialData;
}

export default function App({ path: propPath, initialData }: AppProps) {
  const { i18n } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
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
    if (!session) {
      return (
        <InitialDataProvider value={initialData}>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-neutral-500">Loading...</div>}>
            <LoginScreen onSuccess={() => setIsAdminRoute(true)} />
          </Suspense>
        </InitialDataProvider>
      );
    }
    return (
      <InitialDataProvider value={initialData}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-neutral-500">Loading Admin...</div>}>
          <AdminPanel onClose={navigateToHome} />
        </Suspense>
      </InitialDataProvider>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'news':
        return <NewsFeedScreen key={refreshKey} language={language} path={currentPath} />;
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
        <Footer />
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
