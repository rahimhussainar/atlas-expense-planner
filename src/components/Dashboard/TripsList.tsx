import React, { useState } from 'react';
import { Trip } from '@/types/trip';
import TripCard from './TripCard';
import DeleteTripDialog from './DeleteTripDialog';
import EditTripDialog from './EditTripDialog';
import { useTripActions } from '@/hooks/useTripActions';

interface TripsListProps {
  trips: Trip[];
  onTripDeleted?: () => void;
  onTripUpdated?: () => void;
  highlightCurrent?: boolean;
}

const TripsList: React.FC<TripsListProps> = ({ trips, onTripDeleted, onTripUpdated, highlightCurrent }) => {
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
  const { tripToDelete, setTripToDelete, isDeleting, handleDeleteTrip } = useTripActions(onTripDeleted);

  const handleEdit = (trip: Trip) => {
    setTripToEdit(trip);
  };

  const handleUpdateSuccess = () => {
    setTripToEdit(null);
    onTripUpdated?.();
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard 
            key={trip.id} 
            trip={trip} 
            onEditTrip={handleEdit} 
            onDeleteTrip={setTripToDelete} 
            isCurrent={!!highlightCurrent}
          />
        ))}
      </div>

      {/* Delete Trip Dialog */}
      <DeleteTripDialog
        trip={tripToDelete}
        isDeleting={isDeleting}
        onCancel={() => setTripToDelete(null)}
        onConfirmDelete={handleDeleteTrip}
      />

      {/* Edit Trip Dialog */}
      <EditTripDialog
        trip={tripToEdit}
        onClose={() => setTripToEdit(null)}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default TripsList;
