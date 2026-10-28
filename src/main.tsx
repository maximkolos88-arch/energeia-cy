import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/i18n';
import { InitialData } from './context/InitialDataContext';

// Trusted Types baseline tinyfill & default policy for DOM XSS protection
if (typeof window !== 'undefined') {
  const win = window as any;
  if (!win.trustedTypes) {
    win.trustedTypes = {
      createPolicy: (_name: string, rules: Record<string, unknown>) => rules,
    };
  } else if (win.trustedTypes.createPolicy && !win.trustedTypes.defaultPolicy) {
    try {
      win.trustedTypes.createPolicy('default', {
        createHTML: (input: string) => input,
        createScriptURL: (input: string) => input,
        createScript: (input: string) => input,
      });
    } catch {
      // Policy already exists or restricted by CSP
    }
  }

  // Ensure document.modelContext is available on Chromium 146-149 where navigator.modelContext was used
  if (typeof document !== 'undefined' && !('modelContext' in document) && 'modelContext' in navigator) {
    (document as any).modelContext = (navigator as any).modelContext;
  }
}

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

// Register service worker with update checking (only reload when replacing an existing controller)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        reg.update();
      })
      .catch(err => {
        console.warn('SW registration failed:', err);
      });
  });
}
