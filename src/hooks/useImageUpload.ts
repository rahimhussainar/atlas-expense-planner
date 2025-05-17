
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useImageUpload = (initialImageUrl: string | null) => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setPreviewUrl(null);
  };

  const uploadImage = async (userId: string) => {
    if (!coverImage) return previewUrl;
    
    const fileExt = coverImage.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('trip-covers')
      .upload(fileName, coverImage);
      
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('trip-covers')
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  return {
    coverImage,
    previewUrl,
    handleImageChange,
    removeImage,
    uploadImage
  };
};
