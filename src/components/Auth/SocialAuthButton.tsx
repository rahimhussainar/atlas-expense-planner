import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialAuthButtonProps {
  onClick: () => void;
  icon: string;
  label: string;
}

const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({ onClick, icon, label }) => {
  return (
    <Button 
      variant="outline" 
      onClick={onClick} 
      className="w-full flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 text-sm h-11 rounded-lg
        dark:bg-white dark:hover:bg-white dark:text-gray-800 dark:shadow-md dark:hover:scale-[1.02] dark:transition-transform dark:border-gray-200"
    >
      <img src={icon} alt={label} className="w-4 h-4" />
      <span className="font-medium text-gray-700 dark:text-gray-800">{label}</span>
    </Button>
  );
};

export default SocialAuthButton;