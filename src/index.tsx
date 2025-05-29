import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { onCLS, onINP, onLCP } from 'web-vitals';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

onCLS(console.log);
onINP(console.log);
onLCP(console.log);
