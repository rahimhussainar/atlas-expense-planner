
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TripsList from '@/components/Dashboard/TripsList';
import EmptyTripState from '@/components/Dashboard/EmptyTripState';
import { Trip } from '@/types/trip';

interface DashboardTabsProps {
  trips: Trip[];
  allUpcomingTrips: Trip[];
  pastTrips: Trip[];
  onTripDeleted: () => void;
  onTripUpdated: () => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  trips, 
  allUpcomingTrips, 
  pastTrips, 
  onTripDeleted, 
  onTripUpdated 
}) => {
  return (
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
            onTripDeleted={onTripDeleted} 
            onTripUpdated={onTripUpdated}
          />
        ) : (
          <EmptyTripState 
            message="No upcoming trips" 
            description="Start planning your next adventure!"
          />
        )}
      </TabsContent>
      <TabsContent value="past">
        {pastTrips.length > 0 ? (
          <TripsList 
            trips={pastTrips} 
            onTripDeleted={onTripDeleted} 
            onTripUpdated={onTripUpdated}
          />
        ) : (
          <EmptyTripState 
            message="No past trips" 
            description="Your completed trips will appear here."
          />
        )}
      </TabsContent>
      <TabsContent value="all">
        {trips.length > 0 ? (
          <TripsList 
            trips={trips} 
            onTripDeleted={onTripDeleted} 
            onTripUpdated={onTripUpdated}
          />
        ) : (
          <EmptyTripState 
            message="No trips" 
            description="All your trips will appear here."
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
