
import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import AuthLayout from '@/components/Auth/AuthLayout';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  const [isLoading, setIsLoading] = useState(false);
  
  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    
    try {
      await signUp(email, password, fullName);
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast({
      title: "Coming Soon",
      description: "Google Sign In will be available once Supabase Google Auth is configured",
    });
  };

  return (
    <AuthLayout
      loginTab={
        <LoginForm
          onLogin={handleLogin}
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isLoading}
        />
      }
      registerTab={
        <RegisterForm
          onRegister={handleRegister}
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isLoading}
        />
      }
    />
  );
};

export default Auth;
