import { TermsScreen } from './components/legal/TermsScreen';
import { PrivacyScreen } from './components/legal/PrivacyScreen';
import { CookieScreen } from './components/legal/CookieScreen';
import { CorporateDisclosuresScreen } from './components/legal/CorporateDisclosuresScreen';
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { Footer } from './components/Footer';
import { NewsFeedScreen } from './components/NewsFeedScreen';
import { DirectoryScreen } from './components/DirectoryScreen';
import { AboutScreen } from './components/AboutScreen';
import { AdminPanel } from './components/AdminPanel';
import { MagazineScreen } from './components/MagazineScreen';
import { AcademyScreen } from './components/AcademyScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { LoginScreen } from './components/LoginScreen';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { ErrorBoundary } from './components/ErrorBoundary';
import ScrollToTop from './components/navigation/ScrollToTop';
import { useTranslation } from 'react-i18next';
import { FEATURES } from './config/features';
import { InitialDataProvider, InitialData } from './context/InitialDataContext';

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

  // Language state controller (Default to browser language or 'en', save to localStorage)
  const [language, setLanguage] = useState<string>(() => {
    const supportedLangs = ['en', 'el', 'ru', 'he'];
    
    if (typeof window !== 'undefined') {
      // Priority 1: Check manual choice in app_lang or fallback energeia_language
      const saved = localStorage.getItem('app_lang') || localStorage.getItem('energeia_language');
      if (saved && supportedLangs.includes(saved)) {
        if (i18n && typeof i18n.changeLanguage === 'function') i18n.changeLanguage(saved);
        return saved;
      }

      // Priority 2: Check system languages with iw -> he mappings
      const userLangs = navigator.languages || [navigator.language || 'en'];
      for (const lang of userLangs) {
        const code = lang.toLowerCase().split('-')[0];
        if (code === 'iw') {
          if (i18n && typeof i18n.changeLanguage === 'function') i18n.changeLanguage('he');
          return 'he';
        }
        if (supportedLangs.includes(code)) {
          if (i18n && typeof i18n.changeLanguage === 'function') i18n.changeLanguage(code);
          return code;
        }
      }
    }

    // Priority 3: Fallback default
    if (i18n && typeof i18n.changeLanguage === 'function') i18n.changeLanguage('en');
    return 'en';
  });

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_lang', lang);
      localStorage.setItem('energeia_language', lang); // compatibility backup
    }
    if (i18n && typeof i18n.changeLanguage === 'function') i18n.changeLanguage(lang);
  };

  // Synchronize HTML attributes (RTL dir and lang locale)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
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

  // Monitor Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      if (tab === 'news') {
        window.history.pushState({}, '', '/');
      } else {
        window.history.pushState({}, '', `/${tab}`);
      }
    }
  };

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
          <LoginScreen onSuccess={() => setIsAdminRoute(true)} />
        </InitialDataProvider>
      );
    }
    return (
      <InitialDataProvider value={initialData}>
        <AdminPanel onClose={navigateToHome} />
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
        <ScrollToTop trigger={activeTab} />
        {/* Sticky Top App Bar */}
        <TopAppBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          language={language}
          onLanguageChange={handleLanguageChange}
        />

        {/* Main View Area */}
        <main className="flex-1 w-full flex flex-col main-content pt-16">
          <ErrorBoundary>
            {renderActiveScreen()}
          </ErrorBoundary>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Mobile Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* PWA Home Screen Onboarding Prompt */}
        <ErrorBoundary>
          <PWAInstallPrompt />
        </ErrorBoundary>
      </div>
    </InitialDataProvider>
  );
}
