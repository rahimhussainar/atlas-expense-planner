import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TripImageUpload from './TripImageUpload';
import TripDateRangePicker from './TripDateRangePicker';
import { useImageUpload } from '@/hooks/useImageUpload';
import { FileText, MapPin, Calendar, Tag, Image } from 'lucide-react';

interface TripFormProps {
  initialValues?: {
    title: string;
    destination: string;
    description: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    coverImageUrl: string | null;
  };
  onSubmit: (formData: any) => Promise<void>;
  isLoading: boolean;
  submitButtonText: string;
}

const TripForm: React.FC<TripFormProps> = ({
  initialValues = {
    title: '',
    destination: '',
    description: '',
    startDate: undefined,
    endDate: undefined,
    coverImageUrl: null
  },
  onSubmit,
  isLoading,
  submitButtonText
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [title, setTitle] = useState(initialValues.title);
  const [destination, setDestination] = useState(initialValues.destination);
  const [description, setDescription] = useState(initialValues.description);
  const [startDate, setStartDate] = useState<Date | undefined>(initialValues.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialValues.endDate);

  const {
    previewUrl,
    handleImageChange,
    removeImage,
    coverImage,
    uploadImage
  } = useImageUpload(initialValues.coverImageUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: 'Required Field Missing',
        description: 'Please provide a trip title.',
        variant: 'destructive',
      });
      return;
    }
    
    if (startDate && endDate && startDate > endDate) {
      toast({
        title: 'Invalid Dates',
        description: 'End date cannot be before start date.',
        variant: 'destructive',
      });
      return;
    }

    let coverImageUrl = null;
    if (coverImage && uploadImage && user) {
      coverImageUrl = await uploadImage(user.id);
    }

    await onSubmit({
      title,
      destination,
      description,
      startDate,
      endDate,
      coverImageUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative h-full flex flex-col bg-background dark:bg-[#242529] rounded-xl">
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="space-y-4 px-4 pt-4 bg-background dark:bg-[#242529]">
          {/* Trip Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 text-foreground">
              <Tag className="h-4 w-4 text-[#4a6c6f]" />
              Trip Title <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summer Vacation 2025"
              required
              className="bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder:text-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f]"
            />
          </div>
          
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-[#4a6c6f]" />
              Destination
            </Label>
            <Input 
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Paris, France"
              className="bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder:text-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f]"
            />
          </div>
          
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-[#4a6c6f]" />
              Trip Dates
            </Label>
            <TripDateRangePicker 
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-foreground">
              <FileText className="h-4 w-4 text-[#4a6c6f]" />
              Description
            </Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your trip..."
              rows={4}
              className="bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder:text-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f] resize-none"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Image className="h-4 w-4 text-[#4a6c6f]" />
              Cover Image
            </Label>
            <TripImageUpload
              previewUrl={previewUrl}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
            />
          </div>
        </div>
      </div>
      
      {/* Fixed Footer - Absolutely positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-background dark:bg-[#242529] z-20 border-t border-border px-4 py-4">
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-[#4a6c6f] hover:bg-[#395457] text-white font-semibold rounded-lg px-6 py-2.5 transition shadow-sm hover:shadow-md"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : submitButtonText}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TripForm;
