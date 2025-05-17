
import React, { useState } from 'react';
import { useTripActivities } from '@/hooks/useTripActivities';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2 } from 'lucide-react';
import ActivityCard from './ActivityCard';
import CreateActivityDialog from './CreateActivityDialog';

interface TripActivitiesTabProps {
  tripId: string;
  isCreator: boolean;
}

const TripActivitiesTab: React.FC<TripActivitiesTabProps> = ({ 
  tripId, 
  isCreator 
}) => {
  const [activityFilter, setActivityFilter] = useState<'all' | 'suggested' | 'confirmed'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { 
    activities, 
    loading, 
    fetchActivities,
    updateActivity,
    deleteActivity
  } = useTripActivities(tripId);
  
  // Filter activities based on current tab
  const filteredActivities = activities.filter(activity => {
    if (activityFilter === 'all') return true;
    return activity.status === activityFilter;
  });
  
  // Sort activities by date (null dates at the end)
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const handleStatusChange = (activityId: string, status: 'suggested' | 'confirmed' | 'cancelled') => {
    updateActivity(activityId, { status });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Tabs 
          value={activityFilter} 
          onValueChange={(v) => setActivityFilter(v as 'all' | 'suggested' | 'confirmed')}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="suggested">Suggested</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>
      
      {/* Activities List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : sortedActivities.length > 0 ? (
        <div className="space-y-4">
          {sortedActivities.map(activity => (
            <ActivityCard 
              key={activity.id}
              activity={activity}
              isCreator={isCreator}
              onStatusChange={handleStatusChange}
              onDelete={() => deleteActivity(activity.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No activities found</p>
            <Button onClick={() => setShowCreateDialog(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Activity
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Create Activity Dialog */}
      <CreateActivityDialog
        tripId={tripId}
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchActivities();
        }}
      />
    </div>
  );
};

export default TripActivitiesTab;
