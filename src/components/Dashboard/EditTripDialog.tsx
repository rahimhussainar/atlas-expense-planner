
import React from 'react';
import { Trip } from '@/types/trip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col bg-white">
        <DialogHeader className="px-0">
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>
        {trip && (
          <ScrollArea className="flex-1 max-h-[calc(80vh-120px)]">
            <div className="pr-4 pb-4">
              <EditTripForm 
                trip={trip} 
                onSuccess={onSuccess} 
                onCancel={onClose} 
              />
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTripDialog;
