
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '@/pages/Dashboard';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import EditTripForm from './EditTripForm';

interface TripsListProps {
  trips: Trip[];
  onTripDeleted?: () => void;
  onTripUpdated?: () => void;
}

const TripsList: React.FC<TripsListProps> = ({ trips, onTripDeleted, onTripUpdated }) => {
  const { toast } = useToast();
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return null;
    }
  };

  const handleDelete = async () => {
    if (!tripToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripToDelete.id);
        
      if (error) throw error;
      
      toast({
        title: 'Trip Deleted',
        description: 'The trip has been successfully deleted.',
      });
      
      onTripDeleted?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete trip. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setTripToDelete(null);
    }
  };

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
        {trips.map((trip) => {
          const startDate = formatDate(trip.start_date);
          const endDate = formatDate(trip.end_date);
          
          return (
            <Card 
              key={trip.id} 
              className="group relative overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <div 
                className="h-48 bg-cover bg-center" 
                style={{ 
                  backgroundImage: trip.cover_image
                    ? `url(${trip.cover_image})`
                    : 'url(https://images.unsplash.com/photo-1496950866446-3253e1470e8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
                }}
              />
              
              {/* Updated hover controls - positioned at bottom right */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(trip);
                  }}
                  className="p-1.5 rounded-full bg-white/70 hover:bg-white text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTripToDelete(trip);
                  }}
                  className="p-1.5 rounded-full bg-white/70 hover:bg-white text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{trip.title}</h3>
                
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
                
                {trip.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {trip.description}
                  </p>
                )}
              </CardContent>
              
              <CardFooter className="border-t pt-3 text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>Created {format(new Date(trip.created_at), 'MMM d, yyyy')}</span>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Delete Trip Dialog */}
      <AlertDialog open={!!tripToDelete} onOpenChange={() => setTripToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Trip Dialog */}
      <Dialog open={!!tripToEdit} onOpenChange={(open) => !open && setTripToEdit(null)}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
          </DialogHeader>
          {tripToEdit && (
            <EditTripForm 
              trip={tripToEdit} 
              onSuccess={handleUpdateSuccess} 
              onCancel={() => setTripToEdit(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TripsList;
