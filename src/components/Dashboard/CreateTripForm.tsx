
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import TripForm from './TripForm';

interface CreateTripFormProps {
  onSuccess: () => void;
}

const CreateTripForm: React.FC<CreateTripFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      let coverImageUrl = null;
      
      if (formData.coverImage) {
        coverImageUrl = await formData.uploadImage(user!.id);
      }

      const { data, error } = await supabase
        .from('trips')
        .insert({
          trip_title: formData.title,
          destination: formData.destination || null,
          description: formData.description || null,
          start_date: formData.startDate?.toISOString() || null,
          end_date: formData.endDate?.toISOString() || null,
          cover_image: coverImageUrl,
          created_by: user!.id,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Trip Created!',
        description: 'Your trip has been successfully created.',
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error Creating Trip',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TripForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText="Create Trip"
    />
  );
};

export default CreateTripForm;
