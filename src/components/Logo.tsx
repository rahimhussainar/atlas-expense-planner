import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-9',
    lg: 'h-12',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizes[size]} aspect-square relative`}>
        <div className="absolute inset-0 bg-[#4a6c6f] dark:bg-[#4a6c6f] rounded-full"></div>
        <div className="absolute inset-[15%] bg-white dark:bg-background rounded-full flex items-center justify-center">
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
