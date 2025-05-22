export interface TripActivity {
  id: string;
  trip_id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: string | null;
  created_by: string;
  status: 'suggested' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
  category?: string;
}

export interface ActivityVote {
  id: string;
  activity_id: string;
  user_id: string;
  vote: boolean;
  created_at: string;
}
