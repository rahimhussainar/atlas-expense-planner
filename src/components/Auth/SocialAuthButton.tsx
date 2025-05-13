
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
      className="w-full flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 text-sm h-11 rounded-lg"
    >
      <img src={icon} alt={label} className="w-4 h-4" />
      <span className="font-medium text-gray-700">{label}</span>
    </Button>
  );
};

export default SocialAuthButton;
