
import React from 'react';
import { TripExpense } from '@/types/expense';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Tag,
  User,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseCardProps {
  expense: TripExpense;
  isCreator: boolean;
  onDelete: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  isCreator,
  onDelete
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'accommodation': return '🏨';
      case 'transportation': return '🚕';
      case 'food': return '🍽️';
      case 'activity': return '🎯';
      default: return '💰';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="text-2xl mr-3">
              {getCategoryIcon(expense.category)}
            </div>
            <div>
              <h3 className="font-medium">{expense.title}</h3>
              <p className="text-sm text-gray-500">{expense.description}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold">
              {expense.currency} {Number(expense.amount).toFixed(2)}
            </div>
            
            {isCreator && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 h-8 px-2 mt-1" 
                onClick={onDelete}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                <span className="text-xs">Delete</span>
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
          <div className="flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            <span>{expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</span>
          </div>
          
          {expense.expense_date && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(expense.expense_date)}</span>
            </div>
          )}
          
          {expense.paid_by && (
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>Paid by {expense.paid_by}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
