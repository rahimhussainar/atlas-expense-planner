import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import NewTripDialog from '@/components/Dashboard/NewTripDialog';
import EmptyTripState from '@/components/Dashboard/EmptyTripState';
import TripsList from '@/components/Dashboard/TripsList';
import { useFilterTrips } from '@/components/Dashboard/TripFilters';
import { useTrips } from '@/hooks/useTrips';
import { useTheme } from '@/components/ThemeProvider';
import { Plus, Calendar, History, Clock, Sparkles } from 'lucide-react';
import { EmptyStateCard } from '@/components/shared/EmptyStateCard';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import EditTripDialog from '@/components/Dashboard/EditTripDialog';
import DeleteTripDialog from '@/components/Dashboard/DeleteTripDialog';
import { useTripActions } from '@/hooks/useTripActions';
import { Trip } from '@/types/trip';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trips, loading, fetchTrips } = useTrips();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
  const { tripToDelete, setTripToDelete, isDeleting, handleDeleteTrip } = useTripActions(() => {
    fetchedRef.current = false;
    fetchTrips();
  });
  
  // Add a ref to track if we've already fetched to prevent multiple fetches
  const fetchedRef = useRef(false);

  // Memoize the fetch callback
  const fetchTripsCallback = useCallback(() => {
    if (user && !fetchedRef.current) {
      console.log("Dashboard effect running, user:", !!user);
      fetchedRef.current = true;
      fetchTrips();
    }
  }, [user, fetchTrips]);

  // Single useEffect to handle fetch logic with proper dependency management
  useEffect(() => {
    fetchTripsCallback();
  }, [fetchTripsCallback]);

  // Reset fetchedRef when user changes
  useEffect(() => {
    return () => {
      fetchedRef.current = false;
    };
  }, [user?.id]);

  // Get filtered trips with memoization
  const { allUpcomingTrips, pastTrips, currentTrips } = useFilterTrips(trips);

  // Memoize the handlers to prevent unnecessary re-renders
  const handleTripCreated = useCallback(() => {
    console.log("Trip created, refreshing trips");
    setIsCreateModalOpen(false);
    fetchedRef.current = false;
    fetchTrips();
  }, [fetchTrips]);

  const handleTripUpdated = useCallback(() => {
    console.log("Trip updated, refreshing trips");
    fetchedRef.current = false;
    fetchTrips();
  }, [fetchTrips]);

  const handleTripDeleted = useCallback(() => {
    console.log("Trip deleted, refreshing trips");
    fetchedRef.current = false;
    fetchTrips();
  }, [fetchTrips]);

  // Memoize the dialog open state handler
  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsCreateModalOpen(open);
  }, []);

  const { theme, setTheme } = useTheme();

  // Filter out current trips from upcoming for the tab - memoized
  const upcomingTrips = useMemo(() => 
    allUpcomingTrips.filter(trip => !currentTrips.some(ct => ct.id === trip.id)),
    [allUpcomingTrips, currentTrips]
  );

  const handleEditTrip = useCallback((trip: Trip) => {
    setTripToEdit(trip);
  }, []);

  const handleEditSuccess = useCallback(() => {
    setTripToEdit(null);
    fetchedRef.current = false;
    fetchTrips();
  }, [fetchTrips]);

  // Memoize trip list props to prevent unnecessary re-renders
  const currentTripListProps = useMemo(() => ({
    trips: currentTrips,
    onTripDeleted: handleTripDeleted,
    onTripUpdated: handleTripUpdated,
    onEditTrip: handleEditTrip,
    onDeleteTrip: setTripToDelete,
  }), [currentTrips, handleTripDeleted, handleTripUpdated, handleEditTrip, setTripToDelete]);

  const upcomingTripListProps = useMemo(() => ({
    trips: upcomingTrips,
    onTripDeleted: handleTripDeleted,
    onTripUpdated: handleTripUpdated,
    onEditTrip: handleEditTrip,
    onDeleteTrip: setTripToDelete,
  }), [upcomingTrips, handleTripDeleted, handleTripUpdated, handleEditTrip, setTripToDelete]);

  const pastTripListProps = useMemo(() => ({
    trips: pastTrips,
    onTripDeleted: handleTripDeleted,
    onTripUpdated: handleTripUpdated,
    onEditTrip: handleEditTrip,
    onDeleteTrip: setTripToDelete,
  }), [pastTrips, handleTripDeleted, handleTripUpdated, handleEditTrip, setTripToDelete]);

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
      
      {/* Hero Section */}
      <div className="relative">
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <p className="text-sm font-medium text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || 'Traveler'}</p>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Your Adventures
              </h1>
              <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-2xl">
                Plan your next journey, track expenses, and create unforgettable memories with your travel companions.
              </p>
            </div>
            <div className="flex-shrink-0">
              <NewTripDialog 
                isOpen={isCreateModalOpen} 
                onOpenChange={handleDialogOpenChange} 
                onTripCreated={handleTripCreated}
              />
            </div>
          </div>
        </main>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted border-t-[#4a6c6f]" />
              <Plus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-[#4a6c6f]" />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Trips Section */}
            {currentTrips.length > 0 && (
              <section className="relative">
                <Card className="relative overflow-hidden border-border shadow-lg bg-card/80 dark:bg-[#2a2b2f] backdrop-blur-sm">
                  <div className="relative p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
                          <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold">Currently Traveling</h2>
                          <p className="text-sm text-muted-foreground">Your active adventures</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-0 px-3 py-1">
                        {currentTrips.length} Active
                      </Badge>
                    </div>
                    <TripsList {...currentTripListProps} />
                  </div>
                </Card>
              </section>
            )}

            {/* Upcoming Trips Section */}
            <section className="relative">
              <Card className="relative overflow-hidden border-border shadow-lg bg-card/80 dark:bg-[#272829] backdrop-blur-sm">
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#4a6c6f]/10 dark:bg-[#4a6c6f]/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-[#4a6c6f] dark:text-[#7a9ea3]" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold">Upcoming Adventures</h2>
                        <p className="text-sm text-muted-foreground">Plan your future journeys</p>
                      </div>
                    </div>
                    {upcomingTrips.length > 0 && (
                      <Badge className="bg-[#4a6c6f]/10 text-[#4a6c6f] dark:bg-[#4a6c6f]/20 dark:text-[#7a9ea3] border-0 px-3 py-1">
                        {upcomingTrips.length} Planned
                      </Badge>
                    )}
                  </div>
                  {upcomingTrips.length === 0 ? (
                    <EmptyStateCard
                      icon={<Plus className="w-12 h-12 text-[#4a6c6f]" />}
                      title="No upcoming trips"
                      description="Start planning your next adventure!"
                    />
                  ) : (
                    <TripsList {...upcomingTripListProps} />
                  )}
                </div>
              </Card>
            </section>

            {/* Past Trips Section */}
            <section className="relative">
              <Card className="relative overflow-hidden border-border shadow-lg bg-card/80 dark:bg-[#252627] backdrop-blur-sm">
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-500/10 dark:bg-gray-500/20 rounded-lg">
                        <History className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold">Past Adventures</h2>
                        <p className="text-sm text-muted-foreground">Relive your memories</p>
                      </div>
                    </div>
                    {pastTrips.length > 0 && (
                      <Badge className="bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-0 px-3 py-1">
                        {pastTrips.length} Completed
                      </Badge>
                    )}
                  </div>
                  {pastTrips.length === 0 ? (
                    <EmptyStateCard
                      icon={<Plus className="w-12 h-12 text-gray-500" />}
                      title="No past trips yet"
                      description="Your completed trips will appear here"
                    />
                  ) : (
                    <TripsList {...pastTripListProps} />
                  )}
                </div>
              </Card>
            </section>
          </div>
        )}
      </main>

      {/* Trip Modals - Rendered at page level */}
      <EditTripDialog
        trip={tripToEdit}
        onClose={() => setTripToEdit(null)}
        onSuccess={handleEditSuccess}
      />

      <DeleteTripDialog
        trip={tripToDelete}
        isDeleting={isDeleting}
        onCancel={() => setTripToDelete(null)}
        onConfirmDelete={handleDeleteTrip}
      />
    </div>
  );
};

export default React.memo(Dashboard);
