
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Upload, User } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || '');
      } catch (error: any) {
        toast({ 
          title: 'Error loading profile', 
          description: error.message, 
          variant: 'destructive' 
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL for the selected file
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // Return a function to clean up the URL
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let uploadedUrl = avatarUrl;
      
      // Upload new avatar if a file has been selected
      if (file && user) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        uploadedUrl = publicUrlData.publicUrl;
      }
      
      // Update profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName, 
          avatar_url: uploadedUrl 
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setAvatarUrl(uploadedUrl);
      setFile(null);
      
      toast({ 
        title: 'Profile Updated', 
        description: 'Your profile has been updated successfully.' 
      });
      
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    if (fullName) {
      const names = fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return fullName[0].toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || '?';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2 hover:bg-gray-100"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card className="shadow-md">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
                  <div className="w-full max-w-[180px]">
                    <AspectRatio ratio={1} className="bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-md">
                      <Avatar className="h-full w-full">
                        <AvatarImage 
                          src={previewUrl || avatarUrl} 
                          alt={fullName} 
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-atlas-forest text-white text-2xl">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </AspectRatio>
                  </div>
                  
                  <div className="w-full">
                    <Label 
                      htmlFor="avatar-upload" 
                      className="cursor-pointer flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50 w-full text-center"
                    >
                      <Upload className="h-4 w-4" />
                      Change Photo
                    </Label>
                    <Input 
                      id="avatar-upload"
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden"
                    />
                  </div>
                  
                  {previewUrl && (
                    <p className="text-sm text-gray-500 text-center">
                      Click "Save Changes" to update your profile picture
                    </p>
                  )}
                </div>
                
                <div className="space-y-4 w-full md:w-2/3">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>
              </div>
              
              <CardFooter className="flex justify-end px-0 pt-4 border-t">
                <Button 
                  type="submit" 
                  className="bg-atlas-forest hover:bg-atlas-forest/90" 
                  disabled={isUploading || isLoading}
                >
                  {isUploading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
