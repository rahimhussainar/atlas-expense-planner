
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Trip } from '@/types/trip';

export const useTrips = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  // Memoize fetchTrips to prevent recreation on each render
  const fetchTrips = useCallback(async () => {
    // Skip if we don't have a user
    if (!user) return;
    
    try {
      console.log("Fetching trips for user:", user.id);
      setLoading(true);
      
      // Fetch all trips the user has access to
      // This will use the RLS policy "Users can view their trips"
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      console.log("Trips fetched successfully:", data?.length || 0);
      
      // Map the database fields to match our Trip interface
      const mappedTrips: Trip[] = (data || []).map(trip => ({
        id: trip.id,
        title: trip.trip_title, // Map trip_title to title
        destination: trip.destination,
        description: trip.description ?? '',
        start_date: trip.start_date,
        end_date: trip.end_date,
        currency: 'USD', // Default currency since it doesn't exist in database
        cover_image: trip.cover_image,
        created_at: trip.created_at || new Date().toISOString(),
        created_by: trip.created_by
      }));
      
      setTrips(mappedTrips);
    } catch (error: any) {
      console.error("Error fetching trips:", error);
      toast({
        title: 'Error',
        description: `Failed to load trips: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setHasAttemptedFetch(true);
    }
  }, [user, toast]);

  return {
    trips,
    loading,
    hasAttemptedFetch,
    fetchTrips
  };
};
