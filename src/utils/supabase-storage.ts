import { supabase } from '@/integrations/supabase/client';

/**
 * Extracts the file path from a Supabase storage URL
 */
export function getFilePathFromUrl(url: string): string | null {
  if (!url) return null;
  
  // Extract path after '/storage/v1/object/public/activity-images/'
  const match = url.match(/\/storage\/v1\/object\/public\/activity-images\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * Deletes an activity image from storage
 */
export async function deleteActivityImage(imageUrl: string | null): Promise<void> {
  if (!imageUrl) return;
  
  const filePath = getFilePathFromUrl(imageUrl);
  if (!filePath) return;
  
  try {
    const { error } = await supabase.storage
      .from('activity-images')
      .remove([filePath]);
      
    if (error) {
      console.error('Error deleting activity image:', error);
    }
  } catch (error) {
    console.error('Error in deleteActivityImage:', error);
  }
}

/**
 * Uploads a new activity image and optionally deletes the old one
 */
export async function uploadActivityImage(
  file: File,
  userId: string,
  oldImageUrl?: string | null
): Promise<string | null> {
  try {
    // Upload new image
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('activity-images')
      .upload(fileName, file);
      
    if (uploadError) {
      console.error('Error uploading activity image:', uploadError);
      return null;
    }
    
    // Get public URL for new image
    const { data: publicUrlData } = supabase.storage
      .from('activity-images')
      .getPublicUrl(fileName);
      
    // Delete old image if it exists
    if (oldImageUrl) {
      await deleteActivityImage(oldImageUrl);
    }
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadActivityImage:', error);
    return null;
  }
} 