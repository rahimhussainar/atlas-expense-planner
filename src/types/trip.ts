
export interface Trip {
  id: string;
  title: string;
  destination: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  currency: string;
  cover_image: string | null;
  created_at: string;
}
