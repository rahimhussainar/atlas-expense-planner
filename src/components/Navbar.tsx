import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    if (user) {
      fetchProfileAvatar();
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const fetchProfileAvatar = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching avatar:', error);
        return;
      }
      
      if (data?.avatar_url) {
        // Add a cache busting parameter to force refresh
        const cacheBuster = `?t=${new Date().getTime()}`;
        setAvatarUrl(`${data.avatar_url}${cacheBuster}`);
      }
    } catch (error) {
      console.error('Error in fetchProfileAvatar:', error);
    }
  };
  
  const getInitials = () => {
    if (!user?.email) return '?';
    return user.email.substring(0, 2).toUpperCase();
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-background/95 dark:bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
        : 'bg-background/80 dark:bg-background/80 backdrop-blur-md border-b border-border/50'
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
        </div>
        
        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <a 
            href="#features" 
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium"
          >
            How it Works
          </a>
          <a 
            href="#pricing" 
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium"
          >
            Pricing
          </a>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Theme toggle button */}
          <button
            className="h-9 w-9 p-0 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-muted flex items-center justify-center transition-colors duration-200"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar>
                    {avatarUrl ? (
                      <AvatarImage 
                        src={avatarUrl} 
                        alt="Profile" 
                        onError={() => {
                          console.log("Avatar image failed to load");
                          setAvatarUrl(null);
                        }} 
                      />
                    ) : null}
                    <AvatarFallback className="bg-[#4a6c6f] text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => navigate('/dashboard')}
                  className="cursor-pointer"
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="cursor-pointer"
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                Log in
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-[#4a6c6f] hover:bg-[#3a5c5f] text-white transition-all shadow-md hover:shadow-lg"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
