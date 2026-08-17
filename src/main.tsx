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

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('SW registered successfully:', reg.scope);
      })
      .catch(err => {
        console.error('SW registration failed:', err);
      });
  });
}
