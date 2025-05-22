import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

const ImageUploadModal = ({ open, onOpenChange, imageUrl, setImageUrl, uploadedImage, setUploadedImage, onImageUpload, onImageSubmit, selectedActivity }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <ImageIcon className="mr-2 h-5 w-5" />
          Add Activity Image
        </DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </label>
          </div>
          {uploadedImage && (
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </TabsContent>
        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <div className="flex space-x-2">
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (imageUrl) {
                    // Here you would validate the URL
                    console.log('Using image URL:', imageUrl);
                  }
                }}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {imageUrl && (
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          onClick={() => {
            onOpenChange(false);
            setImageUrl('');
            setUploadedImage(null);
          }}
        >
          Cancel
        </Button>
        <Button onClick={onImageSubmit}>
          Save Image
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default ImageUploadModal; 