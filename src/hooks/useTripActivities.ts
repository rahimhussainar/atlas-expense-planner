
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { TripActivity } from '@/types/activity';

export const useTripActivities = (tripId: string | undefined) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<TripActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);

  const checkIsCreator = useCallback(async () => {
    if (!tripId || !user) return false;
    
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('created_by')
        .eq('id', tripId)
        .single();
        
      if (error) {
        console.error("Error checking trip creator:", error);
        return false;
      }
      
      const creator = data?.created_by === user.id;
      setIsCreator(creator);
      return creator;
    } catch (error) {
      console.error("Error in checkIsCreator:", error);
      return false;
    }
  }, [tripId, user]);

  const checkIsParticipant = useCallback(async () => {
    if (!tripId || !user) return false;
    
    try {
      const { data, error } = await supabase
        .from('trip_participants')
        .select('*')
        .eq('trip_id', tripId)
        .eq('user_id', user.id)
        .eq('rsvp_status', 'accepted');
        
      if (error) {
        console.error("Error checking trip participant:", error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error("Error in checkIsParticipant:", error);
      return false;
    }
  }, [tripId, user]);

  const fetchActivities = useCallback(async () => {
    if (!tripId || !user) return;
    
    try {
      setLoading(true);
      
      // Check if user is creator or participant
      const creator = await checkIsCreator();
      const participant = !creator ? await checkIsParticipant() : true;
      
      if (!creator && !participant) {
        setActivities([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('trip_activities')
        .select('*')
        .eq('trip_id', tripId)
        .order('date', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Cast the data to ensure it matches our TripActivity type
      const typedActivities = data?.map(activity => ({
        ...activity,
        status: activity.status as 'suggested' | 'confirmed' | 'cancelled'
      })) || [];
      
      setActivities(typedActivities);
    } catch (error: any) {
      console.error("Error fetching activities:", error);
      toast({
        title: 'Error',
        description: `Failed to load activities: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [tripId, user, toast, checkIsCreator, checkIsParticipant]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const createActivity = async (activity: Omit<TripActivity, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    try {
      // Check if user is creator or participant
      const creator = await checkIsCreator();
      const participant = !creator ? await checkIsParticipant() : true;
      
      if (!creator && !participant) {
        toast({
          title: 'Permission Denied',
          description: 'Only trip participants can suggest activities.'
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('trip_activities')
        .insert({
          ...activity,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Activity Created',
        description: 'Your activity has been added to the trip.'
      });
      
      // Refresh activities
      fetchActivities();
      
      return data;
    } catch (error: any) {
      console.error("Error creating activity:", error);
      toast({
        title: 'Error',
        description: `Failed to create activity: ${error.message}`,
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateActivity = async (id: string, updates: Partial<TripActivity>) => {
    try {
      // Check if user is creator or activity owner
      const { data: activityData, error: activityError } = await supabase
        .from('trip_activities')
        .select('created_by, status')
        .eq('id', id)
        .single();
        
      if (activityError) throw activityError;
      
      const creator = await checkIsCreator();
      
      // Status changes are restricted to creator
      if (updates.status && updates.status !== activityData.status && !creator) {
        toast({
          title: 'Permission Denied',
          description: 'Only trip creators can change activity status.'
        });
        return false;
      }
      
      // For other updates, check if user is creator or owner
      if (!creator && activityData.created_by !== user?.id) {
        toast({
          title: 'Permission Denied',
          description: 'You can only edit activities you created.'
        });
        return false;
      }
      
      const { error } = await supabase
        .from('trip_activities')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Activity Updated',
        description: 'The activity has been updated successfully.'
      });
      
      // Refresh activities
      fetchActivities();
      
      return true;
    } catch (error: any) {
      console.error("Error updating activity:", error);
      toast({
        title: 'Error',
        description: `Failed to update activity: ${error.message}`,
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      // Check if user is creator or activity owner
      const { data: activityData, error: activityError } = await supabase
        .from('trip_activities')
        .select('created_by')
        .eq('id', id)
        .single();
        
      if (activityError) throw activityError;
      
      const creator = await checkIsCreator();
      
      // Only allow creators or the person who created the activity to delete it
      if (!creator && activityData.created_by !== user?.id) {
        toast({
          title: 'Permission Denied',
          description: 'You can only delete activities you created.'
        });
        return false;
      }
      
      const { error } = await supabase
        .from('trip_activities')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Activity Deleted',
        description: 'The activity has been removed from this trip.'
      });
      
      // Refresh activities
      fetchActivities();
      
      return true;
    } catch (error: any) {
      console.error("Error deleting activity:", error);
      toast({
        title: 'Error',
        description: `Failed to delete activity: ${error.message}`,
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    activities,
    loading,
    isCreator,
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity
  };
};
