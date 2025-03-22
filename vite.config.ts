
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Define any default env variables here
  define: {
    // This ensures that even if VITE_POLYGON_API_KEY is not defined, the app will not crash
    'import.meta.env.VITE_POLYGON_API_KEY': JSON.stringify(process.env.VITE_POLYGON_API_KEY || '')
  }
}));
