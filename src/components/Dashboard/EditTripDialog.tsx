
import React from 'react';
import { Trip } from '@/types/trip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>
        {trip && (
          <EditTripForm 
            trip={trip} 
            onSuccess={onSuccess} 
            onCancel={onClose} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTripDialog;
