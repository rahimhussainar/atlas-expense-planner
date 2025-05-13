
import React from 'react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full py-4 px-6 md:px-8 lg:px-12 flex items-center justify-between">
      <Logo />
      
      <div className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
        <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How it Works</a>
      </div>
    </nav>
  );
};

export default Navbar;
