import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ActivityVote } from '@/types/activity';

export const useActivityVotes = (activityId: string | undefined) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [votes, setVotes] = useState<ActivityVote[]>([]);
  const [userVote, setUserVote] = useState<ActivityVote | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVotes = useCallback(async () => {
    if (!activityId || !user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('activity_votes')
        .select('*')
        .eq('activity_id', activityId);
        
      if (error) throw error;
      
      setVotes(data || []);
      
      // Find user's vote
      const userVoteData = data?.find(vote => vote.user_id === user.id) || null;
      setUserVote(userVoteData);
    } catch (error: any) {
      console.error("Error fetching votes:", error);
      toast({
        title: 'Error',
        description: `Failed to load votes: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [activityId, user, toast]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const castVote = async (vote: boolean) => {
    if (!activityId || !user) return;
    
    try {
      // If user already voted, update the vote
      if (userVote) {
        if (userVote.vote === vote) {
          // If voting the same way, remove the vote
          const { error } = await supabase
            .from('activity_votes')
            .delete()
            .eq('id', userVote.id);
            
          if (error) throw error;
          
          toast({
            title: 'Vote Removed',
            description: 'Your vote has been removed.'
          });
        } else {
          // If voting differently, update the vote
          const { error } = await supabase
            .from('activity_votes')
            .update({ vote })
            .eq('id', userVote.id);
            
          if (error) throw error;
          
          toast({
            title: 'Vote Updated',
            description: `You've ${vote ? 'upvoted' : 'downvoted'} this activity.`
          });
        }
      } else {
        // If user hasn't voted, insert new vote
        const { error } = await supabase
          .from('activity_votes')
          .insert({
            activity_id: activityId,
            user_id: user.id,
            vote
          });
          
        if (error) throw error;
        
        toast({
          title: 'Vote Cast',
          description: `You've ${vote ? 'upvoted' : 'downvoted'} this activity.`
        });
      }
      
      // Refresh votes
      fetchVotes();
    } catch (error: any) {
      console.error("Error casting vote:", error);
      toast({
        title: 'Error',
        description: `Failed to cast vote: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  // Calculate vote summary
  const voteSummary = {
    upvotes: votes.filter(v => v.vote).length,
    downvotes: votes.filter(v => !v.vote).length,
    total: votes.length
  };

  return {
    votes,
    userVote,
    loading,
    voteSummary,
    castVote,
    fetchVotes
  };
};
