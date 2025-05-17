
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

    await onSubmit({
      title,
      destination,
      description,
      startDate,
      endDate,
      coverImage,
      uploadImage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white">
      <div className="space-y-2">
        <Label htmlFor="title">Trip Title <span className="text-red-500">*</span></Label>
        <Input 
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summer Vacation 2025"
          required
          className="bg-white border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input 
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Paris, France"
          className="bg-white border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
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
          className="bg-white border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 resize-y"
        />
      </div>

      <TripImageUpload
        previewUrl={previewUrl}
        onImageChange={handleImageChange}
        onRemoveImage={removeImage}
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="submit" 
          className="bg-atlas-forest hover:bg-atlas-forest/90"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default TripForm;
