
export interface TripParticipant {
  id: string;
  trip_id: string;
  user_id: string | null;
  email: string | null;
  rsvp_status: 'pending' | 'accepted' | 'declined';
}
