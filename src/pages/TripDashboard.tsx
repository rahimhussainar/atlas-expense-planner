import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import { Card } from '@/components/ui/card';
import { 
  Users, 
  Activity as ActivityIcon, 
  DollarSign, 
  Calendar, 
  Settings, 
  Plus,
  UserPlus,
  Receipt,
  MapPin,
  Clock,
  CheckCircle2,
  HelpCircle,
  XCircle,
  ThumbsUp,
  MessageSquare,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronDown,
  ExternalLink,
  Ticket,
  Pencil,
  Trash,
  Info as InfoIcon,
  Star,
  Car,
  Building2,
  PartyPopper,
  Map
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/Dashboard/StatCard';
import { useTheme } from '@/components/ThemeProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ActivityCard from '@/components/Dashboard/ActivityCard';
import ParticipantCard from '@/components/Dashboard/ParticipantCard';
import ExpenseCard from '@/components/Dashboard/ExpenseCard';
import AddParticipantModal from '@/components/Dashboard/AddParticipantModal';
import ImageUploadModal from '@/components/Dashboard/ImageUploadModal';
import StatCardsSection from '@/components/Dashboard/StatCardsSection';
import { useTripData } from '@/hooks/useTripData';
import { useCountdown } from '@/hooks/useCountdown';
import { useStatCards } from '@/hooks/useStatCards';
import SuggestActivityDialog from '@/components/Dashboard/SuggestActivityDialog';
import { useToast } from '@/components/ui/use-toast';


// Helpers/constants outside the main component
const categoryBadgeStyles = {
  fun: 'bg-[#23272b] text-white dark:bg-[#23272b] dark:text-white',
  food: 'bg-[#23272b] text-white dark:bg-[#23272b] dark:text-white',
  sightseeing: 'bg-[#23272b] text-white dark:bg-[#23272b] dark:text-white',
  default: 'bg-[#23272b] text-white dark:bg-[#23272b] dark:text-white',
};

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-white text-white' : 'text-[#444] dark:text-[#444]'} stroke-1`}
      fill={i < Math.round(rating) ? 'currentColor' : 'none'}
    />
  ));
}

function formatPricePerPerson(activity: any) {
  return activity.priceType === 'per_person'
    ? activity.price
    : activity.totalPrice / 5;
}

const TripDashboard: React.FC = () => {
  const { id } = useParams();
  const { 
    trip, 
    participants, 
    activities, 
    expenses, 
    loading, 
    error,
    handleVote,
    getVoteCount,
    hasUserVoted,
    isAuthenticated,
    refetch
  } = useTripData(id);
  const { theme, setTheme } = useTheme();
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: '',
    status: 'pending'
  });
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [expandedActivities, setExpandedActivities] = useState<number[]>([]);
  const { countdownProgress, countdownInfo } = useCountdown(trip);
  const confirmedParticipants = useMemo(
    () => participants.filter(p => {
      const status = (p.rsvp_status || '').toLowerCase();
      return status === 'confirmed' || status === 'accepted';
    }),
    [participants]
  );
  const confirmedActivities = useMemo(() => activities.filter(a => a.status === 'confirmed'), [activities]);
  const statCards = useStatCards({
    participants,
    confirmedParticipants,
    activities,
    confirmedActivities,
    expenses,
    trip,
    countdownInfo,
    countdownProgress
  });

  // Progress bar logic
  const participantProgress = participants.length > 0 ? (confirmedParticipants.length / participants.length) * 100 : 0;
  const activityProgress = activities.length > 0 ? (confirmedActivities.length / activities.length) * 100 : 0;

  // --- Expenses logic ---
  // For demo, let's assume fixed costs are in trip_expenses table with a 'type' or 'is_fixed' flag
  // We'll mock this for now, but you can later fetch from supabase
  // Example: const fixedExpenses = expenses.filter(e => e.is_fixed)
  // For now, just sum all expenses with a 'fixed' flag
  const fixedCosts = useMemo(() => expenses.filter(e => e.is_fixed), [expenses]);
  const totalFixedCosts = useMemo(() => fixedCosts.reduce((sum, e) => sum + (e.amount || 0), 0), [fixedCosts]);

  // Mock data for development
  const mockParticipants = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'confirmed', owes: 150, owed: 75 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'maybe', owes: 0, owed: 150 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'declined', owes: 50, owed: 0 },
  ];

  const mockExpenses = [
    { id: 1, description: 'Hotel Booking', amount: 300, purchaser: 'John Doe', date: '2024-03-15', category: 'accommodation' },
    { id: 2, description: 'Dinner', amount: 150, purchaser: 'Jane Smith', date: '2024-03-16', category: 'food' },
    { id: 3, description: 'Museum Tickets', amount: 80, purchaser: 'Bob Johnson', date: '2024-03-17', category: 'activities' },
  ];

  // Add this function to handle adding participants
  const handleAddParticipant = () => {
    console.log('Adding participant:', newParticipant);
    setIsParticipantModalOpen(false);
    setNewParticipant({ name: '', email: '', status: 'pending' });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const handleImageSubmit = () => {
    if (selectedActivity) {
      // Here you would typically upload the image to your storage service
      // For now, we'll just update the mock data
      console.log('Uploading image for activity:', selectedActivity.id);
      console.log('Image URL:', imageUrl);
      console.log('Uploaded file:', uploadedImage);
      
      // Close the modal and reset states
      setIsImageUploadOpen(false);
      setSelectedActivity(null);
      setImageUrl('');
      setUploadedImage(null);
    }
  };

  const [isSuggestActivityOpen, setIsSuggestActivityOpen] = useState(false);
  const [suggestActivityMode, setSuggestActivityMode] = useState<'add' | 'edit'>('add');
  const [activityToEdit, setActivityToEdit] = useState<any>(null);
  const { toast } = useToast();
  const [activityToDelete, setActivityToDelete] = useState<any>(null);
  const [isDeletingActivity, setIsDeletingActivity] = useState(false);

  // Handler to submit a new or edited activity
  const handleSuggestActivity = async (activity: any) => {
    if (!id) return;
    const { id: activityId, title, description, business, place, category, costType, cost, thumbnail } = activity;
    const { name, address, rating, website } = business || {};

    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;
    const userName = userData?.user?.user_metadata?.full_name || userData?.user?.email || 'Unknown';

    // Get confirmed participants count
    const { data: participantsData } = await supabase
      .from('trip_participants')
      .select('*')
      .eq('trip_id', id)
      .in('rsvp_status', ['confirmed', 'accepted']);
    const confirmedParticipantsCount = participantsData?.length || 1;
    let price = null;
    let totalPrice = null;
    if (cost !== '' && cost != null && !isNaN(Number(cost))) {
      if (costType === 'perPerson') {
        price = Number(cost);
        totalPrice = price * confirmedParticipantsCount;
      } else {
        totalPrice = Number(cost);
        price = totalPrice / confirmedParticipantsCount;
      }
    }

    // --- IMAGE UPLOAD LOGIC ---
    let imageUrl = null;
    if (thumbnail && userId) {
      const fileExt = thumbnail.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('activity-images')
        .upload(fileName, thumbnail);
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('activity-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    const payload = {
      trip_id: id,
      title: title || null,
      description: description || null,
      location: address || place || null,
      created_by: userId,
      status: 'suggested',
      business_name: name || null,
      business_address: address || null,
      business_rating: rating || null,
      business_website: website || null,
      category: category || 'fun',
      created_by_name: userName,
      price_type: costType === 'perPerson' ? 'per_person' : 'total',
      price: typeof price === 'number' && !isNaN(price) ? price : null,
      total_price: typeof totalPrice === 'number' && !isNaN(totalPrice) ? totalPrice : null,
      image: imageUrl || (activity.image || null),
    };

    if (activityId) {
      // Edit mode: update existing activity
      await supabase.from('trip_activities').update(payload).eq('id', activityId);
    } else {
      // Add mode: insert new activity
      await supabase.from('trip_activities').insert(payload);
    }
    setIsSuggestActivityOpen(false);
    setActivityToEdit(null);
    setSuggestActivityMode('add');
    refetch();
  };

  // Handler to open add modal
  const openAddActivityModal = () => {
    setActivityToEdit(null);
    setSuggestActivityMode('add');
    setIsSuggestActivityOpen(true);
  };

  // Handler to open edit modal
  const openEditActivityModal = (activity: any) => {
    setActivityToEdit(activity);
    setSuggestActivityMode('edit');
    setIsSuggestActivityOpen(true);
  };

  // Delete activity handler
  const handleDeleteActivity = async (activity: any) => {
    setActivityToDelete(activity);
  };

  const confirmDeleteActivity = async () => {
    if (!activityToDelete) return;
    setIsDeletingActivity(true);
    try {
      const { error } = await supabase
        .from('trip_activities')
        .delete()
        .eq('id', activityToDelete.id);
      if (error) throw error;
      toast({ title: 'Activity Deleted', description: 'The activity has been deleted.' });
      setActivityToDelete(null);
      refetch();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete activity.', variant: 'destructive' });
    } finally {
      setIsDeletingActivity(false);
    }
  };

  const cancelDeleteActivity = () => {
    setActivityToDelete(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
        <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-4xl font-bold mb-1 truncate">{trip?.trip_title || 'Trip'}</h1>
            <p className="text-lg text-gray-500 truncate">
              {trip?.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              {' '}to{' '}
              {trip?.end_date ? new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              {trip?.destination ? ` · ${trip.destination}` : ''}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
          <button className="ml-4 p-2 rounded-full text-gray-400 hover:text-gray-700 transition-colors" title="Trip Settings" aria-label="Trip Settings">
            <Settings size={24} />
          </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsParticipantModalOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Manage Participants
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atlas-forest" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <StatCardsSection statCards={statCards} />
            <div className="space-y-8">
              {/* Participants Section - New Design */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                    Trip Squad
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsParticipantModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Invite
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockParticipants.map((participant) => (
                    <ParticipantCard key={participant.id} participant={participant} />
                  ))}
                </div>
              </Card>

              {/* Expenses Section - Card Stack Style */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Receipt className="mr-2 h-5 w-5 text-emerald-500" />
                    Expense Tracker
                  </h2>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Expense
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockExpenses.map((expense, index) => (
                    <ExpenseCard key={expense.id} expense={expense} index={index} />
                  ))}
                </div>
              </Card>

              {/* Activities Section - Proposal Board Style */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <ActivityIcon className="mr-2 h-5 w-5 text-orange-500" />
                    Activity Proposals
                  </h2>
                  {activities.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={openAddActivityModal}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Activity
                    </Button>
                  )}
                </div>
                {activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Map className="w-12 h-12 text-[#4a6c6f] mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-foreground">No activities yet!</h3>
                    <p className="text-muted-foreground mb-6">Be the first to suggest an activity for this trip.</p>
                    <Button variant="outline" size="icon" className="rounded-full border-[#4a6c6f] text-[#4a6c6f] hover:bg-[#e6f0f1]" aria-label="Suggest Activity" onClick={openAddActivityModal}>
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        expanded={expandedActivities.includes(activity.id)}
                        onExpand={(open) => {
                          setExpandedActivities(prev => 
                            open 
                              ? [...prev, activity.id]
                              : prev.filter(id => id !== activity.id)
                          );
                        }}
                        onImageUpload={handleImageUpload}
                        onEdit={() => openEditActivityModal(activity)}
                        onDelete={() => handleDeleteActivity(activity)}
                        onVote={handleVote}
                        voteCount={getVoteCount(activity.id)}
                        hasVoted={hasUserVoted(activity.id)}
                        isAuthenticated={isAuthenticated}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Add Participant Modal */}
            <AddParticipantModal
              open={isParticipantModalOpen}
              onOpenChange={setIsParticipantModalOpen}
              newParticipant={newParticipant}
              setNewParticipant={setNewParticipant}
              onAddParticipant={handleAddParticipant}
            />

            {/* Image Upload Modal */}
            <ImageUploadModal
              open={isImageUploadOpen}
              onOpenChange={setIsImageUploadOpen}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              onImageUpload={handleImageUpload}
              onImageSubmit={handleImageSubmit}
              selectedActivity={selectedActivity}
            />

            <SuggestActivityDialog
              isOpen={isSuggestActivityOpen}
              onOpenChange={setIsSuggestActivityOpen}
              onSubmit={handleSuggestActivity}
              confirmedParticipantsCount={confirmedParticipants.length}
              loading={false}
              initialValues={activityToEdit}
              mode={suggestActivityMode}
            />

            {activityToDelete && (
              <Dialog open={!!activityToDelete} onOpenChange={cancelDeleteActivity}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Activity</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this activity? This action cannot be undone.</DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={cancelDeleteActivity} disabled={isDeletingActivity}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmDeleteActivity} disabled={isDeletingActivity}>{isDeletingActivity ? 'Deleting...' : 'Delete'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </>
      )}
      </main>
    </div>
);
};

export default TripDashboard;