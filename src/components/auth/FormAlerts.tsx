
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormAlertsProps {
  error: string | null;
  success: string | null;
  supabaseError: string | null;
}

const FormAlerts: React.FC<FormAlertsProps> = ({ error, success, supabaseError }) => {
  if (!error && !success && !supabaseError) return null;
  
  return (
    <>
      {supabaseError && (
        <Alert variant="destructive">
          <AlertDescription>
            <span className="font-semibold">Configuration Error:</span> {supabaseError}
            <div className="mt-2 text-xs">
              <p>Current Supabase URL: {window.SUPABASE_CONFIG?.url || 'Not set'}</p>
              <p>API Key is {window.SUPABASE_CONFIG?.key ? 'set' : 'not set'}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default FormAlerts;
