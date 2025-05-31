import { BaseItem, ItemWithImage, ItemWithCost, ItemWithLocation } from './shared';

export interface TripActivity extends BaseItem, ItemWithImage, ItemWithCost, ItemWithLocation {
  trip_id: string;
  title: string;
  description: string | null;
  date: string | null;
  status: 'suggested' | 'confirmed' | 'cancelled';
  category?: string;
}

export interface ActivityVote {
  id: string;
  activity_id: string;
  user_id: string;
  vote: boolean;
  created_at: string;
}
