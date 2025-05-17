
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

  const fetchActivities = useCallback(async () => {
    if (!tripId || !user) return;
    
    try {
      setLoading(true);
      
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
  }, [tripId, user, toast]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const createActivity = async (activity: Omit<TripActivity, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    try {
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
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity
  };
};
