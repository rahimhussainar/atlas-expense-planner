
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTripDetail } from '@/hooks/useTripDetail';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import TripDetailHeader from '@/components/TripDetail/TripDetailHeader';
import TripDetailTabs from '@/components/TripDetail/TripDetailTabs';
import EditTripDialog from '@/components/Dashboard/EditTripDialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const TripDetail = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const { trip, loading, error } = useTripDetail(tripId);
  const [editTrip, setEditTrip] = useState<boolean>(false);
  
  const isCreator = user && trip ? user.id === trip.created_by : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading trip details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Trip</h2>
            <p className="text-gray-600">{error || 'Trip not found'}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-6">
        <TripDetailHeader
          trip={trip}
          isCreator={isCreator}
          onEdit={() => setEditTrip(true)}
        />
        
        <div className="mt-6">
          <TripDetailTabs 
            trip={trip} 
            isCreator={isCreator}
          />
        </div>
      </div>

      {/* Edit Trip Dialog */}
      <EditTripDialog
        trip={editTrip ? trip : null}
        onClose={() => setEditTrip(false)}
        onSuccess={() => {
          setEditTrip(false);
          // No need to refresh, the browser will reload the page
          window.location.reload();
        }}
      />
    </div>
  );
};

export default TripDetail;
