import { BaseItem, ItemWithCost } from './shared';

export interface TripExpense extends BaseItem, ItemWithCost {
  trip_id: string;
  title: string;
  description: string | null;
  category: ExpenseCategory;
  paid_by: string;
  paid_by_name?: string;
  date: string;
  receipt_url?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  split_type: 'equal' | 'custom' | 'by_participant';
  participants?: string[]; // IDs of participants involved in this expense
}

export type ExpenseCategory = 
  | 'accommodation' 
  | 'food' 
  | 'transport' 
  | 'activities' 
  | 'shopping' 
  | 'other';

export interface ExpenseSplit {
  expense_id: string;
  participant_id: string;
  amount: number;
  is_paid: boolean;
}
