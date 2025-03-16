
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error handler function to show startup errors
const handleStartupError = (error: Error) => {
  console.error('Application startup error:', error);
  
  // Render error message to DOM
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 40rem; margin: 0 auto; text-align: center;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Application Error</h1>
        <p style="margin-bottom: 1.5rem;">We encountered an error while starting the application:</p>
        <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.375rem; text-align: left; overflow-wrap: break-word;">
          <p><strong>${error.name}:</strong> ${error.message}</p>
          ${error.stack ? `<pre style="margin-top: 1rem; overflow-x: auto; font-size: 0.75rem;">${error.stack}</pre>` : ''}
        </div>
        <div style="margin-top: 1.5rem;">
          <button onclick="window.location.reload()" style="background: #4f46e5; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer;">
            Reload Application
          </button>
        </div>
      </div>
    `;
  }
};

try {
  // Set Supabase configuration from environment variables
  window.SUPABASE_CONFIG = {
    url: import.meta.env.VITE_SUPABASE_URL || window.SUPABASE_CONFIG?.url || "https://iphpwxputfwxsiwdmqmk.supabase.co",
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || window.SUPABASE_CONFIG?.key || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwaHB3eHB1dGZ3eHNpd2RtcW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwOTc1OTgsImV4cCI6MjA1NzY3MzU5OH0.f3UDw6w8FGXz-SpQKlcsGFzyxCOICaUANeBJ2lCYFlE"
  };

  // Log configuration for debugging
  console.log('Supabase config loaded:', 
    window.SUPABASE_CONFIG?.url ? 'URL ✓' : 'URL ✗', 
    window.SUPABASE_CONFIG?.key ? 'Key ✓' : 'Key ✗'
  );

  // For development, show better error messages on config issues
  window.showError = (title, message) => {
    console.error(`${title}: ${message}`);
  };

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  handleStartupError(error as Error);
}
