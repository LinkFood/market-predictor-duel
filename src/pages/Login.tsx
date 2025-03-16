
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        setError(error.message || 'Failed to sign in');
        return;
      }
      
      // If successful, navigate to the app
      navigate('/app');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="mx-auto flex items-center gap-2 text-indigo-600">
            <TrendingUp className="h-6 w-6" />
            <span className="font-bold text-xl">StockDuel</span>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={errors.email ? 'border-red-500' : ''}
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
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={errors.password ? 'border-red-500' : ''}
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
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
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
