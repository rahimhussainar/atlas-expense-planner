import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import { Card } from '@/components/ui/card';
import { Users, Activity as ActivityIcon, DollarSign, Calendar, Settings, Sun, Moon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/Dashboard/StatCard';
import { useTheme } from '@/components/ThemeProvider';

const TripDashboard: React.FC = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch trip
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('id', id)
          .single();
        if (tripError) throw tripError;
        setTrip(tripData);

        // Fetch participants
        const { data: participantData, error: participantError } = await supabase
          .from('trip_participants')
          .select('*')
          .eq('trip_id', id);
        if (participantError) throw participantError;
        setParticipants(participantData || []);

        // Fetch activities
        const { data: activityData, error: activityError } = await supabase
          .from('trip_activities')
          .select('*')
          .eq('trip_id', id);
        if (activityError) throw activityError;
        setActivities(activityData || []);

        // Fetch expenses
        const { data: expenseData, error: expenseError } = await supabase
          .from('trip_expenses')
          .select('*')
          .eq('trip_id', id);
        if (expenseError) throw expenseError;
        setExpenses(expenseData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load trip data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  // Confirmed participants: RSVP status === 'confirmed' or 'accepted'
  const confirmedParticipants = useMemo(
    () => participants.filter(p => {
      const status = (p.rsvp_status || '').toLowerCase();
      return status === 'confirmed' || status === 'accepted';
    }),
    [participants]
  );
  const confirmedActivities = useMemo(() => activities.filter(a => a.status === 'confirmed'), [activities]);

  // Progress bar logic
  const participantProgress = participants.length > 0 ? (confirmedParticipants.length / participants.length) * 100 : 0;
  const activityProgress = activities.length > 0 ? (confirmedActivities.length / activities.length) * 100 : 0;

  // Countdown progress (trip progress)
  const countdownProgress = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return 0;
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const now = new Date();
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    if (now < start) return 0;
    if (now > end) return 100;
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }, [trip]);

  // Countdown label
  const countdownInfo = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return { label: '-', color: 'text-foreground' };
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const now = new Date();
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    if (now < start) {
      const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { label: `${diff} days`, color: 'text-foreground' };
    } else if (now >= start && now <= end) {
      return { label: 'Trip in Progress', color: 'text-foreground font-semibold' };
    } else {
      return { label: 'Trip Ended', color: 'text-foreground font-semibold' };
    }
  }, [trip]);

  // --- Expenses logic ---
  // For demo, let's assume fixed costs are in trip_expenses table with a 'type' or 'is_fixed' flag
  // We'll mock this for now, but you can later fetch from supabase
  // Example: const fixedExpenses = expenses.filter(e => e.is_fixed)
  // For now, just sum all expenses with a 'fixed' flag
  const fixedCosts = useMemo(() => expenses.filter(e => e.is_fixed), [expenses]);
  const totalFixedCosts = useMemo(() => fixedCosts.reduce((sum, e) => sum + (e.amount || 0), 0), [fixedCosts]);

  // Stat cards
  const statCards = [
    {
      icon: <Users className="text-blue-500" size={22} />,
      title: 'Participants',
      value: confirmedParticipants.length,
      subtitle: `confirmed of ${participants.length} invited`,
      progressBar: (
        <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden relative">
          <div
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${participantProgress}%`, zIndex: 2 }}
          />
          <div
            className="absolute left-0 top-0 h-full bg-blue-300 rounded-full transition-all duration-300"
            style={{ width: `${participants.length > 0 ? 100 : 0}%`, zIndex: 1 }}
          />
        </div>
      ),
    },
    {
      icon: <ActivityIcon className="text-emerald-500" size={22} />,
      title: 'Activities',
      value: confirmedActivities.length,
      subtitle: `confirmed of ${activities.length} planned`,
      progressBar: (
        <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden relative">
          <div
            className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${activityProgress}%`, zIndex: 2 }}
          />
          <div
            className="absolute left-0 top-0 h-full bg-emerald-200 rounded-full transition-all duration-300"
            style={{ width: `${activities.length > 0 ? 100 : 0}%`, zIndex: 1 }}
          />
        </div>
      ),
    },
    {
      icon: <DollarSign className="text-atlas-forest" size={22} />,
      title: 'Expenses',
      value: `$${totalFixedCosts.toLocaleString()}`,
      subtitle: 'total fixed costs',
      progressBar: null,
    },
  ];

  // Only show countdown card if trip hasn't started
  const showCountdown = countdownInfo.label !== 'Trip in Progress' && countdownInfo.label !== 'Trip Ended';
  if (showCountdown) {
    statCards.push({
      icon: <Calendar className="text-orange-500" size={22} />,
      title: 'Countdown',
      value: countdownInfo.label,
      subtitle: countdownInfo.label === 'Trip in Progress' ? 'Trip has started' : countdownInfo.label === 'Trip Ended' ? 'Hope you had fun!' : 'until departure',
      progressBar: (
        <div className="w-full h-3 bg-orange-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${countdownProgress}%` }}
          />
        </div>
      ),
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
        <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-4xl font-bold mb-1 truncate">{trip?.trip_title || 'Trip'}</h1>
            <p className="text-lg text-gray-500 truncate">
              {trip?.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              {' '}to{' '}
              {trip?.end_date ? new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              {trip?.destination ? ` · ${trip.destination}` : ''}
            </p>
          </div>
          <button className="ml-4 p-2 rounded-full text-gray-400 hover:text-gray-700 transition-colors" title="Trip Settings" aria-label="Trip Settings">
            <Settings size={24} />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atlas-forest" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-8 flex flex-col items-center h-48 justify-center">
    <div className="font-semibold mb-2">Expense Breakdown</div>
    <div className="text-gray-400">[Expense Chart Coming Soon]</div>
  </Card>
              <Card className="p-8 flex flex-col items-center h-48 justify-center">
    <div className="font-semibold mb-2">Upcoming Activities</div>
    <div className="text-gray-400">[Activity Timeline Coming Soon]</div>
  </Card>
            </div>
          </>
      )}
      </main>
    </div>
);
};

export default TripDashboard;