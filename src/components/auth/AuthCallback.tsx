
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from '@/hooks/use-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get ?code=XXX from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        if (!code) {
          setError('No authentication code found in URL');
          return;
        }

        // Exchange code for session
        const { error: err } = await supabase.auth.exchangeCodeForSession(code);
        
        if (err) {
          console.error('Error exchanging code for session:', err);
          setError(err.message);
          toast({
            title: 'Authentication Error',
            description: err.message,
            variant: 'destructive',
          });
          return;
        }

        // Success - redirect to app
        navigate('/app', { replace: true });
        toast({
          title: 'Authentication Successful',
          description: 'You have been successfully authenticated.',
        });
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred');
        toast({
          title: 'Authentication Error',
          description: 'An unexpected error occurred during authentication.',
          variant: 'destructive',
        });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Authentication Error</h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
          <div className="mt-5">
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <LoadingScreen message="Completing authentication..." />;
};

export default AuthCallback;
