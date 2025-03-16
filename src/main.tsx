
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set Supabase configuration from environment variables
window.SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY
};

// For development, show better error messages on config issues
window.showError = (title, message) => {
  console.error(`${title}: ${message}`);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
