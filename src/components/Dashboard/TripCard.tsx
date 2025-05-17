import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '@/types/trip';

interface TripCardProps {
  trip: Trip;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEditTrip, onDeleteTrip }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return null;
    }
  };

  const startDate = formatDate(trip.start_date);
  const endDate = formatDate(trip.end_date);

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ 
          backgroundImage: trip.cover_image
            ? `url(${trip.cover_image})`
            : 'url(https://images.unsplash.com/photo-1496950866446-3253e1470e8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
        }}
      />
      <CardContent className="pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{trip.title}</h3>
        </div>
        {trip.destination && (
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{trip.destination}</span>
          </div>
        )}
        {(startDate || endDate) && (
          <div className="flex items-center text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm">
              {startDate && endDate 
                ? `${startDate} - ${endDate}`
                : startDate || endDate}
            </span>
          </div>
        )}
        {/* Expandable section for more info */}
        {expanded && trip.description && (
          <div className="mt-2 text-gray-700 text-sm whitespace-pre-line">
            {trip.description}
          </div>
        )}
      </CardContent>
      {/* Bottom controls: left = expand/collapse, right = edit/delete (on hover) */}
      <div className="flex items-center justify-between px-4 pb-3 pt-2">
        <button
          type="button"
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
          onClick={() => setExpanded((v) => !v)}
          className="p-1.5 rounded-full text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditTrip(trip);
            }}
            className="p-1.5 rounded-full text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTrip(trip);
            }}
            className="p-1.5 rounded-full text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default TripCard;
