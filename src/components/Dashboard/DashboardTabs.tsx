import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TripsList from '@/components/Dashboard/TripsList';
import EmptyTripState from '@/components/Dashboard/EmptyTripState';
import { Trip } from '@/types/trip';
import { Separator } from '@/components/ui/separator';

interface DashboardTabsProps {
  trips: Trip[];
  allUpcomingTrips: Trip[];
  pastTrips: Trip[];
  onTripDeleted: () => void;
  onTripUpdated: () => void;
  currentTrips?: Trip[];
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  trips, 
  allUpcomingTrips, 
  pastTrips, 
  onTripDeleted, 
  onTripUpdated,
  currentTrips = []
}) => {
  // Filter out current trips from upcoming for the tab
  const upcomingTrips = allUpcomingTrips.filter(trip => !currentTrips.some(ct => ct.id === trip.id));

  return (
    <div className="w-full">
      {/* Current Trips Section */}
      {currentTrips.length > 0 && (
        <section className="mb-8">
          <div className="mb-2">
            <TripsList 
              trips={currentTrips} 
              onTripDeleted={onTripDeleted} 
              onTripUpdated={onTripUpdated}
            />
          </div>
          <Separator className="my-8" />
        </section>
      )}
      {/* Tabs for Upcoming and Past */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
          <TabsTrigger value="past">Past Trips</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingTrips.length > 0 ? (
            <TripsList 
              trips={upcomingTrips} 
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
      </Tabs>
    </div>
  );
};

export default DashboardTabs;
