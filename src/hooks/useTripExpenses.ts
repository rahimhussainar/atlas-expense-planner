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

  const fetchExpenses = useCallback(async () => {
    if (!tripId || !user) return;
    
    try {
      setLoading(true);
      
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
  }, [tripId, user, toast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = async (expense: Omit<TripExpense, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('trip_expenses')
        .insert({
          ...expense
        })
        .select()
        .maybeSingle();
        
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
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  };
};
