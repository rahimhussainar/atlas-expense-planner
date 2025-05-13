
import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';
import { Mail } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await signIn(loginEmail, loginPassword);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled by the Auth context and displayed via toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(registerEmail, registerPassword, fullName);
      // Don't navigate - user needs to confirm email first
    } catch (error) {
      console.error('Registration error:', error);
      // Error is handled by the Auth context and displayed via toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // This will be implemented when Supabase Google Auth is set up
    alert("Google Sign In will be implemented when Supabase Google Auth is configured");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8">
        <Logo />
      </div>
      
      <Card className="w-full max-w-md shadow-lg p-6 bg-white rounded-xl">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-base">Sign In</TabsTrigger>
            <TabsTrigger value="register" className="text-base">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={handleGoogleSignIn} 
                className="w-full p-6 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
              >
                <img src="/google.svg" alt="Google" className="w-5 h-5" />
                <span>Sign in with Google</span>
              </Button>

              <div className="flex items-center my-4">
                <Separator className="flex-grow" />
                <span className="px-4 text-gray-500 text-sm">OR CONTINUE WITH EMAIL</span>
                <Separator className="flex-grow" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Email address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="text-sm text-right">
                  <a href="#" className="text-atlas-forest hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-atlas-forest hover:bg-atlas-forest/90 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full p-6 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
              >
                <img src="/google.svg" alt="Google" className="w-5 h-5" />
                <span>Sign up with Google</span>
              </Button>

              <div className="flex items-center my-4">
                <Separator className="flex-grow" />
                <span className="px-4 text-gray-500 text-sm">OR CONTINUE WITH EMAIL</span>
                <Separator className="flex-grow" />
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="full-name"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Email address"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <Button
                  type="submit"
                  className="w-full h-12 bg-atlas-forest hover:bg-atlas-forest/90 text-base"
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
  );
};

export default Auth;
