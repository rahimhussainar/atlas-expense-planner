
export interface TripExpense {
  id: string;
  trip_id: string;
  title: string;
  amount: number;
  currency: string;
  category: 'accommodation' | 'transportation' | 'food' | 'activity' | 'other';
  paid_by: string | null;
  description: string | null;
  expense_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
