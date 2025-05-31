import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateTripForm from './CreateTripForm';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

interface NewTripDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTripCreated: () => void;
}

const NewTripDialog: React.FC<NewTripDialogProps> = ({ isOpen, onOpenChange, onTripCreated }) => {
  return (
    <>
      <Button 
        className="bg-[#4a6c6f] hover:bg-[#395457] text-white"
        onClick={() => onOpenChange(true)}
      >
        <Plus className="mr-2 h-4 w-4" /> New Trip
      </Button>
      
      <ResponsiveModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Create New Trip"
        description="Fill in the details below to create a new trip. You can add more details later."
      >
        <CreateTripForm onSuccess={() => {
          onTripCreated();
          onOpenChange(false);
        }} />
      </ResponsiveModal>
    </>
  );
};

export default NewTripDialog;
