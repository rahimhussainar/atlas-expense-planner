
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import TripForm from '@/components/Dashboard/TripForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CreateTrip: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      let coverImageUrl = null;
      
      if (formData.coverImage) {
        coverImageUrl = await formData.uploadImage(user!.id);
      }

      const { data, error } = await supabase
        .from('trips')
        .insert({
          trip_title: formData.title,
          destination: formData.destination || null,
          description: formData.description || null,
          start_date: formData.startDate?.toISOString() || null,
          end_date: formData.endDate?.toISOString() || null,
          cover_image: coverImageUrl,
          created_by: user!.id,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Trip Created!',
        description: 'Your trip has been successfully created.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error Creating Trip',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Trip</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <TripForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitButtonText="Create Trip"
            />
            <div className="mt-4 flex justify-start">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateTrip;
