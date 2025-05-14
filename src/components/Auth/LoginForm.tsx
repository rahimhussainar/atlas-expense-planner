import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PasswordInput from './PasswordInput';
import SocialAuthButton from './SocialAuthButton';
import AuthSeparator from './AuthSeparator';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onGoogleSignIn, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <PasswordInput
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <div className="text-right">
          <button type="button" className="text-sm text-atlas-forest hover:underline bg-transparent border-0 p-0">Forgot password?</button>
        </div>
        <Button
          type="submit"
          className="w-full h-11 bg-atlas-forest hover:bg-atlas-forest/90 text-sm font-medium rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Login'}
        </Button>
        <AuthSeparator text="or continue with" />
        <SocialAuthButton
          onClick={onGoogleSignIn}
          icon="/google.svg"
          label="Sign in with Google"
        />
      </form>
    </div>
  );
};

export default LoginForm;
