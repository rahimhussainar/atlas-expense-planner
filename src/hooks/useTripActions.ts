
import { useState } from 'react';
import { Trip } from '@/types/trip';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTripActions = (onTripDeleted?: () => void) => {
  const { toast } = useToast();
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripToDelete.id);
        
      if (error) throw error;
      
      toast({
        title: 'Trip Deleted',
        description: 'The trip has been successfully deleted.',
      });
      
      onTripDeleted?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete trip. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setTripToDelete(null);
    }
  };
  
  return {
    tripToDelete,
    setTripToDelete,
    isDeleting,
    handleDeleteTrip
  };
};
