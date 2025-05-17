
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
      
      // First, try to get trips created by the user
      const { data: createdTrips, error: createdError } = await supabase
        .from('trips')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
        
      if (createdError) {
        throw createdError;
      }
      
      // Then, get trips where the user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('trip_participants')
        .select('trip_id')
        .eq('user_id', user.id)
        .eq('rsvp_status', 'accepted');
        
      if (participantError) {
        throw participantError;
      }
      
      // Extract trip IDs where user is a participant
      const participantTripIds = participantData.map(item => item.trip_id);
      
      // If there are any trips where user is a participant, fetch those trips
      let participantTrips: any[] = [];
      if (participantTripIds.length > 0) {
        const { data: trips, error } = await supabase
          .from('trips')
          .select('*')
          .in('id', participantTripIds)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        participantTrips = trips || [];
      }
      
      // Combine all trips and remove duplicates by ID
      const allTrips = [...(createdTrips || []), ...participantTrips];
      const uniqueTrips = Array.from(
        new Map(allTrips.map(trip => [trip.id, trip])).values()
      );
      
      console.log("Trips fetched successfully:", uniqueTrips.length);
      
      // Map the database fields to match our Trip interface
      const mappedTrips: Trip[] = uniqueTrips.map(trip => ({
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
