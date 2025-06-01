import { 
  PartyPopper, 
  Utensils, 
  Building2, 
  TreePine, 
  ShoppingBag, 
  MapPin 
} from 'lucide-react';

// Activity Categories
export const ACTIVITY_CATEGORIES = [
  { value: 'fun', label: 'Fun', icon: PartyPopper },
  { value: 'food', label: 'Food', icon: Utensils },
  { value: 'culture', label: 'Culture', icon: Building2 },
  { value: 'nature', label: 'Nature', icon: TreePine },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'other', label: 'Other', icon: MapPin },
] as const;

// Category Badge Styles
export const CATEGORY_BADGE_STYLES = {
  fun: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  food: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  sightseeing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  adventure: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  nightlife: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300',
  shopping: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300',
  cultural: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
  relaxation: 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
} as const;

// Type definitions
export type ActivityCategory = typeof ACTIVITY_CATEGORIES[number]['value'];
export type CostType = 'total' | 'perPerson';

export interface BusinessDetails {
  name: string | null;
  address: string | null;
  rating: number | null;
  website: string | null;
  lat: number | null;
  lng: number | null;
  totalRatings: number | null;
}

export interface ActivityFormData {
  id?: string;
  title: string;
  category: ActivityCategory;
  costType: CostType;
  cost: string;
  description: string;
  business: BusinessDetails | null;
  place: string;
  placeId: string | null;
  thumbnail: File | null;
} 