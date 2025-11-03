import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for pre-registration data
export interface PreRegistration {
  id?: string;
  contact_type: 'email' | 'instagram' | 'kakao' | 'phone';
  contact_value: string;
  country: string;
  age_range: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  created_at?: string;
  updated_at?: string;
}
