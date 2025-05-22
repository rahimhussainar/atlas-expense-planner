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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-[#23272b] px-4 rounded-xl">
      <div className="space-y-6 bg-white dark:bg-[#23272b]">
        <div className="space-y-2">
          <Label htmlFor="title">Trip Title <span className="text-red-500">*</span></Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summer Vacation 2025"
            required
            className="bg-card border-border focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest rounded-md px-3 py-2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input 
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Paris, France"
            className="bg-card border-border focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest rounded-md px-3 py-2"
          />
        </div>
        
        <TripDateRangePicker 
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about your trip..."
            rows={4}
            className="bg-card border-border focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest rounded-md px-3 py-2 resize-y"
          />
        </div>

        <TripImageUpload
          previewUrl={previewUrl}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white dark:bg-[#23272b]">
        <Button 
          type="submit" 
          className="bg-[#4a6c6f] hover:bg-[#395457]"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default TripForm;
