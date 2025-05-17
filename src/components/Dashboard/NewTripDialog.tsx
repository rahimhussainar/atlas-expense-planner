
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col bg-white">
        <DialogHeader className="px-0">
          <DialogTitle>Create New Trip</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 max-h-[calc(80vh-120px)] pr-4">
          <div className="pb-4">
            <CreateTripForm onSuccess={onTripCreated} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NewTripDialog;
