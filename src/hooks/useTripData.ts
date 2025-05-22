import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTripData(id: string | undefined) {
  const [trip, setTrip] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch trip
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('id', id)
          .single();
        if (tripError) throw tripError;
        setTrip(tripData);

        // Fetch participants
        const { data: participantData, error: participantError } = await supabase
          .from('trip_participants')
          .select('*')
          .eq('trip_id', id);
        if (participantError) throw participantError;
        setParticipants(participantData || []);

        // Fetch activities
        const { data: activityData, error: activityError } = await supabase
          .from('trip_activities')
          .select('*')
          .eq('trip_id', id);
        if (activityError) throw activityError;
        setActivities(activityData || []);

        // Fetch expenses
        const { data: expenseData, error: expenseError } = await supabase
          .from('trip_expenses')
          .select('*')
          .eq('trip_id', id);
        if (expenseError) throw expenseError;
        setExpenses(expenseData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load trip data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  return { trip, participants, activities, expenses, loading, error };
} 