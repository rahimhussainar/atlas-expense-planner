import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Trip } from '@/types/trip';
import TripForm from './TripForm';

interface EditTripFormProps {
  trip: Trip;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditTripForm: React.FC<EditTripFormProps> = ({ trip, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('trips')
        .update({
          trip_title: formData.title,
          destination: formData.destination || null,
          description: formData.description || null,
          start_date: formData.startDate?.toISOString() || null,
          end_date: formData.endDate?.toISOString() || null,
          cover_image: formData.coverImageUrl || trip.cover_image,
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
    <TripForm
      initialValues={{
        title: trip.title,
        destination: trip.destination || '',
        description: trip.description || '',
        startDate: trip.start_date ? new Date(trip.start_date) : undefined,
        endDate: trip.end_date ? new Date(trip.end_date) : undefined,
        coverImageUrl: trip.cover_image,
      }}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText="Save Changes"
    />
  );
};

export default EditTripForm;
