import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserPlus, 
  Mail, 
  Check, 
  X, 
  Pencil, 
  Trash2, 
  Send, 
  User,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Crown,
  UserCheck,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

interface Participant {
  id: string;
  email: string | null;
  user_id: string | null;
  rsvp_status: string | null;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  displayEmail?: string | null;
}

interface ManageParticipantsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  tripCreatedBy: string;
  participants: Participant[];
  onRefresh: () => void;
}

const ManageParticipantsModal: React.FC<ManageParticipantsModalProps> = ({
  open,
  onOpenChange,
  tripId,
  tripCreatedBy,
  participants: initialParticipants,
  onRefresh
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [inviteMode, setInviteMode] = useState<'email' | 'manual'>('email');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      fetchParticipants();
    }
  }, [open, tripId, initialParticipants]);

  const fetchParticipants = async () => {
    try {
      // First, let's ensure the trip creator is added as a participant if not already
      await ensureCreatorAsParticipant();
      
      // Fetch all participants first
      const { data: participantsData, error: participantsError } = await supabase
        .from('trip_participants')
        .select('id, email, user_id, rsvp_status')
        .eq('trip_id', tripId);

      if (participantsError) throw participantsError;

      // Then fetch profiles for each participant that has a user_id
      const participantsWithProfiles = await Promise.all(
        (participantsData || []).map(async (participant) => {
          if (participant.user_id) {
            // Fetch profile data (without email since it doesn't exist in profiles table)
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', participant.user_id)
              .single();
            
            // Use email from participant record or try to get from user metadata
            let userEmail = participant.email;
            if (!userEmail) {
              // Try to get email from the current user's session if this is the current user
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.user?.id === participant.user_id) {
                userEmail = session.user.email;
              }
            }
            
            return { 
              ...participant, 
              profiles: profile,
              displayEmail: userEmail
            };
          }
          return { ...participant, profiles: null, displayEmail: participant.email };
        })
      );
      
      setParticipants(participantsWithProfiles);
    } catch (error: any) {
      console.error('Error in fetchParticipants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load participants',
        variant: 'destructive'
      });
    }
  };

  const ensureCreatorAsParticipant = async () => {
    try {
      // Check if trip creator is already a participant
      const { data: existingParticipant } = await supabase
        .from('trip_participants')
        .select('id')
        .eq('trip_id', tripId)
        .eq('user_id', tripCreatedBy)
        .single();

      if (!existingParticipant) {
        // Add trip creator as a participant with 'accepted' status
        const { error } = await supabase
          .from('trip_participants')
          .insert({
            trip_id: tripId,
            user_id: tripCreatedBy,
            rsvp_status: 'accepted',
            email: null // We'll get this from their profile if needed
          });

        if (error) {
          console.error('Error adding creator as participant:', error);
        }
      }
    } catch (error) {
      console.error('Error ensuring creator as participant:', error);
    }
  };

  const handleInviteParticipant = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    setIsInviting(true);
    try {
      // Check if already a participant
      const isAlreadyParticipant = participants.some(p => p.email === inviteEmail);
      if (isAlreadyParticipant) {
        toast({
          title: 'Already Invited',
          description: 'This person is already a participant',
          variant: 'destructive'
        });
        setIsInviting(false);
        return;
      }

      // Insert participant with null user_id for now - will be linked when they sign up
      const { error } = await supabase
        .from('trip_participants')
        .insert({
          trip_id: tripId,
          email: inviteEmail,
          user_id: null, // Will be linked when user signs up or manually
          rsvp_status: 'pending'
        });

      if (error) throw error;

      // TODO: Implement actual email sending here
      // For Supabase, you could use their Edge Functions or integrate with services like:
      // - Resend (resend.com)
      // - SendGrid
      // - Mailgun
      // - Or Supabase's built-in auth.resetPasswordForEmail for custom flows

      toast({
        title: 'Invitation Sent!',
        description: `Invited ${inviteEmail} to join the trip`,
      });

      setInviteEmail('');
      fetchParticipants();
      onRefresh();
    } catch (error: any) {
      console.error('Error inviting participant:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive'
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleAddManualParticipant = async () => {
    if (!manualName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter a participant name',
        variant: 'destructive'
      });
      return;
    }

    if (manualEmail && !manualEmail.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address or leave it empty',
        variant: 'destructive'
      });
      return;
    }

    setIsAddingManual(true);
    try {
      const { error } = await supabase
        .from('trip_participants')
        .insert({
          trip_id: tripId,
          email: manualEmail || `${manualName.replace(/\s+/g, '').toLowerCase()}@manual.participant`,
          user_id: null,
          rsvp_status: 'accepted' // Manual participants are considered confirmed
        });

      if (error) throw error;

      toast({
        title: 'Participant Added!',
        description: `${manualName} has been added to the trip`,
      });

      setManualName('');
      setManualEmail('');
      fetchParticipants();
      onRefresh();
    } catch (error: any) {
      console.error('Error adding manual participant:', error);
      toast({
        title: 'Error',
        description: 'Failed to add participant',
        variant: 'destructive'
      });
    } finally {
      setIsAddingManual(false);
    }
  };

  const handleUpdateRSVP = async (participantId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('trip_participants')
        .update({ rsvp_status: newStatus })
        .eq('id', participantId);

      if (error) throw error;

      fetchParticipants();
      onRefresh();
      toast({
        title: 'RSVP Updated',
        description: 'Participant status has been updated',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update RSVP status',
        variant: 'destructive'
      });
    }
  };

  const handleEditEmail = async (participantId: string) => {
    if (!editEmail || !editEmail.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('trip_participants')
        .update({ email: editEmail })
        .eq('id', participantId);

      if (error) throw error;

      setEditingParticipant(null);
      setEditEmail('');
      fetchParticipants();
      onRefresh();
      toast({
        title: 'Email Updated',
        description: 'Participant email has been updated',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update email',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      const { error } = await supabase
        .from('trip_participants')
        .delete()
        .eq('id', participantId);

      if (error) throw error;

      fetchParticipants();
      onRefresh();
      toast({
        title: 'Participant Removed',
        description: 'Participant has been removed from the trip',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove participant',
        variant: 'destructive'
      });
    }
  };

  const getRSVPBadge = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Coming</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><XCircle className="w-3 h-3 mr-1" />Not Coming</Badge>;
      case 'maybe':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"><HelpCircle className="w-3 h-3 mr-1" />Maybe</Badge>;
      default:
        return <Badge variant="secondary"><Mail className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getSignupStatus = (participant: Participant) => {
    if (participant.user_id && participant.profiles) {
      return <Check className="w-4 h-4 text-green-500" />;
    }
    return <X className="w-4 h-4 text-red-500" />;
  };

  const getParticipantName = (participant: Participant) => {
    if (participant.profiles?.full_name) {
      return participant.profiles.full_name;
    }
    if (participant.displayEmail && !participant.displayEmail.includes('@manual.participant')) {
      return participant.displayEmail.split('@')[0];
    }
    if (participant.displayEmail?.includes('@manual.participant')) {
      return participant.displayEmail.split('@')[0];
    }
    return 'Unknown';
  };

  const getParticipantInitials = (participant: Participant) => {
    const name = getParticipantName(participant);
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isCreator = (participant: Participant) => {
    return participant.user_id === tripCreatedBy;
  };

  const canEditParticipant = (participant: Participant) => {
    return user?.id === tripCreatedBy || user?.id === participant.user_id;
  };

  // Clear forms when switching modes
  const handleModeChange = (mode: 'email' | 'manual') => {
    setInviteMode(mode);
    setInviteEmail('');
    setManualName('');
    setManualEmail('');
  };

  return (
    <ResponsiveModal
      isOpen={open}
      onOpenChange={onOpenChange}
      title="Manage Participants"
      maxWidth="max-w-4xl"
    >
        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          {/* Invitation Method Selector */}
          <div className="space-y-4">
            {/* Selector Pills */}
            <div className="bg-[#1a1d21] rounded-lg p-1 flex">
              <button
                onClick={() => handleModeChange('email')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                  inviteMode === 'email'
                    ? 'bg-[#4a6c6f] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#2a2d32]'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Invitation
              </button>
              <button
                onClick={() => handleModeChange('manual')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                  inviteMode === 'manual'
                    ? 'bg-[#4a6c6f] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#2a2d32]'
                }`}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Manual Addition
              </button>
            </div>

            {/* Form Area */}
            <div className="bg-[#2a2d32] rounded-lg p-6 border border-gray-600">
              {inviteMode === 'email' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Send Email Invitation</h3>
                    <p className="text-gray-400 text-sm mb-4">Invite someone to join your trip via email. They'll receive an invitation link.</p>
                  </div>
                  <div className="flex space-x-3">
                    <Input
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1 bg-[#1a1d21] border-gray-600 text-white placeholder-gray-500 focus:border-[#4a6c6f] focus:ring-[#4a6c6f]"
                      onKeyPress={(e) => e.key === 'Enter' && handleInviteParticipant()}
                    />
                    <Button 
                      onClick={handleInviteParticipant} 
                      disabled={isInviting || !inviteEmail.trim()}
                      className="bg-[#4a6c6f] hover:bg-[#395457] text-white px-6"
                    >
                      {isInviting ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Invite
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Add Participant Manually</h3>
                    <p className="text-gray-400 text-sm mb-4">Add someone directly to the trip without sending an email invitation.</p>
                  </div>
                  <div className="space-y-3">
                    <Input
                      placeholder="Full name (required)"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="bg-[#1a1d21] border-gray-600 text-white placeholder-gray-500 focus:border-[#4a6c6f] focus:ring-[#4a6c6f]"
                    />
                    <Input
                      placeholder="Email address (optional)"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      className="bg-[#1a1d21] border-gray-600 text-white placeholder-gray-500 focus:border-[#4a6c6f] focus:ring-[#4a6c6f]"
                    />
                    <Button 
                      onClick={handleAddManualParticipant} 
                      disabled={isAddingManual || !manualName.trim()}
                      className="w-full bg-[#4a6c6f] hover:bg-[#395457] text-white"
                    >
                      {isAddingManual ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Participant
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Participants List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Trip Participants
              </h3>
              <Badge variant="secondary" className="bg-[#1a1d21] text-gray-300">
                {participants.length} {participants.length === 1 ? 'member' : 'members'}
              </Badge>
            </div>
            
            {participants.length === 0 ? (
              <div className="text-center py-12 bg-[#2a2d32] rounded-lg border border-gray-600">
                <div className="bg-[#1a1d21] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-white font-medium mb-2">No participants yet</h4>
                <p className="text-gray-400 text-sm">Start by inviting people to join your trip!</p>
              </div>
            ) : (
              <div className="bg-[#2a2d32] rounded-lg border border-gray-600 divide-y divide-gray-600">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="p-4 hover:bg-[#323640] transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-gray-600">
                            <AvatarImage src={participant.profiles?.avatar_url || ''} />
                            <AvatarFallback className="bg-[#4a6c6f] text-white font-medium">
                              {getParticipantInitials(participant)}
                            </AvatarFallback>
                          </Avatar>
                          {isCreator(participant) && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-white font-medium truncate">
                              {getParticipantName(participant)}
                            </h4>
                            {getSignupStatus(participant)}
                          </div>
                          
                          {editingParticipant === participant.id ? (
                            <div className="flex items-center space-x-2 mt-2">
                              <Input
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                placeholder="Enter new email"
                                className="text-sm bg-[#1a1d21] border-gray-600 text-white"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleEditEmail(participant.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingParticipant(null);
                                  setEditEmail('');
                                }}
                                className="text-gray-400 hover:text-white"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-400 truncate">
                                {participant.displayEmail && !participant.displayEmail.includes('@manual.participant') 
                                  ? participant.displayEmail 
                                  : 'No email provided'}
                              </p>
                              <div className="flex items-center space-x-2">
                                {getRSVPBadge(participant.rsvp_status)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      {canEditParticipant(participant) && (
                        <div className="flex items-center space-x-1 ml-3">
                          {!isCreator(participant) && (
                            <>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white hover:bg-[#1a1d21] h-8 w-8 p-0"
                                  >
                                    <HelpCircle className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#1a1d21] border-gray-600">
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRSVP(participant.id, 'accepted')}
                                    className="text-green-400 hover:text-green-300 hover:bg-[#2a2d32]"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Coming
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRSVP(participant.id, 'maybe')}
                                    className="text-yellow-400 hover:text-yellow-300 hover:bg-[#2a2d32]"
                                  >
                                    <HelpCircle className="w-4 h-4 mr-2" />
                                    Maybe
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRSVP(participant.id, 'declined')}
                                    className="text-red-400 hover:text-red-300 hover:bg-[#2a2d32]"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Not Coming
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingParticipant(participant.id);
                                  setEditEmail(participant.displayEmail || '');
                                }}
                                className="text-gray-400 hover:text-white hover:bg-[#1a1d21] h-8 w-8 p-0"
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveParticipant(participant.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </ResponsiveModal>
  );
};

export default ManageParticipantsModal; 