import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/index.css';

// Service worker registration is declared in global.d.ts

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  // ErrorBoundary is handled inside App.tsx to have access to providers
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  // --- PWA Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          // Store the registration for later use (e.g., periodic sync)
          window.swRegistration = registration;
        })
        .catch(() => {
          // Service worker registration failed silently
        });
    });

    // --- PWA Update Logic ---
    // This listens for the 'controllerchange' event, which fires when the service
    // worker controlling the page changes, indicating a successful update.
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  }
}

