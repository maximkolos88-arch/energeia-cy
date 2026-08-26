import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/i18n';

document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
document.documentElement.setAttribute('data-theme', 'light');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Clear app badge when application opens
if (navigator && 'clearAppBadge' in navigator) {
  navigator.clearAppBadge().catch((e) => console.warn('Failed to clear app badge:', e));
}

// Register service worker with immediate update checking and controller change auto-reload
if ('serviceWorker' in navigator) {
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
