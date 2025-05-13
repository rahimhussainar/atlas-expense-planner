
import React from 'react';
import { useTheme } from 'next-themes';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const sizes = {
    sm: 'h-6',
    md: 'h-9',
    lg: 'h-12',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizes[size]} aspect-square relative`}>
        <div className="absolute inset-0 bg-atlas-forest rounded-full"></div>
        <div className="absolute inset-[15%] bg-white dark:bg-atlas-charcoal rounded-full flex items-center justify-center">
          <div className="w-[40%] h-[40%] bg-atlas-rust rounded-full"></div>
        </div>
      </div>
      <span className={`font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'} text-gray-800 dark:text-white`}>
        Trip Atlas
      </span>
    </div>
  );
};

export default Logo;
