
import React, { useState } from 'react';
import { useTripParticipants } from '@/hooks/useTripParticipants';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle2, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ShareTripDialogProps {
  tripId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareTripDialog: React.FC<ShareTripDialogProps> = ({
  tripId,
  open,
  onOpenChange
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { participants, inviteParticipant, removeParticipant, loading } = useTripParticipants(tripId);

  const handleInvite = async () => {
    if (!email) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    const success = await inviteParticipant(email);
    if (success) {
      setEmail('');
    }
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/trips/${tripId}`;
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    
    toast({
      title: "Link Copied!",
      description: "Share link copied to clipboard",
    });
    
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Trip</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Share Link */}
          <div className="space-y-2">
            <Label htmlFor="share-link">Share link</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="share-link"
                value={`${window.location.origin}/trips/${tripId}`}
                readOnly
                className="flex-1"
              />
              <Button 
                size="icon"
                onClick={copyShareLink}
                variant="outline"
              >
                {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Invite by Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Invite by email</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleInvite} disabled={!email}>
                Invite
              </Button>
            </div>
          </div>
          
          {/* Participants List */}
          <div className="space-y-2">
            <Label>Invited participants</Label>
            {participants.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {participants.map((participant) => (
                  <div 
                    key={participant.id}
                    className="flex justify-between items-center p-2 bg-slate-50 rounded-md"
                  >
                    <div className="flex items-center">
                      <span className="text-sm">{participant.email || participant.user_id}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-200">
                        {participant.rsvp_status === 'accepted' ? 'Going' : 
                         participant.rsvp_status === 'declined' ? 'Not Going' : 'Pending'}
                      </span>
                    </div>
                    <Button 
                      size="icon"
                      variant="ghost"
                      onClick={() => removeParticipant(participant.id)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No participants invited yet</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTripDialog;
