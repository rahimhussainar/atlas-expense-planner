import React from 'react';
import { Trip } from '@/types/trip';
import EditTripForm from './EditTripForm';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

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
    <ResponsiveModal
      isOpen={!!trip}
      onOpenChange={(open) => !open && onClose()}
      title="Edit Trip"
      description="Make changes to your trip details. Click save when you're done."
    >
          {trip && (
            <EditTripForm 
              trip={trip} 
              onSuccess={onSuccess} 
              onCancel={onClose} 
            />
          )}
    </ResponsiveModal>
  );
};

export default EditTripDialog;
