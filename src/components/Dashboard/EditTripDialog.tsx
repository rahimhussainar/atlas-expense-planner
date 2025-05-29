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
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#242529] max-h-[90vh] flex flex-col mt-4 sm:mt-0 mb-4 sm:mb-0">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="pl-4">Edit Trip</DialogTitle>
          <DialogDescription className="pl-4">
            Make changes to your trip details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto bg-white dark:bg-[#242529] rounded-xl">
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
