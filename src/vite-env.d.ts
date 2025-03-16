
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend Window interface to include SUPABASE_CONFIG
interface Window {
  SUPABASE_CONFIG?: {
    url: string;
    key: string;
  };
  showError?: (title: string, message: string) => void;
}
