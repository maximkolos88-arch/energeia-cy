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

export default function App() {
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
      } else if (path === '/' || path === '') {
        setActiveTab('news');
      }
    };

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target) {
        const href = target.getAttribute('href');
        // Only intercept local relative paths, not external URLs or hashes
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          e.preventDefault();
          window.history.pushState({}, '', href);
          handleLocationChange();
        }
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
        return <NewsFeedScreen key={refreshKey} />;
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
        return <NewsFeedScreen key={refreshKey} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Sticky Top App Bar */}
      <TopAppBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full flex flex-col">
        {renderActiveScreen()}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
