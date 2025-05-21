import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trip } from '@/types/trip';
import TripImageUpload from './TripImageUpload';
import TripDateRangePicker from './TripDateRangePicker';
import { useImageUpload } from '@/hooks/useImageUpload';

interface EditTripFormProps {
  trip: Trip;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditTripForm: React.FC<EditTripFormProps> = ({ trip, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(trip.title);
  const [destination, setDestination] = useState(trip.destination || '');
  const [description, setDescription] = useState(trip.description || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    trip.start_date ? new Date(trip.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    trip.end_date ? new Date(trip.end_date) : undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    previewUrl,
    handleImageChange,
    removeImage,
    uploadImage
  } = useImageUpload(trip.cover_image);

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
    setIsLoading(true);
    try {
      let coverImageUrl = previewUrl;
      
      if (user) {
        coverImageUrl = await uploadImage(user.id);
      }

      const { error } = await supabase
        .from('trips')
        .update({
          trip_title: title,
          destination: destination || null,
          description: description || null,
          start_date: startDate?.toISOString() || null,
          end_date: endDate?.toISOString() || null,
          cover_image: coverImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', trip.id);
        
      if (error) throw error;
      
      toast({
        title: 'Trip Updated!',
        description: 'Your trip has been successfully updated.',
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error Updating Trip',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background px-4">
      <div className="space-y-6 bg-background">
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
      
      <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-background z-10">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-atlas-forest hover:bg-atlas-forest/90"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EditTripForm;
