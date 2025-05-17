import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { TripParticipant } from '@/types/participant';

export const useTripParticipants = (tripId: string | undefined) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [participants, setParticipants] = useState<TripParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = useCallback(async () => {
    if (!tripId || !user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('trip_participants')
        .select('*')
        .eq('trip_id', tripId);
        
      if (error) throw error;
      
      // Cast the data to ensure it matches our TripParticipant type
      const typedParticipants = data?.map(participant => ({
        ...participant,
        rsvp_status: participant.rsvp_status as 'pending' | 'accepted' | 'declined'
      })) || [];
      
      setParticipants(typedParticipants);
    } catch (error: any) {
      console.error("Error fetching participants:", error);
      toast({
        title: 'Error',
        description: `Failed to load participants: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [tripId, user, toast]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  return {
    participants,
    loading,
    fetchParticipants,
  };
};
