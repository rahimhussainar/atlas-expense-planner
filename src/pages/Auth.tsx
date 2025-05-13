
import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/Logo';

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(loginEmail, loginPassword);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(registerEmail, registerPassword, fullName);
    } catch (error) {
      console.error('Registration error:', error);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        
        <Card className="w-full p-8 border-0 shadow-sm rounded-xl bg-white">
          <div className="mb-4 text-center">
            <h1 className="text-xl font-semibold text-gray-900">Welcome</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account or create a new one</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white">
              <TabsTrigger value="login" className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-atlas-forest">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-atlas-forest">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-5">
                <Button 
                  variant="outline" 
                  onClick={handleGoogleSignIn} 
                  className="w-full flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 text-sm h-11 rounded-lg"
                >
                  <img src="/google.svg" alt="Google" className="w-4 h-4" />
                  <span className="font-medium text-gray-700">Sign in with Google</span>
                </Button>

                <div className="flex items-center gap-3">
                  <Separator className="flex-grow bg-gray-200" />
                  <span className="text-xs font-normal text-gray-400 uppercase">or continue with email</span>
                  <Separator className="flex-grow bg-gray-200" />
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 h-11 text-sm rounded-lg bg-white border-gray-300 focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest"
                        required
                      />
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 text-sm rounded-lg bg-white border-gray-300 focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest"
                        required
                      />
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <a href="#" className="text-sm text-atlas-forest hover:underline">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-atlas-forest hover:bg-atlas-forest/90 text-sm font-medium rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <div className="space-y-5">
                <Button
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 text-sm h-11 rounded-lg"
                >
                  <img src="/google.svg" alt="Google" className="w-4 h-4" />
                  <span className="font-medium text-gray-700">Sign up with Google</span>
                </Button>

                <div className="flex items-center gap-3">
                  <Separator className="flex-grow bg-gray-200" />
                  <span className="text-xs font-normal text-gray-400 uppercase">or continue with email</span>
                  <Separator className="flex-grow bg-gray-200" />
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <Input
                        id="full-name"
                        placeholder="Enter your name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-11 text-sm rounded-lg bg-white border-gray-300 focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest"
                        required
                      />
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10 h-11 text-sm rounded-lg bg-white border-gray-300 focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest"
                        required
                      />
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 text-sm rounded-lg bg-white border-gray-300 focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest"
                        required
                      />
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 text-sm rounded-lg bg-white border-gray-300 focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest"
                        required
                      />
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-11 bg-atlas-forest hover:bg-atlas-forest/90 text-sm font-medium rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
