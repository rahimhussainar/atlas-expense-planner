import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Logo from '@/components/Logo';

interface AuthLayoutProps {
  loginTab: ReactNode;
  registerTab: ReactNode;
  defaultTab?: 'login' | 'register';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  loginTab, 
  registerTab, 
  defaultTab = 'login' 
}) => {
  const [tab, setTab] = React.useState<'login' | 'register'>(defaultTab);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="w-full bg-white rounded-xl shadow-md p-8">
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account or create a new one</p>
          </div>
          <div className="flex w-full mb-6 rounded-lg overflow-hidden border border-gray-200">
            <button
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${tab === 'login' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${tab === 'register' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setTab('register')}
            >
              Sign Up
            </button>
          </div>
          {tab === 'login' ? (
            <>
              {loginTab}
              <div className="mt-6 text-center text-sm text-gray-500">
                Don't have an account? <button className="text-atlas-forest font-semibold hover:underline" onClick={() => setTab('register')}>Sign up</button>
              </div>
            </>
          ) : (
            <>
              {registerTab}
              <div className="mt-6 text-center text-sm text-gray-500">
                Already have an account? <button className="text-atlas-forest font-semibold hover:underline" onClick={() => setTab('login')}>Login</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
