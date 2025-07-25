
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://aqncxoewceqjaodhaavy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbmN4b2V3Y2VxamFvZGhhYXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjgwOTAsImV4cCI6MjA2Mjc0NDA5MH0.XT-8ElEu9JZEiq6TiH9iXKsnNe4SF0t7TKnidCOppO4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
    // Removed the global headers that were forcing 'application/json' content type
  }
);
