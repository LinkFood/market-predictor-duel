
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast, toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client"; 
import FormAlerts from "@/components/auth/FormAlerts";
import { useSupabaseCheck } from "@/hooks/use-supabase-check";

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional()
});

export type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast: toastHelper } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { supabaseError } = useSupabaseCheck();
  
  const from = location.state?.from?.pathname || '/app';
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  const rememberMe = watch('remember');

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      console.log("Attempting login with:", data.email);
      console.log("Remember Me:", data.remember);
      
      // The signInWithPassword method doesn't accept data in options
      // Store the remember preference in localStorage or other state management 
      // instead of trying to pass it to Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (authError) {
        console.error("Login error:", authError);
        setError(authError.message);
        return;
      }
      
      // If remember me is checked, we could store this preference locally
      if (data.remember) {
        localStorage.setItem('rememberUser', 'true');
      } else {
        localStorage.removeItem('rememberUser');
      }
      
      setSuccess("Login successful");
      
      toast({
        title: "Login successful",
        description: "Welcome back to StockDuel!",
      });
      
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError('An unexpected error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
      <div className="space-y-4">
        <FormAlerts 
          error={error} 
          success={success} 
          supabaseError={supabaseError}
        />
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              to="/forgot-password" 
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password"
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            {...register('remember')}
          />
          <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4 mt-6">
        <Button 
          className="w-full bg-indigo-600 hover:bg-indigo-700" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
        
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
