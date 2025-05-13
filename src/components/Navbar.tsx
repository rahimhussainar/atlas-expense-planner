
import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full py-4 px-6 md:px-8 lg:px-12 flex items-center justify-between">
      <Logo />
      
      <div className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors">Features</a>
        <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors">How it Works</a>
      </div>
      
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <Button variant="ghost" className="hidden md:inline-flex">Log in</Button>
        <Button className="bg-atlas-slate hover:bg-atlas-slate-dark text-white">Sign up</Button>
      </div>
    </nav>
  );
};

export default Navbar;
