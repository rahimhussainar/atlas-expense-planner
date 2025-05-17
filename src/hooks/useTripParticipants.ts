
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
      
      // Check if the current user is a creator of this trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('created_by')
        .eq('id', tripId)
        .single();
        
      if (tripError && tripError.code !== 'PGRST116') throw tripError;
      
      const isCreator = tripData?.created_by === user.id;
      
      // Filter participants if not creator (only show self)
      let filteredParticipants = data || [];
      if (!isCreator) {
        filteredParticipants = filteredParticipants.filter(
          p => p.user_id === user.id || p.email === user.email
        );
      }
      
      // Cast the data to ensure it matches our TripParticipant type
      const typedParticipants = filteredParticipants?.map(participant => ({
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

  const inviteParticipant = async (email: string) => {
    if (!user || !tripId) return false;
    
    try {
      // Check if already invited
      const { data: existing } = await supabase
        .from('trip_participants')
        .select('id')
        .eq('trip_id', tripId)
        .eq('email', email);
        
      if (existing && existing.length > 0) {
        toast({
          title: 'Already Invited',
          description: 'This person has already been invited to the trip.'
        });
        return false;
      }
      
      // Check if user is creator (only creators should invite)
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('created_by')
        .eq('id', tripId)
        .single();
        
      if (tripError) throw tripError;
      
      if (tripData.created_by !== user.id) {
        toast({
          title: 'Permission Denied',
          description: 'Only trip creators can invite participants.'
        });
        return false;
      }
      
      const { error } = await supabase
        .from('trip_participants')
        .insert({
          trip_id: tripId,
          email: email,
          rsvp_status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: 'Invitation Sent',
        description: `An invitation has been sent to ${email}.`
      });
      
      // Refresh participants
      fetchParticipants();
      
      return true;
    } catch (error: any) {
      console.error("Error inviting participant:", error);
      toast({
        title: 'Error',
        description: `Failed to send invitation: ${error.message}`,
        variant: 'destructive'
      });
      return false;
    }
  };

  const removeParticipant = async (participantId: string) => {
    try {
      // First check if user is creator (only creators should remove)
      const { data: participant } = await supabase
        .from('trip_participants')
        .select('trip_id')
        .eq('id', participantId)
        .single();
      
      if (!participant) {
        toast({
          title: 'Error',
          description: 'Participant not found.'
        });
        return false;
      }
      
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('created_by')
        .eq('id', participant.trip_id)
        .single();
        
      if (tripError) throw tripError;
      
      if (tripData.created_by !== user?.id) {
        toast({
          title: 'Permission Denied',
          description: 'Only trip creators can remove participants.'
        });
        return false;
      }
      
      const { error } = await supabase
        .from('trip_participants')
        .delete()
        .eq('id', participantId);
        
      if (error) throw error;
      
      toast({
        title: 'Participant Removed',
        description: 'The participant has been removed from this trip.'
      });
      
      // Refresh participants
      fetchParticipants();
      
      return true;
    } catch (error: any) {
      console.error("Error removing participant:", error);
      toast({
        title: 'Error',
        description: `Failed to remove participant: ${error.message}`,
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    participants,
    loading,
    fetchParticipants,
    inviteParticipant,
    removeParticipant
  };
};
