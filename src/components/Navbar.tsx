
import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center w-full py-4 px-6 bg-white shadow-sm">
      <Logo />
      
      <div className="hidden md:flex items-center space-x-6">
        <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
        <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How it Works</a>
      </div>
      
      <div className="flex items-center space-x-3">
        {user ? (
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="bg-atlas-forest hover:bg-atlas-forest/80 text-white"
          >
            Dashboard
          </Button>
        ) : (
          <>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="hidden md:inline-flex"
            >
              Log in
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-atlas-forest hover:bg-atlas-forest/80 text-white"
            >
              Sign up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
