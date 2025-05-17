
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { TripExpense } from '@/types/expense';

export const useTripExpenses = (tripId: string | undefined) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<TripExpense[]>([]);
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

  const fetchExpenses = useCallback(async () => {
    if (!tripId || !user) return;
    
    try {
      setLoading(true);
      
      // Check if user is creator or participant
      const creator = await checkIsCreator();
      
      if (!creator) {
        // Check if user is a participant
        const { data: participantData, error: participantError } = await supabase
          .from('trip_participants')
          .select('*')
          .eq('trip_id', tripId)
          .eq('user_id', user.id)
          .eq('rsvp_status', 'accepted');
          
        if (participantError) throw participantError;
        
        // If not a participant, don't show expenses
        if (!participantData || participantData.length === 0) {
          setExpenses([]);
          return;
        }
      }
      
      const { data, error } = await supabase
        .from('trip_expenses')
        .select('*')
        .eq('trip_id', tripId)
        .order('expense_date', { ascending: false });
        
      if (error) throw error;
      
      // Cast the data to ensure it matches our TripExpense type
      const typedExpenses = data?.map(expense => ({
        ...expense,
        category: expense.category as 'accommodation' | 'transportation' | 'food' | 'activity' | 'other'
      })) || [];
      
      setExpenses(typedExpenses);
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      toast({
        title: 'Error',
        description: `Failed to load expenses: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [tripId, user, toast, checkIsCreator]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = async (expense: Omit<TripExpense, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    try {
      // Check if user is creator or participant
      const creator = await checkIsCreator();
      
      if (!creator) {
        // Check if user is a participant
        const { data: participantData, error: participantError } = await supabase
          .from('trip_participants')
          .select('*')
          .eq('trip_id', tripId)
          .eq('user_id', user.id)
          .eq('rsvp_status', 'accepted');
          
        if (participantError) throw participantError;
        
        // If not a participant, don't allow creating expenses
        if (!participantData || participantData.length === 0) {
          toast({
            title: 'Permission Denied',
            description: 'Only trip participants can add expenses.'
          });
          return null;
        }
      }
      
      const { data, error } = await supabase
        .from('trip_expenses')
        .insert({
          ...expense
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Expense Added',
        description: 'Your expense has been added to the trip.'
      });
      
      // Refresh expenses
      fetchExpenses();
      
      return data;
    } catch (error: any) {
      console.error("Error creating expense:", error);
      toast({
        title: 'Error',
        description: `Failed to add expense: ${error.message}`,
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateExpense = async (id: string, updates: Partial<TripExpense>) => {
    try {
      // Check if user is creator or expense owner
      const { data: expenseData, error: expenseError } = await supabase
        .from('trip_expenses')
        .select('created_by')
        .eq('id', id)
        .single();
        
      if (expenseError) throw expenseError;
      
      const creator = await checkIsCreator();
      
      // Only allow creators or the person who created the expense to update it
      if (!creator && expenseData.created_by !== user?.id) {
        toast({
          title: 'Permission Denied',
          description: 'You can only edit expenses you created.'
        });
        return false;
      }
      
      const { error } = await supabase
        .from('trip_expenses')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Expense Updated',
        description: 'The expense has been updated successfully.'
      });
      
      // Refresh expenses
      fetchExpenses();
      
      return true;
    } catch (error: any) {
      console.error("Error updating expense:", error);
      toast({
        title: 'Error',
        description: `Failed to update expense: ${error.message}`,
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      // Check if user is creator or expense owner
      const { data: expenseData, error: expenseError } = await supabase
        .from('trip_expenses')
        .select('created_by')
        .eq('id', id)
        .single();
        
      if (expenseError) throw expenseError;
      
      const creator = await checkIsCreator();
      
      // Only allow creators or the person who created the expense to delete it
      if (!creator && expenseData.created_by !== user?.id) {
        toast({
          title: 'Permission Denied',
          description: 'You can only delete expenses you created.'
        });
        return false;
      }
      
      const { error } = await supabase
        .from('trip_expenses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Expense Deleted',
        description: 'The expense has been removed from this trip.'
      });
      
      // Refresh expenses
      fetchExpenses();
      
      return true;
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      toast({
        title: 'Error',
        description: `Failed to delete expense: ${error.message}`,
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    expenses,
    loading,
    isCreator,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  };
};
