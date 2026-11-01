import React from 'react';
import { renderToString } from 'react-dom/server';
import App, { 
  ClusterPortalLayout, 
  ResearchFeedLayout, 
  HeliosTerminalLayout, 
  DirectoryLayout, 
  AcademyLayout,
  TermsScreen,
  PrivacyScreen,
  CookieScreen,
  CorporateDisclosuresScreen,
  MagazineScreen,
  RegisterScreen
} from './App';
import { InitialData } from './context/InitialDataContext';
import './lib/i18n';

async function preloadLazy(comp: any) {
  if (comp && comp._payload) {
    try {
      if (typeof comp._init === 'function') {
        comp._init(comp._payload);
      }
    } catch {}
    if (comp._payload._result && typeof comp._payload._result.then === 'function') {
      await comp._payload._result;
    }
  }
}

export async function render(url: string, initialData?: InitialData, hostname?: string) {
  // Preload target component so renderToString renders synchronously without suspending
  if (url === '/' || url === '') {
    await preloadLazy(ClusterPortalLayout);
  } else if (url.startsWith('/research') || url.startsWith('/news') || url.startsWith('/articles')) {
    await preloadLazy(ResearchFeedLayout);
  } else if (url.startsWith('/helios') || url.startsWith('/terminal')) {
    await preloadLazy(HeliosTerminalLayout);
  } else if (url.startsWith('/members') || url.startsWith('/directory')) {
    await preloadLazy(DirectoryLayout);
  } else if (url.startsWith('/academy')) {
    await preloadLazy(AcademyLayout);
  } else if (url === '/terms') {
    await preloadLazy(TermsScreen);
  } else if (url === '/privacy') {
    await preloadLazy(PrivacyScreen);
  } else if (url === '/cookies') {
    await preloadLazy(CookieScreen);
  } else if (url === '/disclosures') {
    await preloadLazy(CorporateDisclosuresScreen);
  } else if (url === '/magazine') {
    await preloadLazy(MagazineScreen);
  } else if (url === '/register') {
    await preloadLazy(RegisterScreen);
  }

  const html = renderToString(
    <React.StrictMode>
      <App path={url} initialData={initialData} hostname={hostname} />
    </React.StrictMode>
  );
  return { html };
}
