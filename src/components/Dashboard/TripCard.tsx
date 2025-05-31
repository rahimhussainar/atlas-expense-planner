import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Pencil, Trash2, ChevronDown, ChevronUp, Users, DollarSign, Trash, Image as ImageIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '@/types/trip';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { ItemCardActions } from '@/components/shared/ItemCardActions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TripCardProps {
  trip: Trip;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = React.memo(({ trip, onEditTrip, onDeleteTrip }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [participants, setParticipants] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  const isCreator = user && trip.created_by === user.id;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    // Fetch participants and expenses for this trip
    const fetchMeta = async () => {
      if (!trip.id) return;
      // Participants
      const { data: participantData } = await supabase
        .from('trip_participants')
        .select('*')
        .eq('trip_id', trip.id);
      setParticipants(participantData || []);
      // Expenses
      const { data: expenseData } = await supabase
        .from('trip_expenses')
        .select('*')
        .eq('trip_id', trip.id);
      setExpenses(expenseData || []);
    };
    fetchMeta();
  }, [trip.id]);

  // Confirmed participants: RSVP status === 'confirmed' or 'accepted'
  const confirmedParticipants = participants.filter(p => {
    const status = (p.rsvp_status || '').toLowerCase();
    return status === 'confirmed' || status === 'accepted';
  });
  // Fixed expenses
  const fixedCosts = expenses.filter(e => e.is_fixed);
  const totalFixedCosts = fixedCosts.reduce((sum, e) => sum + (e.amount || 0), 0);

  const startDate = formatDate(trip.start_date);
  const endDate = formatDate(trip.end_date);

  const coverImage = trip.cover_image || 'https://images.unsplash.com/photo-1496950866446-3253e1470e8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

  return (
    <div className="group relative">
      <div className="bg-white dark:bg-[#272829] rounded-xl border border-gray-200 dark:border-white/10 transition-all shadow-sm hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-0.5">
        {/* Edit/Delete actions */}
        <ItemCardActions 
          onEdit={() => onEditTrip(trip)}
          onDelete={() => onDeleteTrip(trip)}
          position="bottom-right"
        />
        
        <div 
          className="flex p-4 space-x-4 cursor-pointer"
          onClick={() => navigate(`/trips/${trip.id}`)}
        >
          {/* Trip Image - Thumbnail */}
          <div className="relative w-24 h-24 flex-shrink-0">
            {coverImage ? (
              <img 
                src={coverImage} 
                alt={trip.title}
                className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-white/10"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-lg">
                <ImageIcon className="h-6 w-6 text-gray-400 dark:text-white/40" />
              </div>
            )}
          </div>
          
          {/* Trip Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white break-words line-clamp-2">{trip.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{trip.destination}</span>
                </div>
                {startDate && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{startDate}{endDate && startDate !== endDate ? ` - ${endDate}` : ''}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-gray-500 dark:text-gray-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{confirmedParticipants.length}</span>
                <span className="text-xs text-gray-500 dark:text-gray-600">/ {participants.length}</span>
              </div>
              {totalFixedCosts > 0 && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-gray-500 dark:text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">${totalFixedCosts.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Expandable Content */}
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          {trip.description && !expanded && (
            <CollapsibleTrigger asChild>
              <button 
                className="w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center transition-colors duration-200 bg-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-500 transition-transform duration-200 ease-in-out" />
              </button>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <div className="px-4 py-4 bg-transparent">
              {trip.description && (
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-gray-500 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{trip.description}</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
          {trip.description && expanded && (
            <CollapsibleTrigger asChild>
              <button 
                className="w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center transition-colors duration-200 bg-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-500 transition-transform duration-200 ease-in-out" />
              </button>
            </CollapsibleTrigger>
          )}
        </Collapsible>
      </div>
    </div>
  );
});

TripCard.displayName = 'TripCard';

export default TripCard;
