import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  
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
    <header className="bg-background shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-x-6">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <Logo />
          </div>
          
          <nav className="hidden md:flex space-x-4">
            <Button 
              variant="ghost" 
              className="text-foreground hover:bg-atlas-forest hover:text-white"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
          <button
            className="h-9 w-9 p-0 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-muted flex items-center justify-center"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
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
                  <AvatarFallback className="bg-atlas-forest text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
