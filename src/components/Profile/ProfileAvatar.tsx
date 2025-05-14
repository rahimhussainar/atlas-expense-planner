
import React, { useState } from 'react';
import { User, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  userId: string;
  onAvatarUpdate: (url: string) => void;
}

// Helper function to get the correct MIME type based on file extension
const getMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

const ProfileAvatar = ({ avatarUrl, userId, onAvatarUpdate }: ProfileAvatarProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0 || !userId) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop() || '';
      
      // Get the correct MIME type based on file extension
      const contentType = getMimeType(fileExt);
      
      // Create a specific path that includes the user ID at the beginning
      const filePath = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload the file to the avatars bucket with the correct content type
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: contentType // Set the correct content type
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
        .eq('id', userId);

      if (updateError) throw updateError;

      // Call the callback with the new URL
      onAvatarUpdate(publicUrlData.publicUrl);

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
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-3">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="Profile" 
            className="h-full w-full object-cover"
            onError={(e) => {
              // If image fails to load, show fallback
              const target = e.target as HTMLImageElement;
              console.log('Image failed to load:', target.src);
              target.onerror = null; // Prevent infinite loop
              target.style.display = 'none'; // Hide the broken image
              // Show a fallback icon
              const parent = target.parentElement;
              if (parent) {
                parent.classList.add('flex', 'items-center', 'justify-center');
                const fallback = document.createElement('div');
                fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                parent.appendChild(fallback);
              }
            }}
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
      
      <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center justify-center text-sm text-atlas-forest hover:text-atlas-forest/80 transition-colors">
        <Upload size={16} className="mr-1" />
        {avatarUrl ? 'Change Photo' : 'Upload Photo'}
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
  );
};

export default ProfileAvatar;
