
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="mb-6">
        <Logo />
      </div>
      
      <Card className="w-full max-w-md p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-50">
            <TabsTrigger value="login" className="text-sm">Sign In</TabsTrigger>
            <TabsTrigger value="register" className="text-sm">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={handleGoogleSignIn} 
                className="w-full py-2 flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 rounded-md"
              >
                <img src="/google.svg" alt="Google" className="w-4 h-4" />
                <span className="text-sm">Sign in with Google</span>
              </Button>

              <div className="flex items-center my-3">
                <Separator className="flex-grow" />
                <span className="px-3 text-gray-400 text-xs">OR CONTINUE WITH EMAIL</span>
                <Separator className="flex-grow" />
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Email address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-9 h-10"
                      required
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="h-10"
                    required
                  />
                </div>
                
                <div className="text-xs text-right">
                  <a href="#" className="text-atlas-forest hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-atlas-forest hover:bg-atlas-forest/90 text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full py-2 flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 rounded-md"
              >
                <img src="/google.svg" alt="Google" className="w-4 h-4" />
                <span className="text-sm">Sign up with Google</span>
              </Button>

              <div className="flex items-center my-3">
                <Separator className="flex-grow" />
                <span className="px-3 text-gray-400 text-xs">OR CONTINUE WITH EMAIL</span>
                <Separator className="flex-grow" />
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="space-y-1">
                  <Input
                    id="full-name"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-10"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Email address"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-9 h-10"
                      required
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="h-10"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10"
                    required
                  />
                </div>
                
                {error && <p className="text-red-500 text-xs">{error}</p>}
                
                <Button
                  type="submit"
                  className="w-full h-10 bg-atlas-forest hover:bg-atlas-forest/90 text-sm"
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
