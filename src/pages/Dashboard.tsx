
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardTabs from '@/components/Dashboard/DashboardTabs';
import NewTripDialog from '@/components/Dashboard/NewTripDialog';
import EmptyTripState from '@/components/Dashboard/EmptyTripState';
import { useFilterTrips } from '@/components/Dashboard/TripFilters';
import { useTrips } from '@/hooks/useTrips';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trips, loading, fetchTrips } = useTrips();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Add a ref to track if we've already fetched to prevent multiple fetches
  const fetchedRef = useRef(false);

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

  // Get filtered trips
  const { allUpcomingTrips, pastTrips, currentTrips } = useFilterTrips(trips);

  const handleTripCreated = () => {
    console.log("Trip created, refreshing trips");
    setIsCreateModalOpen(false);
    fetchedRef.current = false; // Allow fetch again
    fetchTrips();
  };

  const handleTripUpdated = () => {
    console.log("Trip updated, refreshing trips");
    fetchedRef.current = false; // Allow fetch again
    fetchTrips();
  };

  const handleTripDeleted = () => {
    console.log("Trip deleted, refreshing trips");
    fetchedRef.current = false; // Allow fetch again
    fetchTrips();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Trips</h1>
          <NewTripDialog 
            isOpen={isCreateModalOpen} 
            onOpenChange={setIsCreateModalOpen} 
            onTripCreated={handleTripCreated}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atlas-forest" />
          </div>
        ) : trips.length > 0 ? (
          <DashboardTabs 
            trips={trips} 
            allUpcomingTrips={allUpcomingTrips} 
            pastTrips={pastTrips}
            currentTrips={currentTrips}
            onTripDeleted={handleTripDeleted} 
            onTripUpdated={handleTripUpdated}
          />
        ) : (
          <EmptyTripState 
            message="No trips yet" 
            description="Create your first trip to start planning your adventure!"
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
