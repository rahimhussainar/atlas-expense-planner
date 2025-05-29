import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PasswordInput from './PasswordInput';
import SocialAuthButton from './SocialAuthButton';
import AuthSeparator from './AuthSeparator';

interface RegisterFormProps {
  onRegister: (email: string, password: string, fullName: string) => Promise<void>;
  onGoogleSignIn: () => void;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onGoogleSignIn, isLoading }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    await onRegister(email, password, fullName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="full-name" className="block text-sm font-medium text-white">
          Full Name
        </label>
        <div className="relative">
          <Input
            id="full-name"
            placeholder="Enter your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-10 h-11 text-sm rounded-lg border-gray-300 focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f]"
            required
          />
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="register-email" className="block text-sm font-medium text-white">
          Email
        </label>
        <div className="relative">
          <Input
            id="register-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-11 text-sm rounded-lg border-gray-300 focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f]"
            required
          />
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="register-password" className="block text-sm font-medium text-white">
          Password
        </label>
        <PasswordInput
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="confirm-password" className="block text-sm font-medium text-white">
          Confirm Password
        </label>
        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-11 bg-[#4a6c6f] hover:bg-[#395457] text-sm font-medium rounded-lg"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
      <AuthSeparator text="or continue with" />
      <SocialAuthButton
        onClick={onGoogleSignIn}
        icon="/google.svg"
        label="Sign up with Google"
      />
    </form>
  );
};

export default RegisterForm;
