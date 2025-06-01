import React from 'react';
import ExpenseForm from './ExpenseForm';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

interface ExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: any) => Promise<void>;
  participants: any[];
  loading?: boolean;
  initialValues?: any;
  mode?: 'add' | 'edit';
}

const ExpenseDialog: React.FC<ExpenseDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  participants,
  loading, 
  initialValues, 
  mode = 'add' 
}) => {
  const title = mode === 'edit' ? 'Edit Expense' : 'Add Expense';
  const description = mode === 'edit' 
    ? 'Update the expense details and splits below.' 
    : 'Add a new expense and split it between trip participants.';

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <ExpenseForm 
        onSubmit={onSubmit} 
        isLoading={!!loading}
        submitButtonText={mode === 'edit' ? 'Save Changes' : 'Add Expense'}
        participants={participants}
        initialValues={initialValues}
        mode={mode}
      />
    </ResponsiveModal>
  );
};

export default ExpenseDialog; 