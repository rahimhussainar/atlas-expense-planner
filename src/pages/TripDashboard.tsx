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
  Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/Dashboard/StatCard';
import { useTheme } from '@/components/ThemeProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const { trip, participants, activities, expenses, loading, error } = useTripData(id);
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

  const mockActivities = [
    { 
      id: 1, 
      title: 'Beach Day', 
      description: 'Relaxing day at the beach with water activities and beach volleyball', 
      price: 50, 
      priceType: 'per_person', 
      totalPrice: 250, // For 5 people
      category: 'fun',
      votes: 5,
      proposedBy: 'John Doe',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
      location: 'Sunset Beach, Miami',
      businessName: 'Sunset Beach Club',
      address: '123 Ocean Ave, Miami, FL',
      rating: 4.5,
      ratingCount: 120,
      ticketLink: 'https://example.com/beach-tickets',
      driveTime: 12,
    },
    { 
      id: 2, 
      title: 'Group Dinner', 
      description: 'Dinner at the famous local seafood restaurant with ocean views', 
      price: 200, 
      priceType: 'total', 
      totalPrice: 200,
      category: 'food',
      votes: 3,
      proposedBy: 'Jane Smith',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60',
      location: 'Ocean View Restaurant, 123 Beach Blvd',
      businessName: 'Ocean View Restaurant',
      address: '456 Beach Blvd, Miami, FL',
      rating: 4.2,
      ratingCount: 87,
      ticketLink: 'https://example.com/restaurant-reservation',
      driveTime: 5,
    },
    { 
      id: 3, 
      title: 'City Tour', 
      description: 'Guided tour of historic landmarks and hidden gems', 
      price: 75, 
      priceType: 'per_person', 
      totalPrice: 375, // For 5 people
      category: 'sightseeing',
      votes: 4,
      proposedBy: 'Bob Johnson',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=60',
      location: 'Downtown Tour Center, Main Street',
      businessName: 'Downtown Tour Center',
      address: '789 Main St, Miami, FL',
      rating: 4.8,
      ratingCount: 210,
      ticketLink: 'https://example.com/city-tour',
      driveTime: 18,
    },
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
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Suggest Activity
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockActivities.map((activity) => (
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
                      onEdit={() => {
                        setSelectedActivity(activity);
                        setIsImageUploadOpen(true);
                      }}
                      onDelete={() => {
                        // Implement delete logic
                      }}
                    />
                  ))}
                </div>
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
          </>
      )}
      </main>
    </div>
);
};

export default TripDashboard;