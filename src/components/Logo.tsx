
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', darkMode = false }) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-9',
    lg: 'h-12',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizes[size]} aspect-square relative`}>
        <div className="absolute inset-0 bg-atlas-blue rounded-full"></div>
        <div className="absolute inset-[15%] bg-white rounded-full flex items-center justify-center">
          <div className="w-[40%] h-[40%] bg-atlas-coral rounded-full"></div>
        </div>
      </div>
      <span className={`font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'} ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Trip Atlas
      </span>
    </div>
  );
};

export default Logo;
