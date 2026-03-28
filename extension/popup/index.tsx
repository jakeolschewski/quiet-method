/**
 * Quiet Method — Popup Entry Point
 * React 19 application for the extension popup.
 *
 * © WEDGE METHOD LLC
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
