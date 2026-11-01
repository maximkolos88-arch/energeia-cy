import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { InitialData } from './context/InitialDataContext';
import './lib/i18n';

export function render(url: string, initialData?: InitialData, hostname?: string) {
  const html = renderToString(
    <React.StrictMode>
      <App path={url} initialData={initialData} hostname={hostname} />
    </React.StrictMode>
  );
  return { html };
}
