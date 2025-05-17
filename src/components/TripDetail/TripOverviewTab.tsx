
import React from 'react';
import { Trip } from '@/types/trip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTripActivities } from '@/hooks/useTripActivities';
import { useTripExpenses } from '@/hooks/useTripExpenses';
import { useTripParticipants } from '@/hooks/useTripParticipants';
import { CalendarIcon, Users, Activity, DollarSign, Loader2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface TripOverviewTabProps {
  trip: Trip;
}

const TripOverviewTab: React.FC<TripOverviewTabProps> = ({ trip }) => {
  const { activities, loading: activitiesLoading } = useTripActivities(trip.id);
  const { expenses, loading: expensesLoading } = useTripExpenses(trip.id);
  const { participants, loading: participantsLoading } = useTripParticipants(trip.id);
  
  const confirmedActivities = activities.filter(a => a.status === 'confirmed');
  
  // Calculate trip duration
  const tripDuration = trip.start_date && trip.end_date
    ? differenceInDays(new Date(trip.end_date), new Date(trip.start_date)) + 1
    : 0;
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  
  // Format date range
  const formatDateRange = () => {
    if (!trip.start_date) return 'Dates not set';
    
    try {
      const start = format(new Date(trip.start_date), 'MMM d, yyyy');
      if (!trip.end_date || trip.start_date === trip.end_date) return start;
      const end = format(new Date(trip.end_date), 'MMM d, yyyy');
      return `${start} - ${end}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  const loading = activitiesLoading || expensesLoading || participantsLoading;
  
  return (
    <div className="space-y-6">
      {/* Trip Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trip Duration */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Trip Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : tripDuration > 0 ? `${tripDuration} days` : 'Not set'}
                </p>
                <p className="text-xs text-gray-500">{formatDateRange()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Participants */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : participants.length}
                </p>
                <p className="text-xs text-gray-500">
                  {participants.filter(p => p.rsvp_status === 'accepted').length} confirmed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Activities */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : activities.length}
                </p>
                <p className="text-xs text-gray-500">
                  {confirmedActivities.length} confirmed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Expenses */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `$${totalExpenses.toFixed(2)}`}
                </p>
                <p className="text-xs text-gray-500">
                  {expenses.length} expense entries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : confirmedActivities.length > 0 ? (
            <div className="space-y-4">
              {confirmedActivities
                .filter(a => a.date && new Date(a.date) >= new Date())
                .sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime())
                .slice(0, 3)
                .map(activity => (
                  <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                    <div className="mr-4 bg-blue-100 text-blue-600 p-2 rounded">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      {activity.date && (
                        <p className="text-sm text-gray-500">
                          {format(new Date(activity.date), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming activities scheduled</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripOverviewTab;
