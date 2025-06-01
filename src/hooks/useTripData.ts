import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useTripData(id: string | undefined) {
  const [trip, setTrip] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [activityVotes, setActivityVotes] = useState<any[]>([]);
  const [voterProfiles, setVoterProfiles] = useState<any[]>([]);
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

      // Fetch expenses with detailed information
      const { data: expenseData, error: expenseError } = await supabase
        .from('trip_expenses')
        .select(`
          *,
          expense_payers!inner(*),
          expense_debtors!inner(*)
        `)
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

      // Fetch voter profiles
      const uniqueUserIds = [...new Set(voteData?.map(v => v.user_id).filter(Boolean) || [])];
      if (uniqueUserIds.length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', uniqueUserIds);
        if (profileError) throw profileError;
        setVoterProfiles(profileData || []);
      }
    } catch (error: any) {
      console.error('Error fetching trip data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleVote = async (activityId: string) => {
    if (!user) return;

    try {
      // Check if user has already voted
      const existingVote = activityVotes.find(
        vote => vote.activity_id === activityId && vote.user_id === user.id
      );

      if (existingVote) {
        // Remove vote
        await supabase
          .from('activity_votes')
          .delete()
          .eq('id', existingVote.id);
      } else {
        // Add vote
        await supabase
          .from('activity_votes')
          .insert({
            activity_id: activityId,
            user_id: user.id,
            vote: true
          });
      }

      // Refresh activity votes
      const { data: updatedVotes } = await supabase
        .from('activity_votes')
        .select('*')
        .in('activity_id', activities.map(a => a.id));
      
      setActivityVotes(updatedVotes || []);
    } catch (error) {
      console.error('Error handling vote:', error);
    }
  };

  const getVoteCount = (activityId: string) => {
    return activityVotes.filter(vote => vote.activity_id === activityId).length;
  };

  const hasUserVoted = (activityId: string) => {
    if (!user) return false;
    return activityVotes.some(
      vote => vote.activity_id === activityId && vote.user_id === user.id
    );
  };

  const getVoterNames = (activityId: string) => {
    const votes = activityVotes.filter(vote => vote.activity_id === activityId);
    return votes.map(vote => {
      const profile = voterProfiles.find(p => p.id === vote.user_id);
      return profile?.full_name || profile?.email || 'Anonymous';
    });
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
    getVoterNames,
    voterProfiles,
    isAuthenticated: !!user,
    refetch: fetchData
  };
} 