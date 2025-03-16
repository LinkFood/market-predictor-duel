
interface Window {
  SUPABASE_CONFIG: {
    url: string;
    key: string;
  };
  showError: (title: string, message: string) => void;
}
