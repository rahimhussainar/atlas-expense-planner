import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Logo from '@/components/Logo';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

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
  const { theme, setTheme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center relative">
          <Logo />
          <button
            className="absolute right-0 top-0 h-9 w-9 p-0 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-muted flex items-center justify-center"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        <div className="w-full bg-card rounded-xl shadow-md p-8">
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold text-card-foreground">Welcome</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account or create a new one</p>
          </div>
          <div className="flex w-full mb-6 rounded-lg overflow-hidden border border-border">
            <button
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${tab === 'login' ? 'bg-muted text-card-foreground' : 'bg-card text-muted-foreground hover:bg-muted/70'}`}
              onClick={() => setTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${tab === 'register' ? 'bg-muted text-card-foreground' : 'bg-card text-muted-foreground hover:bg-muted/70'}`}
              onClick={() => setTab('register')}
            >
              Sign Up
            </button>
          </div>
          {tab === 'login' ? (
            <>
              {loginTab}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account? <button className="text-atlas-forest font-semibold hover:underline" onClick={() => setTab('register')}>Sign up</button>
              </div>
            </>
          ) : (
            <>
              {registerTab}
              <div className="mt-6 text-center text-sm text-muted-foreground">
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
