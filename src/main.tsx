import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/i18n';
import { InitialData } from './context/InitialDataContext';

document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
document.documentElement.setAttribute('data-theme', 'light');

const rootElement = document.getElementById('root')!;
const initialData: InitialData | undefined = (window as any).__INITIAL_DATA__;

const appComponent = (
  <StrictMode>
    <App initialData={initialData} />
  </StrictMode>
);

if (rootElement.hasChildNodes() && rootElement.children.length > 0) {
  hydrateRoot(rootElement, appComponent);
} else {
  createRoot(rootElement).render(appComponent);
}

// Clear app badge when application opens
if (typeof navigator !== 'undefined' && 'clearAppBadge' in navigator) {
  navigator.clearAppBadge().catch((e) => console.warn('Failed to clear app badge:', e));
}

// Register service worker with immediate update checking and controller change auto-reload
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        reg.update();
        console.log('SW registered successfully:', reg.scope);
      })
      .catch(err => {
        console.error('SW registration failed:', err);
      });
  });
}
