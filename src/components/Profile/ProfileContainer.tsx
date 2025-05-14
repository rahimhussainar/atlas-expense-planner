
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ProfileAvatar from './ProfileAvatar';
import ProfileForm from './ProfileForm';

interface ProfileData {
  fullName: string;
  avatarUrl: string | null;
}

const ProfileContainer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    avatarUrl: null,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfileData({
        fullName: data?.full_name || '',
        avatarUrl: data?.avatar_url || null,
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error fetching profile',
        description: error.message || 'Could not load your profile information.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (url: string) => {
    setProfileData({
      ...profileData,
      avatarUrl: url,
    });
  };

  const handleProfileUpdate = (fullName: string) => {
    setProfileData({
      ...profileData,
      fullName,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')} 
          className="mr-2"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> 
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atlas-forest" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {user && (
                  <>
                    <ProfileAvatar 
                      avatarUrl={profileData.avatarUrl} 
                      userId={user.id}
                      onAvatarUpdate={handleAvatarUpdate}
                    />
                    
                    <ProfileForm 
                      fullName={profileData.fullName}
                      email={user.email}
                      userId={user.id}
                      onProfileUpdate={handleProfileUpdate}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
