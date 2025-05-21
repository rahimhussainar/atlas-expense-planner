import React from 'react';
import { Trip } from '@/types/trip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditTripForm from './EditTripForm';

interface EditTripDialogProps {
  trip: Trip | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTripDialog: React.FC<EditTripDialogProps> = ({
  trip,
  onClose,
  onSuccess
}) => {
  return (
    <Dialog open={!!trip} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Trip</DialogTitle>
          <DialogDescription>
            Make changes to your trip details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          {trip && (
            <EditTripForm 
              trip={trip} 
              onSuccess={onSuccess} 
              onCancel={onClose} 
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTripDialog;
