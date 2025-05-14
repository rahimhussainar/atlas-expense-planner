import React from 'react';
import { Separator } from '@/components/ui/separator';

interface AuthSeparatorProps {
  text: string;
}

const AuthSeparator: React.FC<AuthSeparatorProps> = ({ text }) => {
  return (
    <div className="flex items-center w-full my-5">
      <div className="flex-grow h-px bg-gray-200" />
      <span className="mx-4 text-xs font-medium text-gray-400 uppercase whitespace-nowrap">{text}</span>
      <div className="flex-grow h-px bg-gray-200" />
    </div>
  );
};

export default AuthSeparator;
