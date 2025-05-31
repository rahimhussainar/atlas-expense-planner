// Shared base types for items with common properties
export interface BaseItem {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  created_by_name?: string;
}

export interface ItemWithImage {
  image: string | null;
}

export interface ItemWithCost {
  price_type: 'per_person' | 'total';
  price: number | null;
  total_price: number | null;
}

export interface ItemWithLocation {
  location: string | null;
  business_name?: string | null;
  business_address?: string | null;
  business_rating?: number | null;
  business_website?: string | null;
  business_total_ratings?: number | null;
}

// Common form modes
export type FormMode = 'add' | 'edit';

// Common dialog props
export interface BaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: FormMode;
  loading?: boolean;
}

// Common card props
export interface BaseCardProps {
  onEdit: () => void;
  onDelete: () => void;
  expanded?: boolean;
  onExpand?: (expanded: boolean) => void;
}

// Voter information
export interface VoterInfo {
  voters: string[];
  voterProfiles?: any[];
}

// Common status types
export type ItemStatus = 'suggested' | 'confirmed' | 'cancelled' | 'pending' | 'completed'; 