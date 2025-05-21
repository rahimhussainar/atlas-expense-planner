import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateTripForm from './CreateTripForm';

interface NewTripDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTripCreated: () => void;
}

const NewTripDialog: React.FC<NewTripDialogProps> = ({ isOpen, onOpenChange, onTripCreated }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-atlas-forest hover:bg-atlas-forest/90">
          <Plus className="mr-2 h-4 w-4" /> New Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new trip. You can add more details later.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <CreateTripForm onSuccess={onTripCreated} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewTripDialog;
