import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { NewsFeedScreen } from './components/NewsFeedScreen';
import { DirectoryScreen } from './components/DirectoryScreen';
import { AboutScreen } from './components/AboutScreen';
import { AdminPanel } from './components/AdminPanel';
import { MagazineScreen } from './components/MagazineScreen';
import { AcademyScreen } from './components/AcademyScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { LoginScreen } from './components/LoginScreen';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { useTranslation } from 'react-i18next';
import './index.css';

export default function App() {
  const { i18n } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '/members' || path === '/directory') return 'members';
    if (path === '/magazine') return 'magazine';
    if (path === '/academy') return 'academy';
    if (path === '/about') return 'about';
    if (path === '/register') return 'register';
    return 'news';
  });
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(
    window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')
  );
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Language state controller (Default to browser language or 'en', save to localStorage)
  const [language, setLanguage] = useState<string>(() => {
    const saved = localStorage.getItem('energeia_language');
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    const supported = ['en', 'el', 'ru', 'he'];
    return supported.includes(browserLang) ? browserLang : 'en';
  });

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('energeia_language', lang);
    i18n.changeLanguage(lang);
  };

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
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin' || path.startsWith('/admin'));
      if (path === '/members' || path === '/directory') {
        setActiveTab('members');
      } else if (path === '/magazine') {
        setActiveTab('magazine');
      } else if (path === '/academy') {
        setActiveTab('academy');
      } else if (path === '/about') {
        setActiveTab('about');
      } else if (path === '/register') {
        setActiveTab('register');
      } else {
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
    if (tab === 'news') {
      window.history.pushState({}, '', '/');
    } else if (tab === 'members') {
      window.history.pushState({}, '', '/members');
    } else {
      window.history.pushState({}, '', `/${tab}`);
    }
  };

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    window.dispatchEvent(new Event('popstate'));
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    setRefreshKey(prev => prev + 1); // reload news
  };

  if (isAdminRoute) {
    if (!session) {
      return <LoginScreen onSuccess={() => setIsAdminRoute(true)} />;
    }
    return <AdminPanel onClose={navigateToHome} />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'news':
        return <NewsFeedScreen key={refreshKey} language={language} />;
      case 'members':
        return <DirectoryScreen />;
      case 'magazine':
        return <MagazineScreen />;
      case 'academy':
        return <AcademyScreen />;
      case 'about':
        return <AboutScreen />;
      case 'register':
        return <RegisterScreen />;
      default:
        return <NewsFeedScreen key={refreshKey} language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Sticky Top App Bar */}
      <TopAppBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full flex flex-col main-content">
        {renderActiveScreen()}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* PWA Home Screen Onboarding Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
