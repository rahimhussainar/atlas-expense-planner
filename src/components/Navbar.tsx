
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

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchProfileAvatar();
    }
  }, [user]);
  
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
    <nav className="flex justify-between items-center w-full py-3 md:py-4 px-4 md:px-6 sticky top-0 left-0 z-10 bg-white/80 backdrop-blur-sm">
      <Logo />
      
      <div className="hidden md:flex items-center space-x-6">
        <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
        <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How it Works</a>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-3">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
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
                  <AvatarFallback className="bg-atlas-forest text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-sm h-9"
            >
              Log in
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-atlas-forest hover:bg-atlas-forest/80 text-white text-sm h-9"
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
