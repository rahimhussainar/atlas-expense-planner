import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddParticipantModal = ({ open, onOpenChange, newParticipant, setNewParticipant, onAddParticipant }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <UserPlus className="mr-2 h-5 w-5" />
          Add Participant
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={newParticipant.name}
            onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
            placeholder="Enter participant's name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={newParticipant.email}
            onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
            placeholder="Enter participant's email"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={newParticipant.status}
            onValueChange={(value) => setNewParticipant({ ...newParticipant, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="maybe">Maybe</SelectItem>
              <SelectItem value="declined">Not Coming</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAddParticipant} className="w-full">
          Add Participant
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default AddParticipantModal; 