import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { TripActivity } from '@/types/activity';

// Debounce function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const useTripActivities = (tripId: string | undefined) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<TripActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedFetchRef = useRef<(() => void) | null>(null);
  const isFetchingRef = useRef(false);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current session:", session?.user?.id);
      if (error) {
        console.error("Session error:", error);
      }
    };
    checkSession();
  }, []);

  const fetchActivities = useCallback(async () => {
    if (!tripId || !user || isFetchingRef.current) {
      console.log("Skipping fetch:", { tripId, userId: user?.id, isFetching: isFetchingRef.current });
      return;
    }
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      console.log("Fetching activities for trip:", tripId);
      
      const { data, error } = await supabase
        .from('trip_activities')
        .select('*')
        .eq('trip_id', tripId)
        .order('date', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Activities fetched:", data);
      
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
      isFetchingRef.current = false;
    }
  }, [tripId, user, toast]);

  // Set up debounced fetch on mount and when fetchActivities changes
  useEffect(() => {
    debouncedFetchRef.current = debounce(() => {
      fetchActivities();
    }, 1000);

    return () => {
      if (debouncedFetchRef.current) {
        // Clear any pending debounced calls
        debouncedFetchRef.current = null;
      }
    };
  }, [fetchActivities]);

  // Initial fetch
  useEffect(() => {
    if (debouncedFetchRef.current) {
      debouncedFetchRef.current();
    }
  }, [tripId]); // Only re-run when tripId changes

  const createActivity = async (activity: Omit<TripActivity, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('trip_activities')
        .insert({
          ...activity,
        })
        .select()
        .maybeSingle();
        
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
