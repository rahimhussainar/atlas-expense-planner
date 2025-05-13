
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

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white">
              <TabsTrigger value="login" className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-atlas-forest">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-atlas-forest">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {loginTab}
            </TabsContent>

            <TabsContent value="register">
              {registerTab}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
