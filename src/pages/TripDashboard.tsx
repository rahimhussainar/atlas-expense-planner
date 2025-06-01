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
import ExpenseDialog from '@/components/Dashboard/ExpenseDialog';
import ManageParticipantsModal from '@/components/Dashboard/ManageParticipantsModal';
import ImageUploadModal from '@/components/Dashboard/ImageUploadModal';
import StatCardsSection from '@/components/Dashboard/StatCardsSection';
import { useTripData } from '@/hooks/useTripData';
import { useCountdown } from '@/hooks/useCountdown';
import { useStatCards } from '@/hooks/useStatCards';
import SuggestActivityDialog from '@/components/Dashboard/SuggestActivityDialog';
import { useToast } from '@/components/ui/use-toast';
import { uploadActivityImage, deleteActivityImage } from '@/utils/supabase-storage';
import { DeleteConfirmationDialog } from '@/components/shared/DeleteConfirmationDialog';
import { EmptyStateCard } from '@/components/shared/EmptyStateCard';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import { TripActivity } from '@/types/activity';

// Add expense type
interface TripExpense {
  id: string;
  description: string;
  totalAmount: number;
  date: string;
  category: string;
  payers: {
    participantId: string;
    name: string;
    amount: number;
  }[];
  debtors: {
    participantId: string;
    name: string;
    amount: number;
  }[];
}

// Add expense type interface at the top with existing interfaces
interface TripExpenseWithDetails {
  id: string;
  title: string;
  description: string | null;
  totalAmount: number;
  date: string;
  category: string;
  payers: {
    participantId: string;
    name: string;
    amount: number;
  }[];
  debtors: {
    participantId: string;
    name: string;
    amount: number;
  }[];
  created_by_name?: string;
}

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
    getVoterNames,
    voterProfiles,
    isAuthenticated,
    refetch
  } = useTripData(id);
  const { theme, setTheme } = useTheme();
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [expandedActivities, setExpandedActivities] = useState<number[]>([]);
  const [expandedExpenses, setExpandedExpenses] = useState<string[]>([]);
  const [detailedExpenses, setDetailedExpenses] = useState<TripExpenseWithDetails[]>([]);
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
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'confirmed', owes: 150, owed: 75 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'maybe', owes: 0, owed: 150 },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'declined', owes: 50, owed: 0 },
  ];

  // Fetch detailed expense data from Supabase
  useEffect(() => {
    const fetchDetailedExpenses = async () => {
      if (!id) return;
      
      try {
        // Fetch expenses with their payers and debtors
        const { data: expensesData, error: expensesError } = await supabase
          .from('trip_expenses')
          .select('*')
          .eq('trip_id', id);

        if (expensesError) throw expensesError;

        // For each expense, fetch payers and debtors
        const detailedExpensesPromises = expensesData.map(async (expense) => {
          const [payersResult, debtorsResult] = await Promise.all([
            supabase
              .from('expense_payers')
              .select('*')
              .eq('expense_id', expense.id),
            supabase
              .from('expense_debtors')
              .select('*')
              .eq('expense_id', expense.id)
          ]);

          return {
            id: expense.id,
            title: expense.title,
            description: expense.description,
            totalAmount: expense.total_amount,
            date: expense.expense_date,
            category: expense.category || 'other',
            created_by_name: expense.created_by_name,
            payers: payersResult.data?.map(p => ({
              participantId: p.participant_id,
              name: p.participant_name,
              amount: p.amount
            })) || [],
            debtors: debtorsResult.data?.map(d => ({
              participantId: d.participant_id,
              name: d.participant_name,
              amount: d.amount
            })) || []
          };
        });

        const detailedExpensesData = await Promise.all(detailedExpensesPromises);
        setDetailedExpenses(detailedExpensesData);
      } catch (error) {
        console.error('Error fetching detailed expenses:', error);
      }
    };

    fetchDetailedExpenses();
  }, [id, expenses]); // Re-fetch when expenses change

  // Add this function to handle adding participants
  const handleAddParticipant = () => {
    // This function is no longer needed as the new modal handles everything internally
    setIsParticipantModalOpen(false);
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

  const { toast } = useToast();
  
  // Use the CRUD operations hook for activities
  const activityCrud = useCrudOperations<TripActivity>({ onRefresh: refetch });

  // Use the CRUD operations hook for expenses
  const expenseCrud = useCrudOperations<TripExpense>({ onRefresh: refetch });

  // Handler to submit a new or edited activity
  const handleSuggestActivity = async (activity: any) => {
    if (!id) return;
    const { id: activityId, title, description, business, place, category, costType, cost, thumbnail } = activity;
    const { name, address, rating, website, totalRatings } = business || {};

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
      // Upload new image and delete old one if editing
      imageUrl = await uploadActivityImage(
        thumbnail, 
        userId, 
        activityCrud.itemToEdit?.image
      );
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
      business_total_ratings: totalRatings || null,
      category: category || 'fun',
      created_by_name: userName,
      price_type: costType === 'perPerson' ? 'per_person' : 'total',
      price: typeof price === 'number' && !isNaN(price) ? price : null,
      total_price: typeof totalPrice === 'number' && !isNaN(totalPrice) ? totalPrice : null,
      image: imageUrl || (activityCrud.itemToEdit?.image || null),
    };

    if (activityId) {
      // Edit mode: update existing activity
      await supabase.from('trip_activities').update(payload).eq('id', activityId);
    } else {
      // Add mode: insert new activity
      await supabase.from('trip_activities').insert(payload);
    }
    activityCrud.closeForm();
    refetch();
  };

  // Delete activity handler
  const handleDeleteActivity = async (activity: TripActivity) => {
    // Delete the activity image from storage first
    if (activity.image) {
      await deleteActivityImage(activity.image);
    }
    
      const { error } = await supabase
        .from('trip_activities')
        .delete()
      .eq('id', activity.id);
    
      if (error) throw error;
  };

  // Handler to submit a new or edited expense
  const handleSubmitExpense = async (formData: any) => {
    if (!id) return;

    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      const userName = userData?.user?.user_metadata?.full_name || userData?.user?.email || 'Unknown';

      if (expenseCrud.formMode === 'edit' && expenseCrud.itemToEdit) {
        // Update existing expense
        const { error: expenseError } = await supabase
          .from('trip_expenses')
          .update({
            title: formData.description,
            description: formData.description,
            total_amount: formData.totalAmount,
            expense_date: formData.date,
            category: formData.category,
            updated_at: new Date().toISOString()
          })
          .eq('id', expenseCrud.itemToEdit.id);

        if (expenseError) throw expenseError;

        // Delete existing payers and debtors
        await Promise.all([
          supabase.from('expense_payers').delete().eq('expense_id', expenseCrud.itemToEdit.id),
          supabase.from('expense_debtors').delete().eq('expense_id', expenseCrud.itemToEdit.id)
        ]);

        // Insert new payers and debtors
        await Promise.all([
          supabase.from('expense_payers').insert(
            formData.payers.map((payer: any) => ({
              expense_id: expenseCrud.itemToEdit.id,
              participant_id: payer.participantId,
              participant_name: mockParticipants.find(p => p.id === payer.participantId)?.name || 'Unknown',
              amount: payer.amount
            }))
          ),
          supabase.from('expense_debtors').insert(
            formData.debtors.map((debtor: any) => ({
              expense_id: expenseCrud.itemToEdit.id,
              participant_id: debtor.participantId,
              participant_name: mockParticipants.find(p => p.id === debtor.participantId)?.name || 'Unknown',
              amount: debtor.amount
            }))
          )
        ]);
      } else {
        // Create new expense
        const { data: newExpense, error: expenseError } = await supabase
          .from('trip_expenses')
          .insert({
            trip_id: id,
            title: formData.description,
            description: formData.description,
            total_amount: formData.totalAmount,
            expense_date: formData.date,
            category: formData.category,
            created_by: userId || '',
            created_by_name: userName
          })
          .select()
          .single();

        if (expenseError) throw expenseError;

        // Insert payers and debtors
        await Promise.all([
          supabase.from('expense_payers').insert(
            formData.payers.map((payer: any) => ({
              expense_id: newExpense.id,
              participant_id: payer.participantId,
              participant_name: mockParticipants.find(p => p.id === payer.participantId)?.name || 'Unknown',
              amount: payer.amount
            }))
          ),
          supabase.from('expense_debtors').insert(
            formData.debtors.map((debtor: any) => ({
              expense_id: newExpense.id,
              participant_id: debtor.participantId,
              participant_name: mockParticipants.find(p => p.id === debtor.participantId)?.name || 'Unknown',
              amount: debtor.amount
            }))
          )
        ]);
      }

      toast({
        title: expenseCrud.formMode === 'edit' ? 'Expense updated' : 'Expense added',
        description: `${formData.description} has been ${expenseCrud.formMode === 'edit' ? 'updated' : 'added'} successfully.`,
      });
      
      expenseCrud.closeForm();
      refetch(); // This will trigger the useEffect to refetch detailed expenses
    } catch (error: any) {
      console.error('Error saving expense:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save expense. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handler to delete an expense
  const handleDeleteExpense = async (expense: TripExpenseWithDetails) => {
    try {
      // Delete payers and debtors first (due to foreign key constraints)
      await Promise.all([
        supabase.from('expense_payers').delete().eq('expense_id', expense.id),
        supabase.from('expense_debtors').delete().eq('expense_id', expense.id)
      ]);

      // Delete the expense
      const { error } = await supabase
        .from('trip_expenses')
        .delete()
        .eq('id', expense.id);
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-gray-100/30 dark:from-gray-900/50 dark:via-transparent dark:to-gray-800/30" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#4a6c6f]/5 dark:bg-[#4a6c6f]/3 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gray-300/20 dark:bg-gray-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#4a6c6f]/5 dark:bg-[#4a6c6f]/3 rounded-full blur-3xl" />
      </div>
      
      <DashboardHeader />
      <main className="relative max-w-6xl mx-auto px-4 py-10 animate-fade-in">
        <div className="flex items-start justify-between mb-10 gap-4">
          <div className="min-w-0 flex-1 pr-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 leading-tight">{trip?.trip_title || 'Trip'}</h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              {trip?.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              {' '}to{' '}
              {trip?.end_date ? new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              {trip?.destination ? ` · ${trip.destination}` : ''}
            </p>
          </div>
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors bg-background hover:bg-muted border border-border" title="Trip Settings" aria-label="Trip Settings">
                  <Settings size={20} className="sm:w-6 sm:h-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsParticipantModalOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Manage Participants
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a6c6f]" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <StatCardsSection statCards={statCards} />
            <div className="space-y-8">
              {/* Participants Section - New Design */}
              <Card className="relative overflow-hidden border-border shadow-lg bg-card/80 dark:bg-[#272829] backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                    Trip Squad
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsParticipantModalOpen(true)}
                  >
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

              {/* Expenses Section - Updated to match Activities styling */}
              <Card className="relative overflow-hidden border-border shadow-lg bg-card/80 dark:bg-[#242529] backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Receipt className="mr-2 h-5 w-5 text-emerald-500" />
                    Expense Tracker
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={expenseCrud.openAddForm}
                    className="hover:bg-[#4a6c6f] hover:text-white transition-all"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Expense
                  </Button>
                </div>
                {detailedExpenses.length === 0 ? (
                  <EmptyStateCard
                    icon={<Receipt className="w-12 h-12 text-emerald-500" />}
                    title="No expenses yet"
                    description="Start tracking your trip expenses"
                    actionLabel="Add Expense"
                    onAction={expenseCrud.openAddForm}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {detailedExpenses.map((expense) => (
                      <ExpenseCard 
                        key={expense.id} 
                        expense={{
                          id: expense.id,
                          description: expense.title,
                          totalAmount: expense.totalAmount,
                          date: expense.date,
                          category: expense.category,
                          payers: expense.payers,
                          debtors: expense.debtors
                        }}
                        expanded={expandedExpenses.includes(expense.id)}
                        onExpand={(open) => {
                          setExpandedExpenses(prev => 
                            open 
                              ? [...prev, expense.id]
                              : prev.filter(id => id !== expense.id)
                          );
                        }}
                        onEdit={() => expenseCrud.openEditForm({
                          ...expense,
                          description: expense.title,
                          totalAmount: expense.totalAmount
                        })}
                        onDelete={() => expenseCrud.handleDelete(expense)}
                      />
                    ))}
                  </div>
                )}
              </Card>

              {/* Activities Section - Proposal Board Style */}
              <Card className="relative overflow-hidden border-border shadow-lg bg-card/80 dark:bg-[#242529] backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-[#bfae5c]" />
                    Activity Proposals
                  </h2>
                  {activities.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={activityCrud.openAddForm}
                      className="hover:bg-[#4a6c6f] hover:text-white transition-all"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Activity
                    </Button>
                  )}
                </div>
                {activities.length === 0 ? (
                  <EmptyStateCard
                    icon={<Calendar className="w-12 h-12 text-[#bfae5c]" />}
                    title="No activities yet!"
                    description="Be the first to suggest an activity for this trip."
                    actionLabel="Suggest an Activity"
                    onAction={activityCrud.openAddForm}
                  />
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
                        onEdit={() => activityCrud.openEditForm(activity)}
                        onDelete={() => activityCrud.handleDelete(activity)}
                        onVote={handleVote}
                        voteCount={getVoteCount(activity.id)}
                        hasVoted={hasUserVoted(activity.id)}
                        isAuthenticated={isAuthenticated}
                        voters={getVoterNames(activity.id)}
                        voterProfiles={voterProfiles}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Manage Participants Modal */}
            <ManageParticipantsModal
              open={isParticipantModalOpen}
              onOpenChange={setIsParticipantModalOpen}
              tripId={id || ''}
              tripCreatedBy={trip?.created_by || ''}
              participants={participants}
              onRefresh={refetch}
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
              isOpen={activityCrud.isFormOpen}
              onOpenChange={activityCrud.setIsFormOpen}
              onSubmit={handleSuggestActivity}
              confirmedParticipantsCount={confirmedParticipants.length}
              loading={false}
              initialValues={activityCrud.itemToEdit}
              mode={activityCrud.formMode}
            />

            <DeleteConfirmationDialog
              isOpen={!!activityCrud.itemToDelete}
              onOpenChange={(open) => !open && activityCrud.cancelDelete()}
              onConfirm={() => activityCrud.confirmDelete(handleDeleteActivity, 'Activity deleted successfully')}
              onCancel={activityCrud.cancelDelete}
              title="Delete Activity"
              description="Are you sure you want to delete this activity? This action cannot be undone."
              isDeleting={activityCrud.isDeleting}
            />

            <ExpenseDialog
              isOpen={expenseCrud.isFormOpen}
              onOpenChange={expenseCrud.setIsFormOpen}
              onSubmit={handleSubmitExpense}
              participants={mockParticipants}
              loading={false}
              initialValues={expenseCrud.itemToEdit}
              mode={expenseCrud.formMode}
            />

            <DeleteConfirmationDialog
              isOpen={!!expenseCrud.itemToDelete}
              onOpenChange={(open) => !open && expenseCrud.cancelDelete()}
              onConfirm={() => expenseCrud.confirmDelete(handleDeleteExpense, 'Expense deleted successfully')}
              onCancel={expenseCrud.cancelDelete}
              title="Delete Expense"
              description="Are you sure you want to delete this expense? This action cannot be undone."
              isDeleting={expenseCrud.isDeleting}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default TripDashboard;