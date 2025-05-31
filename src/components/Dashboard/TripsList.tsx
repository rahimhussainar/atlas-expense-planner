import React from 'react';
import { Trip } from '@/types/trip';
import TripCard from './TripCard';

interface TripsListProps {
  trips: Trip[];
  onTripDeleted?: () => void;
  onTripUpdated?: () => void;
  onEditTrip?: (trip: Trip) => void;
  onDeleteTrip?: (trip: Trip) => void;
}

const TripsList: React.FC<TripsListProps> = React.memo(({ 
  trips, 
  onEditTrip = () => {}, 
  onDeleteTrip = () => {} 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard 
          key={trip.id} 
          trip={trip} 
          onEditTrip={onEditTrip} 
          onDeleteTrip={onDeleteTrip} 
        />
      ))}
    </div>
  );
});

TripsList.displayName = 'TripsList';

export default TripsList;
