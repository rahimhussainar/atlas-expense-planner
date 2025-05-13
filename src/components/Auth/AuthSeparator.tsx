
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface AuthSeparatorProps {
  text: string;
}

const AuthSeparator: React.FC<AuthSeparatorProps> = ({ text }) => {
  return (
    <div className="flex items-center gap-3 my-5">
      <Separator className="flex-grow bg-gray-200" />
      <span className="text-xs font-normal text-gray-400 uppercase whitespace-nowrap">{text}</span>
      <Separator className="flex-grow bg-gray-200" />
    </div>
  );
};

export default AuthSeparator;
