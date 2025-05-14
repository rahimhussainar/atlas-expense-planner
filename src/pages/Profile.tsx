
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, User } from 'lucide-react';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';

interface ProfileData {
  fullName: string;
  avatarUrl: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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

  const updateProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: error.message || 'Could not update your profile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0 || !user) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      
      // Create a specific path that includes the user ID at the beginning
      const userId = user.id;
      const filePath = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload the file to the avatars bucket
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL for the uploaded file');
      }

      // Update profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setProfileData({
        ...profileData,
        avatarUrl: publicUrlData.publicUrl,
      });

      toast({
        title: 'Avatar uploaded',
        description: 'Your profile picture has been updated.',
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error uploading avatar',
        description: error.message || 'Could not upload your profile picture.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
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
            <h1 className="text-2xl font-bold">Your Profile</h1>
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
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-2">
                        {profileData.avatarUrl ? (
                          <img 
                            src={profileData.avatarUrl} 
                            alt="Profile" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-gray-200">
                            <User size={48} className="text-gray-400" />
                          </div>
                        )}
                        
                        {uploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="w-full">
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="flex items-center justify-center text-sm font-medium text-atlas-forest hover:text-atlas-forest/80 transition-colors">
                            <Upload size={16} className="mr-1" />
                            {profileData.avatarUrl ? 'Change Photo' : 'Upload Photo'}
                          </div>
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={uploadAvatar}
                            disabled={uploading}
                            className="sr-only"
                          />
                        </Label>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label htmlFor="fullName" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="mt-1 bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      onClick={updateProfile}
                      disabled={loading}
                      className="bg-atlas-forest hover:bg-atlas-forest/90"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
