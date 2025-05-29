import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import SuggestActivityForm from './SuggestActivityForm';

interface SuggestActivityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: any) => Promise<void>;
  confirmedParticipantsCount: number;
  loading?: boolean;
  initialValues?: any;
  mode?: 'add' | 'edit';
}

const SuggestActivityDialog: React.FC<SuggestActivityDialogProps> = ({ isOpen, onOpenChange, onSubmit, confirmedParticipantsCount, loading, initialValues, mode = 'add' }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background dark:bg-[#242529] border border-border max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="pl-4 text-foreground">{mode === 'edit' ? 'Edit Activity' : 'Suggest an Activity'}</DialogTitle>
          <DialogDescription className="pl-4 text-muted-foreground">
            {mode === 'edit' ? 'Update the details below to edit this activity.' : 'Fill in the details below to propose a new activity for your trip.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2 bg-background dark:bg-[#242529] rounded-xl">
          <SuggestActivityForm 
            onSubmit={onSubmit} 
            isLoading={!!loading}
            submitButtonText={mode === 'edit' ? 'Save Changes' : 'Suggest Activity'}
            confirmedParticipantsCount={confirmedParticipantsCount}
            initialValues={initialValues}
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestActivityDialog; 