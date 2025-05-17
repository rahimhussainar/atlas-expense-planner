
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TripImageUploadProps {
  previewUrl: string | null;
  onImageChange: (file: File | null) => void;
  onRemoveImage: () => void;
}

const TripImageUpload: React.FC<TripImageUploadProps> = ({ 
  previewUrl, 
  onImageChange, 
  onRemoveImage 
}) => {
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive',
        });
        return;
      }
      onImageChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Cover Image</Label>
      <div className="mt-2">
        {previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Cover preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-atlas-forest transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default TripImageUpload;
