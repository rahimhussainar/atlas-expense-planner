import React from 'react';
import { useParams } from 'react-router-dom';
import { useTripDetail } from '@/hooks/useTripDetail';
import { useTripParticipants } from '@/hooks/useTripParticipants';
import { useTripActivities } from '@/hooks/useTripActivities';
import { useTripExpenses } from '@/hooks/useTripExpenses';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import { Card } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Activity } from 'lucide-react';

// Helper to check for relation errors
const isRelationError = (error) => {
  return error && typeof error === 'string' && error.toLowerCase().includes('relation');
};

// Placeholder for ExpenseChart
const ExpenseChart = ({ expenses }) => (
  <Card className="p-6 h-full flex flex-col justify-center items-center">
    <div className="font-semibold mb-2">Expense Breakdown</div>
    {/* TODO: Implement pie/bar chart for expenses */}
    <div className="text-gray-400">[Expense Chart Coming Soon]</div>
  </Card>
);

// Placeholder for ActivityTimeline
const ActivityTimeline = ({ activities }) => (
  <Card className="p-6 h-full">
    <div className="font-semibold mb-2">Upcoming Activities</div>
    {/* TODO: Implement timeline/list for activities */}
    <div className="text-gray-400">[Activity Timeline Coming Soon]</div>
  </Card>
);

const StatCard = ({ icon, title, value, subtitle, colorClass }) => (
  <Card className="flex flex-col items-start p-6 h-full">
    <div className={`mb-2 flex items-center gap-2 ${colorClass}`}>{icon}<span className="font-semibold">{title}</span></div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-gray-500 text-sm">{subtitle}</div>
    <div className="w-full h-2 bg-gray-100 rounded-full mt-2" />
  </Card>
);

const ParticipantList = ({ participants }) => (
  <Card className="p-6 mt-8">
    <div className="font-semibold mb-4">Participants</div>
    <div className="flex flex-wrap gap-4">
      {participants.length === 0 ? (
        <div className="text-gray-400">No participants yet.</div>
      ) : (
        participants.map((p) => (
          <div key={p.id} className="flex flex-col items-center">
            {/* TODO: Replace with Avatar component if available */}
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500 mb-1">
              {p.email ? p.email[0].toUpperCase() : '?'}
            </div>
            <div className="text-xs text-gray-700">{p.email || p.user_id}</div>
            <div className="text-xs text-gray-400">{p.rsvp_status}</div>
          </div>
        ))
      )}
    </div>
  </Card>
);

const TripDashboard = () => {
  const { tripId } = useParams();
  const { trip, loading: tripLoading, error: tripError } = useTripDetail(tripId);
  const { participants, loading: participantsLoading } = useTripParticipants(tripId);
  const { activities, loading: activitiesLoading } = useTripActivities(tripId);
  const { expenses, loading: expensesLoading } = useTripExpenses(tripId);

  if (tripLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!trip) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Trip not found.</div>;
  }

  // Stats
  const confirmedParticipants = participants.filter(p => p.rsvp_status === 'accepted').length;
  const totalParticipants = participants.length;
  const confirmedActivities = activities.filter(a => a.status === 'confirmed').length;
  const totalActivities = activities.length;
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const countdown = trip.start_date ? Math.max(0, Math.ceil((new Date(trip.start_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : '-';

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        {/* Trip Header */}
        <div className="mb-8">
          <div className="text-3xl font-bold mb-1">{trip.title}</div>
          <div className="text-gray-500 mb-2">
            {trip.start_date && trip.end_date && (
              <>
                {new Date(trip.start_date).toLocaleDateString()} to {new Date(trip.end_date).toLocaleDateString()} · {trip.destination}
              </>
            )}
          </div>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="text-blue-500" />}
            title="Family Members"
            value={confirmedParticipants}
            subtitle={`confirmed of ${totalParticipants} invited`}
            colorClass="text-blue-500"
          />
          <StatCard
            icon={<Activity className="text-teal-500" />}
            title="Activities"
            value={confirmedActivities}
            subtitle={`confirmed of ${totalActivities} planned`}
            colorClass="text-teal-500"
          />
          <StatCard
            icon={<DollarSign className="text-green-600" />}
            title="Budget"
            value={`$${totalExpenses.toFixed(2)}`}
            subtitle="total expenses"
            colorClass="text-green-600"
          />
          <StatCard
            icon={<Calendar className="text-orange-500" />}
            title="Countdown"
            value={typeof countdown === 'number' ? `${countdown} days` : '-'}
            subtitle="until departure"
            colorClass="text-orange-500"
          />
        </div>
        {/* Charts and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ExpenseChart expenses={expenses} />
          <ActivityTimeline activities={activities} />
        </div>
        {/* Participants */}
        <ParticipantList participants={participants} />
      </div>
    </div>
  );
};

export default TripDashboard; 