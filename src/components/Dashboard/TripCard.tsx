
import React from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '@/types/trip';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface TripCardProps {
  trip: Trip;
  onEditTrip?: (trip: Trip) => void;
  onDeleteTrip?: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onDeleteTrip, onEditTrip }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <Link to={`/trips/${trip.id}`} className="block transition-all hover:shadow-md">
      <Card className="h-full overflow-hidden bg-white border-0 shadow-sm">
        <div className="relative aspect-[16/9] overflow-hidden">
          {trip.cover_image ? (
            <img 
              src={trip.cover_image} 
              alt={trip.title} 
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-300 to-slate-200 flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{trip.title}</h3>
          
          {trip.destination && (
            <div className="flex items-center mt-2 text-sm text-slate-600">
              <MapPinIcon className="w-4 h-4 mr-1 text-slate-400" />
              <span className="line-clamp-1">{trip.destination}</span>
            </div>
          )}
          
          {(trip.start_date || trip.end_date) && (
            <div className="flex items-center mt-2 text-sm text-slate-600">
              <CalendarIcon className="w-4 h-4 mr-1 text-slate-400" />
              <span>
                {formatDate(trip.start_date)} 
                {trip.end_date && trip.start_date ? ' - ' : ''}
                {trip.end_date && trip.start_date !== trip.end_date ? formatDate(trip.end_date) : ''}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="px-4 py-3 border-t border-gray-100">
          <div className="w-full flex justify-end space-x-2">
            {onEditTrip && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onEditTrip(trip);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            )}
            {onDeleteTrip && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onDeleteTrip(trip);
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default TripCard;
