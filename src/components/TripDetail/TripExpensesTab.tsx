
import React, { useState } from 'react';
import { useTripExpenses } from '@/hooks/useTripExpenses';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2, DollarSign } from 'lucide-react';
import ExpenseCard from './ExpenseCard';
import CreateExpenseDialog from './CreateExpenseDialog';

interface TripExpensesTabProps {
  tripId: string;
  isCreator: boolean;
}

const TripExpensesTab: React.FC<TripExpensesTabProps> = ({ 
  tripId, 
  isCreator 
}) => {
  const [expenseFilter, setExpenseFilter] = useState<'all' | string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { 
    expenses, 
    loading, 
    fetchExpenses,
    deleteExpense
  } = useTripExpenses(tripId);
  
  // Get unique categories
  const categories = [...new Set(expenses.map(expense => expense.category))];

  // Filter expenses based on current tab
  const filteredExpenses = expenses.filter(expense => {
    if (expenseFilter === 'all') return true;
    return expense.category === expenseFilter;
  });
  
  // Calculate total for all expenses and filtered expenses
  const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const filteredTotalAmount = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium mb-1">Trip Expenses</h3>
          <p className="text-gray-500">
            Total: <span className="font-medium">${totalAmount.toFixed(2)}</span>
          </p>
        </div>
        
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>
      
      {/* Category Filters */}
      <div className="mb-4 overflow-x-auto">
        <Tabs 
          value={expenseFilter} 
          onValueChange={setExpenseFilter}
          className="w-max"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Filtered Total */}
      {expenseFilter !== 'all' && (
        <div className="mb-4 bg-blue-50 text-blue-800 rounded-md p-3 flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          <span>
            Total for {expenseFilter}: <span className="font-medium">${filteredTotalAmount.toFixed(2)}</span>
          </span>
        </div>
      )}
      
      {/* Expenses List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredExpenses.length > 0 ? (
        <div className="space-y-4">
          {filteredExpenses.map(expense => (
            <ExpenseCard 
              key={expense.id}
              expense={expense}
              isCreator={isCreator}
              onDelete={() => deleteExpense(expense.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No expenses found</p>
            <Button onClick={() => setShowCreateDialog(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Expense
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Create Expense Dialog */}
      <CreateExpenseDialog
        tripId={tripId}
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchExpenses();
        }}
      />
    </div>
  );
};

export default TripExpensesTab;
