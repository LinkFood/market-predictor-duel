
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add error handling for React rendering
try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  // Check if Supabase is properly configured
  const supabaseConfig = (window as any).SUPABASE_CONFIG;
  if (!supabaseConfig || !supabaseConfig.url || !supabaseConfig.key) {
    console.error("Supabase configuration is missing or incomplete");
    if (typeof (window as any).showError === 'function') {
      (window as any).showError(
        "Configuration Error", 
        "Supabase configuration is missing or incomplete. Please check your index.html file."
      );
    } else {
      if (rootElement) {
        rootElement.innerHTML = `
          <div style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e11d48;">Configuration Error</h1>
            <p>Supabase configuration is missing or incomplete. Please check your index.html file.</p>
          </div>
        `;
      }
    }
  } else {
    // Render the app
    createRoot(rootElement).render(<App />);
  }
} catch (error) {
  console.error("Failed to render React application:", error);
  const rootElement = document.getElementById("root");
  
  if (typeof (window as any).showError === 'function') {
    (window as any).showError(
      "Application Error", 
      `Failed to render the application: ${error instanceof Error ? error.message : String(error)}`
    );
  } else if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e11d48;">Application Error</h1>
        <p>Failed to render the application: ${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
}
