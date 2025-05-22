import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useTripData(id: string | undefined) {
  const [trip, setTrip] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [activityVotes, setActivityVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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

      // Fetch activity votes
      const { data: voteData, error: voteError } = await supabase
        .from('activity_votes')
        .select('*')
        .in('activity_id', activityData?.map(a => a.id) || []);
      if (voteError) throw voteError;
      setActivityVotes(voteData || []);

    } catch (err: any) {
      setError(err.message || 'Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // Function to handle voting
  const handleVote = async (activityId: string) => {
    if (!user) {
      // Handle not logged in case
      return;
    }

    try {
      // Check if user has already voted
      const existingVote = activityVotes.find(
        vote => vote.activity_id === activityId && vote.user_id === user.id
      );

      if (existingVote) {
        // Remove vote
        const { error } = await supabase
          .from('activity_votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (error) throw error;
        
        // Update local state
        setActivityVotes(prev => prev.filter(v => v.id !== existingVote.id));
      } else {
        // Add vote
        const { data, error } = await supabase
          .from('activity_votes')
          .insert({
            activity_id: activityId,
            user_id: user.id,
            vote: true
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setActivityVotes(prev => [...prev, data]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update vote');
    }
  };

  // Get vote count for an activity
  const getVoteCount = (activityId: string) => {
    return activityVotes.filter(vote => vote.activity_id === activityId).length;
  };

  // Check if user has voted for an activity
  const hasUserVoted = (activityId: string) => {
    if (!user) return false;
    return activityVotes.some(
      vote => vote.activity_id === activityId && vote.user_id === user.id
    );
  };

  return { 
    trip, 
    participants, 
    activities, 
    expenses, 
    loading, 
    error,
    handleVote,
    getVoteCount,
    hasUserVoted,
    isAuthenticated: !!user,
    refetch: fetchData
  };
} 