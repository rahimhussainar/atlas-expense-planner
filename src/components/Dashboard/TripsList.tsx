
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Trip } from '@/pages/Dashboard';

interface TripsListProps {
  trips: Trip[];
}

const TripsList: React.FC<TripsListProps> = ({ trips }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return null;
    }
  };

  const getTripStatus = (trip: Trip) => {
    const now = new Date();
    if (!trip.start_date && !trip.end_date) return null;
    
    try {
      const startDate = trip.start_date ? new Date(trip.start_date) : null;
      const endDate = trip.end_date ? new Date(trip.end_date) : null;
      
      if (startDate && startDate > now) {
        return { label: 'Upcoming', color: 'bg-blue-500' };
      } else if (endDate && endDate < now) {
        return { label: 'Past', color: 'bg-gray-500' };
      } else if (startDate && endDate && startDate <= now && endDate >= now) {
        return { label: 'Active', color: 'bg-green-500' };
      }
      return null;
    } catch (e) {
      return null;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => {
        const tripStatus = getTripStatus(trip);
        const startDate = formatDate(trip.start_date);
        const endDate = formatDate(trip.end_date);
        
        return (
          <Card 
            key={trip.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            <div 
              className="h-48 bg-cover bg-center" 
              style={{ 
                backgroundImage: trip.cover_image
                  ? `url(${trip.cover_image})`
                  : 'url(https://images.unsplash.com/photo-1496950866446-3253e1470e8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
              }}
            />
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{trip.title}</h3>
                {tripStatus && (
                  <Badge className={`${tripStatus.color} hover:${tripStatus.color}`}>
                    {tripStatus.label}
                  </Badge>
                )}
              </div>
              
              {trip.destination && (
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm line-clamp-1">{trip.destination}</span>
                </div>
              )}
              
              {(startDate || endDate) && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {startDate && endDate 
                      ? `${startDate} - ${endDate}`
                      : startDate || endDate}
                  </span>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-3 text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Created {format(new Date(trip.created_at), 'MMM d, yyyy')}</span>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default TripsList;
