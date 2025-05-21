import React, { useState, useEffect } from 'react';
import { User, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // When the avatarUrl prop changes, update our state
  useEffect(() => {
    if (avatarUrl) {
      // Add a cache-busting parameter to force refresh of the image
      const cacheBuster = `?t=${new Date().getTime()}`;
      setImageUrl(`${avatarUrl}${cacheBuster}`);
    } else {
      setImageUrl(null);
    }
  }, [avatarUrl]);

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
      console.log('Uploading file to path:', filePath);

      // Clear any existing avatar first to avoid storage clutter
      try {
        const { data: listData } = await supabase.storage
          .from('avatars')
          .list(userId);
          
        if (listData && listData.length > 0) {
          console.log('Found existing avatars:', listData);
          const filesToRemove = listData.map(item => `${userId}/${item.name}`);
          const { error: removeError } = await supabase.storage
            .from('avatars')
            .remove(filesToRemove);
          
          if (removeError) {
            console.error('Error removing old avatars:', removeError);
          } else {
            console.log('Successfully removed old avatars');
          }
        }
      } catch (err) {
        console.error('Error cleaning up old avatar files:', err);
      }

      // Upload the file to the avatars bucket with the correct content type
      console.log('Uploading new avatar...');
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: contentType
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }
      console.log('Successfully uploaded new avatar');

      // Get the public URL for the uploaded file
      console.log('Getting public URL...');
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL for the uploaded file');
      }
      console.log('Public URL:', publicUrlData.publicUrl);

      // Update profile with the new avatar URL
      console.log('Updating profile with new avatar URL...');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }
      console.log('Successfully updated profile with new avatar URL');

      // Immediately update the local state with the new URL
      const cacheBuster = `?t=${new Date().getTime()}`;
      const urlWithCacheBuster = `${publicUrlData.publicUrl}${cacheBuster}`;
      setImageUrl(urlWithCacheBuster);
      
      // Call the callback with the new URL (without cache buster)
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
        {imageUrl ? (
          <img 
            src={imageUrl} 
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
        {imageUrl ? 'Change Photo' : 'Upload Photo'}
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
