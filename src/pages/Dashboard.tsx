import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import TripsList from '@/components/Dashboard/TripsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateTripForm from '../components/Dashboard/CreateTripForm';

export interface Trip {
  id: string;
  title: string;
  destination: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  currency: string;
  cover_image: string | null;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Add a ref to track if we've already fetched to prevent multiple fetches
  const fetchedRef = React.useRef(false);

  // Memoize fetchTrips to prevent recreation on each render
  const fetchTrips = useCallback(async () => {
    // Skip if we don't have a user
    if (!user) return;
    
    try {
      console.log("Fetching trips for user:", user.id);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      console.log("Trips fetched successfully:", data?.length || 0);
      console.log("Raw trip data:", data);

      // Map the database fields to match our Trip interface
      const mappedTrips: Trip[] = data?.map(trip => ({
        id: trip.id,
        title: trip.trip_title, // Map trip_title to title
        destination: trip.destination,
        description: trip.description ?? '',
        start_date: trip.start_date,
        end_date: trip.end_date,
        currency: 'USD', // Default currency since it doesn't exist in database
        cover_image: trip.cover_image,
        created_at: trip.created_at || new Date().toISOString()
      })) || [];
      
      console.log("Mapped trips:", mappedTrips);
      setTrips(mappedTrips);
    } catch (error: any) {
      console.error("Error fetching trips:", error);
      toast({
        title: 'Error',
        description: `Failed to load trips: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setHasAttemptedFetch(true);
    }
  }, [user, toast]);

  // Single useEffect to handle fetch logic with proper dependency management
  useEffect(() => {
    // Only fetch if we have a user and haven't fetched yet
    if (user && !fetchedRef.current) {
      console.log("Dashboard effect running, user:", !!user);
      fetchedRef.current = true; // Mark as fetched
      fetchTrips();
    }
  }, [user, fetchTrips]);

  // Reset fetchedRef when user changes
  useEffect(() => {
    return () => {
      fetchedRef.current = false;
    };
  }, [user?.id]);

  // Add function to trigger manual refresh
  const refreshTrips = useCallback(() => {
    console.log("Manual refresh triggered");
    fetchedRef.current = false; // Allow fetch again
    fetchTrips();
  }, [fetchTrips]);

  // Improved filtering logic for upcoming, current, and past trips
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
  
  const upcomingTrips = trips.filter(trip => {
    if (!trip.start_date) return false;
    
    const startDate = new Date(trip.start_date);
    
    // A trip is upcoming if its start date is in the future
    const isUpcoming = startDate > today;
    
    console.log(`Trip: ${trip.title}, Start date: ${startDate}, Is upcoming: ${isUpcoming}`);
    
    return isUpcoming;
  });

  const currentTrips = trips.filter(trip => {
    if (!trip.start_date || !trip.end_date) return false;
    
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    
    // A trip is current if its start date is today or in the past AND its end date is today or in the future
    const isCurrent = startDate <= today && endDate >= today;
    
    console.log(`Trip: ${trip.title}, Start: ${startDate}, End: ${endDate}, Is current: ${isCurrent}`);
    
    return isCurrent;
  });

  const pastTrips = trips.filter(trip => {
    if (!trip.end_date) return false;
    
    const endDate = new Date(trip.end_date);
    
    // A trip is past if its end date is in the past
    const isPast = endDate < today;
    
    console.log(`Trip: ${trip.title}, End date: ${endDate}, Is past: ${isPast}`);
    
    return isPast;
  });

  // Combined upcoming and current trips for the "Upcoming" tab
  const allUpcomingTrips = [...upcomingTrips, ...currentTrips];

  const handleTripCreated = () => {
    console.log("Trip created, refreshing trips");
    setIsCreateModalOpen(false);
    refreshTrips();
  };

  const handleTripUpdated = () => {
    console.log("Trip updated, refreshing trips");
    refreshTrips();
  };

  const handleTripDeleted = () => {
    console.log("Trip deleted, refreshing trips");
    refreshTrips();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Trips</h1>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-atlas-forest hover:bg-atlas-forest/90">
                <Plus className="mr-2 h-4 w-4" /> New Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white">
              <DialogHeader>
                <DialogTitle>Create New Trip</DialogTitle>
              </DialogHeader>
              <CreateTripForm onSuccess={handleTripCreated} />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atlas-forest" />
          </div>
        ) : trips.length > 0 ? (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming & Current</TabsTrigger>
              <TabsTrigger value="past">Past Trips</TabsTrigger>
              <TabsTrigger value="all">All Trips</TabsTrigger> 
            </TabsList>
            <TabsContent value="upcoming">
              {allUpcomingTrips.length > 0 ? (
                <TripsList 
                  trips={allUpcomingTrips} 
                  onTripDeleted={handleTripDeleted} 
                  onTripUpdated={handleTripUpdated}
                />
              ) : (
                <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center py-16 px-8">
                  <Plus className="h-12 w-12 text-gray-300 mb-4" />
                  <h2 className="font-semibold text-xl mb-2">No upcoming trips</h2>
                  <p className="text-gray-600 mb-2">Start planning your next adventure!</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="past">
              {pastTrips.length > 0 ? (
                <TripsList 
                  trips={pastTrips} 
                  onTripDeleted={handleTripDeleted} 
                  onTripUpdated={handleTripUpdated}
                />
              ) : (
                <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center py-16 px-8">
                  <Plus className="h-12 w-12 text-gray-300 mb-4" />
                  <h2 className="font-semibold text-xl mb-2">No past trips</h2>
                  <p className="text-gray-600">Your completed trips will appear here.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="all">
              {trips.length > 0 ? (
                <TripsList 
                  trips={trips} 
                  onTripDeleted={handleTripDeleted} 
                  onTripUpdated={handleTripUpdated}
                />
              ) : (
                <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center py-16 px-8">
                  <Plus className="h-12 w-12 text-gray-300 mb-4" />
                  <h2 className="font-semibold text-xl mb-2">No trips</h2>
                  <p className="text-gray-600">All your trips will appear here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center py-16 px-8">
            <Plus className="h-12 w-12 text-gray-300 mb-4" />
            <h2 className="font-semibold text-xl mb-2">No trips yet</h2>
            <p className="text-gray-600 mb-2">Create your first trip to start planning your adventure!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
