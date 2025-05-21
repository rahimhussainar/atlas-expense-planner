import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Pencil, Trash2, ChevronDown, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '@/types/trip';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

interface TripCardProps {
  trip: Trip;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEditTrip, onDeleteTrip }) => {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
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

  // Check if description content overflows
  useEffect(() => {
    if (descriptionRef.current && trip.description) {
      const element = descriptionRef.current;
      const hasOverflowContent = element.scrollHeight > element.clientHeight;
      setHasOverflow(hasOverflowContent);
    } else {
      setHasOverflow(false);
    }
  }, [trip.description]);

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
    <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col h-full transition-all duration-200 overflow-hidden relative group hover:shadow-lg hover:-translate-y-1 hover:scale-105">
      <div
        className="h-40 w-full bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${coverImage})` }}
        onClick={() => navigate(`/trips/${trip.id}`)}
        aria-label={`Go to trip: ${trip.title}`}
        title={trip.title}
      />
      <div className="p-4 flex flex-col flex-1 gap-3 pb-14">
        <div className="flex flex-row items-start gap-4 mb-1">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-card-foreground truncate">{trip.title}</h2>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="mr-1 h-4 w-4" />
              <span className="truncate">{trip.destination}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-xs mt-1">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-end min-w-[90px] pl-4 border-l border-border ml-2 gap-2">
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[11px] text-muted-foreground font-medium">Participants</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                <Users className="h-3 w-3" />
                <span className="leading-none">{confirmedParticipants.length}</span>
                <span className="text-xs text-muted-foreground font-semibold leading-none">/ {participants.length}</span>
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[11px] text-muted-foreground font-medium">Expenses</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                <DollarSign className="h-3 w-3" />
                <span className="leading-none">{totalFixedCosts.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
        <Separator className="my-1" />
        <div
          ref={descriptionRef}
          className={`text-muted-foreground text-sm whitespace-pre-line transition-all duration-200 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}
        >
          {trip.description}
        </div>
        {/* Future: Add expenses/participants here as new sections */}
      </div>
      {/* Bottom controls: left = expand/collapse, right = edit/delete (on hover) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {hasOverflow && (
            <button
              type="button"
              aria-label={expanded ? 'Collapse details' : 'Expand details'}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
              className="p-2 rounded-full text-muted-foreground hover:text-atlas-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-forest transition-colors bg-transparent"
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
        <div className="flex gap-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className="p-2 rounded-full text-muted-foreground hover:text-atlas-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-forest transition-colors bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              onEditTrip(trip);
            }}
            aria-label="Edit trip"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-full text-red-500 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTrip(trip);
            }}
            aria-label="Delete trip"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
