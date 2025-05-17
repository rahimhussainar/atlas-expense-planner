
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trip } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPinIcon, Edit } from 'lucide-react';
import ShareTripDialog from './ShareTripDialog';

interface TripDetailHeaderProps {
  trip: Trip;
  isCreator: boolean;
  onEdit: () => void;
}

const TripDetailHeader: React.FC<TripDetailHeaderProps> = ({
  trip,
  isCreator,
  onEdit
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 lg:h-80 w-full overflow-hidden rounded-lg mb-6">
        {trip.cover_image ? (
          <img 
            src={trip.cover_image} 
            alt={trip.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center">
            <span className="text-gray-400 text-lg">No cover image</span>
          </div>
        )}
      </div>
      
      {/* Trip Details */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
          
          <div className="mt-2 space-y-2">
            {trip.destination && (
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="w-5 h-5 mr-2 text-gray-500" />
                <span>{trip.destination}</span>
              </div>
            )}
            
            {(trip.start_date || trip.end_date) && (
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                <span>
                  {formatDate(trip.start_date)}
                  {trip.start_date && trip.end_date && trip.start_date !== trip.end_date && ' - '}
                  {trip.end_date && trip.start_date !== trip.end_date && formatDate(trip.end_date)}
                </span>
              </div>
            )}
          </div>
          
          {trip.description && (
            <p className="mt-4 text-gray-600">{trip.description}</p>
          )}
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setShowShareDialog(true)}
          >
            Share Trip
          </Button>
          
          {isCreator && (
            <Button 
              onClick={onEdit}
              className="flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Trip
            </Button>
          )}
        </div>
      </div>
      
      {/* Share Dialog */}
      <ShareTripDialog
        tripId={trip.id}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </div>
  );
};

export default TripDetailHeader;
