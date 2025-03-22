
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured } from "@/lib/supabase";
import { registerSchema, RegisterFormData } from "./register-validation";
import RegisterFormFields from "./RegisterFormFields";
import FormAlerts from "./FormAlerts";
import SubmitButton from "./SubmitButton";
import { useSupabaseCheck } from "@/hooks/use-supabase-check";

const RegisterForm: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Check if Supabase is properly configured
  const { supabaseError } = useSupabaseCheck();
  
  const { 
    register, 
    handleSubmit,
    control,
    formState: { errors } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Check if Supabase is configured before attempting signup
      if (!isSupabaseConfigured()) {
        const configError = getSupabaseConfigError();
        setError(`Supabase is not properly configured: ${configError}`);
        console.error('Supabase configuration error:', configError);
        return;
      }
      
      // Debug info
      console.log("Attempting signup with:", data.email);
      console.log("Terms agreed:", data.terms);
      console.log("Supabase URL:", window.SUPABASE_CONFIG?.url);
      console.log("Supabase key length:", window.SUPABASE_CONFIG?.key?.length);
      
      // Register with supabase - pass username as third argument
      const { error } = await signUp(data.email, data.password, data.username);
      
      if (error) {
        console.error("Signup error:", error);
        // Enhanced error message handling
        if (error.message === 'Load failed') {
          setError('Connection to authentication service failed. Please check your internet connection and try again.');
        } else if (error.message.includes('network')) {
          setError('Network error. Please check your internet connection and try again.');
        } else if (error.message.includes('duplicate')) {
          setError('An account with this email already exists. Please try logging in instead.');
        } else {
          setError(error.message || 'Failed to create account');
        }
        return;
      }
      
      // On success show message
      const successMessage = 'Registration successful! Please check your email to confirm your account.';
      setSuccess(successMessage);
      toast({
        title: "Account created",
        description: successMessage,
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <FormAlerts
          error={error}
          success={success}
          supabaseError={supabaseError}
        />
        
        <RegisterFormFields 
          register={register} 
          errors={errors}
          control={control}
        />
      </div>
      
      <SubmitButton 
        isLoading={isLoading} 
        success={success} 
      />
    </form>
  );
};

// Missing import added
import { getSupabaseConfigError } from "@/lib/supabase";

export default RegisterForm;
