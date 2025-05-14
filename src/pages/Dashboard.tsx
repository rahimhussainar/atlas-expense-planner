
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import TripsList from '@/components/Dashboard/TripsList';

export interface Trip {
  id: string;
  title: string;
  destination: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  currency: string;
  cover_image: string | null;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's trips
  useEffect(() => {
    console.log("Dashboard mounted");
    const fetchTrips = async () => {
      try {
        setLoading(true);
        
        // With our fixed RLS policies, this query will now work correctly
        // and only return trips the user has access to
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setTrips(data || []);
      } catch (error: any) {
        console.error("Error fetching trips:", error);
        toast({
          title: 'Error',
          description: `Failed to load trips: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTrips();
    }
  }, [toast, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Trips</h1>
          <Button 
            onClick={() => navigate('/trips/new')} 
            className="bg-atlas-forest hover:bg-atlas-forest/90"
          >
            <Plus className="mr-2 h-4 w-4" /> New Trip
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atlas-forest" />
          </div>
        ) : trips.length > 0 ? (
          <TripsList trips={trips} />
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="font-semibold text-xl mb-2">No trips yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first trip to start planning your adventure!
            </p>
            <Button 
              onClick={() => navigate('/trips/new')} 
              className="bg-atlas-forest hover:bg-atlas-forest/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Trip
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
