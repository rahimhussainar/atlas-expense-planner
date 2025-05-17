
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Trip } from '@/types/trip';

export const useTripDetail = (tripId: string | undefined) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (!tripId || !user) return;

    const fetchTrip = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('id', tripId)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          setError('Trip not found');
          return;
        }
        
        // Check if user is the creator
        setIsCreator(data.created_by === user.id);
        
        // Map the database fields to match our Trip interface
        const mappedTrip: Trip = {
          id: data.id,
          title: data.trip_title,
          destination: data.destination,
          description: data.description ?? '',
          start_date: data.start_date,
          end_date: data.end_date,
          currency: 'USD', // Default currency
          cover_image: data.cover_image,
          created_at: data.created_at,
          created_by: data.created_by
        };
        
        setTrip(mappedTrip);
      } catch (error: any) {
        console.error("Error fetching trip:", error);
        setError(error.message);
        toast({
          title: 'Error',
          description: `Failed to load trip: ${error.message}`,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, user, toast]);

  return { trip, loading, error, isCreator };
};
