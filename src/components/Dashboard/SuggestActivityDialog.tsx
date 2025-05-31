import React from 'react';
import SuggestActivityForm from './SuggestActivityForm';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

interface SuggestActivityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: any) => Promise<void>;
  confirmedParticipantsCount: number;
  loading?: boolean;
  initialValues?: any;
  mode?: 'add' | 'edit';
}

const SuggestActivityDialog: React.FC<SuggestActivityDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  confirmedParticipantsCount, 
  loading, 
  initialValues, 
  mode = 'add' 
}) => {
  const title = mode === 'edit' ? 'Edit Activity' : 'Suggest an Activity';
  const description = mode === 'edit' 
    ? 'Update the details below to edit this activity.' 
    : 'Fill in the details below to propose a new activity for your trip.';

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
          <SuggestActivityForm 
            onSubmit={onSubmit} 
            isLoading={!!loading}
            submitButtonText={mode === 'edit' ? 'Save Changes' : 'Suggest Activity'}
            confirmedParticipantsCount={confirmedParticipantsCount}
            initialValues={initialValues}
            mode={mode}
          />
    </ResponsiveModal>
  );
};

export default SuggestActivityDialog; 