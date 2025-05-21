import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardTabs from '@/components/Dashboard/DashboardTabs';
import NewTripDialog from '@/components/Dashboard/NewTripDialog';
import EmptyTripState from '@/components/Dashboard/EmptyTripState';
import { useFilterTrips } from '@/components/Dashboard/TripFilters';
import { useTrips } from '@/hooks/useTrips';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trips, loading, fetchTrips } = useTrips();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
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

  // Memoize the main content to prevent unnecessary re-renders
  const mainContent = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atlas-forest" />
        </div>
      );
    }

    if (trips.length === 0) {
      return (
        <EmptyTripState 
          message="No trips yet" 
          description="Create your first trip to start planning your adventure!"
        />
      );
    }

    return (
      <DashboardTabs 
        trips={trips} 
        allUpcomingTrips={allUpcomingTrips} 
        pastTrips={pastTrips}
        currentTrips={currentTrips}
        onTripDeleted={handleTripDeleted} 
        onTripUpdated={handleTripUpdated}
      />
    );
  }, [loading, trips, allUpcomingTrips, pastTrips, currentTrips, handleTripDeleted, handleTripUpdated]);

  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Your Trips</h1>
          <NewTripDialog 
            isOpen={isCreateModalOpen} 
            onOpenChange={handleDialogOpenChange} 
            onTripCreated={handleTripCreated}
          />
        </div>

        {mainContent}
      </main>
    </div>
  );
};

export default React.memo(Dashboard);
